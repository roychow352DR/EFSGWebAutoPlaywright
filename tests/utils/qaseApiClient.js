const path = require('path');
//const { FormData } = require('formdata-node');
const { fileFromPath } = require('formdata-node/file-from-path');
const fs = require('fs');
const FormData = require('form-data');

class qaseApiClient {
    static BASE_URL = "https://api.qase.io/v1/"
    constructor(token, projectCode) {
        this.token = token;
        this.projectCode = projectCode;
        this.endPoint = qaseApiClient.BASE_URL + 'run/' + this.projectCode;
    }
    getCaseId(scenario, projectCode) {
        // Get the feature file URI (Cucumber.js: scenario.pickle.uri or scenario.gherkinDocument.uri)
        const uri = scenario.pickle.uri || scenario.gherkinDocument.uri || '';

        // Get the file name (after last '/')
        const fileName = uri.substring(uri.lastIndexOf('/') + 1);

        // Remove .feature extension
        const baseName = fileName.replace('.feature', '');

        // Split on projectCode + '-' and return second part
        const parts = baseName.split(projectCode + '-');
        return parts[1] || '';
    }

    async createTestRunByTestPlan(planId, runTitle, browser, env, entity) {

        const date = new Date();
        const str = date.toISOString().slice(0, 10);
        const requestBody = {
            title: "[" + entity + "]" + "[" + browser + "]" + "[" + env + "]" + str + " - " + runTitle,
            plan_id: planId
        }

        const response = await fetch(this.endPoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Token": this.token
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        return data.result.id;
    }

    async getTestPlanTitle(planId, projectCode) {
        const endPoint = qaseApiClient.BASE_URL + "plan/" + projectCode + "/" + planId;
        const requestBody = {
            code: projectCode,
            id: planId
        }

        const response = await fetch(endPoint,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Token": this.token
                },
                //  body: JSON.stringify(requestBody)
            }
        );
        const data = await response.json();
        return data.result.title;

    }

    async createTestCaseResult(testRunId, projectCode, hash, status, caseId, steps) {
        const endPoint = qaseApiClient.BASE_URL + "result/" + projectCode + "/" + testRunId;
        const requestBody =
        {
            status: status,
            case_id: caseId,
            attachments: hash,
            steps: steps

        }
        // Only add attachments if hash is not empty
        if (hash && hash.length > 0) {
            requestBody.attachments = [hash];
        }
        try {
            const response = await fetch(endPoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Token": this.token,
                    "accept": "application/json"
                },
                body: JSON.stringify(requestBody)
            });
            if (!response.ok) {
                // You can log response.status and response.statusText for debugging
                throw new Error(`Request failed: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            // Optionally log the response
            // console.log("Response:", data);
            return data;
        } catch (e) {
            console.error("Failed to upload Qase result, Error:", e);
        }
    }

    async uploadAttachment(projectCode, scenarioName, fileDir) {
        const endPoint = qaseApiClient.BASE_URL + "attachment/" + projectCode;
        const fileName = path.basename(fileDir);

        // Verify the file exists and is complete
        try {
            const stats = fs.statSync(fileDir);
            if (!stats.isFile() || stats.size === 0) {
                throw new Error(`Attached file does not exist or is empty: ${fileDir}`);
            }
       //     console.log(`File exists and has size: ${stats.size} bytes`);
        } catch (error) {
            throw new Error(`Error checking file: ${error.message}`);
        }

        const fileBuffer = fs.readFileSync(fileDir);

        // Create form data using native HTTP multipart
        const boundary = `------------------------${Date.now()}`;
        const chunks = [];

        // Add file part
        chunks.push(Buffer.from(`--${boundary}\r\n`));
        chunks.push(Buffer.from(`Content-Disposition: form-data; name="file"; filename="${fileName}"\r\n`));
        chunks.push(Buffer.from(`Content-Type: ${fileDir.includes("Video") ? 'video/mp4' : fileDir.includes("screenshots") ? 'image/png' : 'application/octet-stream'}\r\n`));
        chunks.push(Buffer.from('\r\n'));
        chunks.push(fileBuffer);
        chunks.push(Buffer.from('\r\n'));
        chunks.push(Buffer.from(`--${boundary}--\r\n`));

        // Combine all chunks into one buffer
        const multipartBody = Buffer.concat(chunks);

       // console.log('Request payload size:', multipartBody.length);
       // console.log('Boundary:', boundary);

        const headers = {
            'accept': 'application/json',
            'Token': this.token,
            'Content-Type': `multipart/form-data; boundary=${boundary}`,
            'Content-Length': multipartBody.length
        };

        const response = await fetch(endPoint, {
            method: 'POST',
            headers: headers,
            body: multipartBody
        });

        //console.log('Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
        }

        const data = await response.json();
        //console.log('Response data:', data);

        const resultArray = data.result;

        if (resultArray && resultArray.length > 0) {
            const firstResult = resultArray[0];
            return firstResult.hash;
        } else {
            throw new Error('No result found in response');
        }


    }

    async getCaseStepAction(projectCode, caseId, stepPosition) {
        const endpoint = qaseApiClient.BASE_URL + "case/" + projectCode + "/" + caseId;

        let stepsMap = new Map();

        try {
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'Token': this.token,
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            // Navigate to the "steps" array
            const stepsArray = data?.result?.steps || [];

            // Build a Map of position -> action
            for (const step of stepsArray) {
                const position = step.position;
                const action = step.action;
                stepsMap.set(position, action);
            }

            // Optional: print all steps
            // for (const [position, action] of stepsMap.entries()) {
            //   console.log(`Position: ${position}, Action: ${action}`);
            // }

            return stepsMap.get(stepPosition);

        } catch (e) {
            console.error(e);
            return undefined; // or throw e;
        }


    }

    async stepsPayload(isPassed, position, stepAction, hash) {
        const steps = {
            status: isPassed,
            position: position,
            action: stepAction,
        }
        if (isPassed === "failed") {
            steps.attachments = [hash];
        }

        return steps;
    }



}

module.exports = { qaseApiClient };