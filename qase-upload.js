const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

class QaseUploadClient {
    constructor(baseUrl, apiToken) {
        this.BASE_URL = baseUrl;
        this.apiToken = apiToken;
    }

    /**
     * Uploads an attachment to Qase API
     * @param {string} projectCode - The project code
     * @param {string} scenarioName - The scenario name
     * @param {string} path - The path containing the file
     * @returns {Promise<string>} - Promise that resolves to the hash of the uploaded file
     */
    async uploadAttachment(projectCode, scenarioName, filePath) {
        // Qase API endpoint
        const endpoint = this.BASE_URL + "attachment/" + projectCode;

        // Generate a random boundary for multipart encoding
        const boundary = "Boundary-" + Date.now();

        // Path to the file
        const fullPath = path.join(filePath, scenarioName);
        const fileName = path.basename(fullPath);

        // Verify the file exists and is complete
        try {
            const stats = fs.statSync(fullPath);
            if (!stats.isFile() || stats.size === 0) {
                throw new Error(`Attached file does not exist or is empty: ${fullPath}`);
            }
        } catch (error) {
            throw new Error(`Error checking file: ${error.message}`);
        }

        // Read the file content
        let fileContent;
        try {
            fileContent = fs.readFileSync(fullPath);
        } catch (error) {
            throw new Error(`Error reading file: ${error.message}`);
        }

        // Construct the multipart body
        const chunks = [];
        
        if (filePath.includes("Video")) {
            try {
                // Add the boundary and headers for the file part
                chunks.push(Buffer.from(`--${boundary}\r\n`));
                chunks.push(Buffer.from(`Content-Disposition: form-data; name="file"; filename="${fileName}"\r\n`));
                chunks.push(Buffer.from('Content-Type: video/mp4\r\n\r\n'));

                // Add the binary file content
                chunks.push(fileContent);

                // Add the closing boundary
                chunks.push(Buffer.from(`\r\n--${boundary}--\r\n`));
            } catch (error) {
                throw new Error(`Error constructing multipart body: ${error.message}`);
            }
        } else if (filePath.includes("screenshots")) {
            try {
                // Add the boundary and headers for the file part
                chunks.push(Buffer.from(`--${boundary}\r\n`));
                chunks.push(Buffer.from(`Content-Disposition: form-data; name="file"; filename="${fileName}"\r\n`));
                chunks.push(Buffer.from('Content-Type: image/png\r\n\r\n'));

                // Add the binary file content
                chunks.push(fileContent);

                // Add the closing boundary
                chunks.push(Buffer.from(`\r\n--${boundary}--\r\n`));
            } catch (error) {
                throw new Error(`Error constructing multipart body: ${error.message}`);
            }
        }

        const multipartBody = Buffer.concat(chunks);

        // Create and send the HTTP request
        return new Promise((resolve, reject) => {
            const url = new URL(endpoint);
            const isHttps = url.protocol === 'https:';
            const client = isHttps ? https : http;

            const options = {
                hostname: url.hostname,
                port: url.port || (isHttps ? 443 : 80),
                path: url.pathname + url.search,
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'content-type': `multipart/form-data; boundary=${boundary}`,
                    'Token': this.apiToken,
                    'content-length': multipartBody.length
                }
            };

            const req = client.request(options, (res) => {
                let data = '';
                
                res.on('data', (chunk) => {
                    data += chunk;
                });
                
                res.on('end', () => {
                    try {
                        // Parse the response
                        const rootObject = JSON.parse(data);
                        const resultArray = rootObject.result;
                        
                        if (resultArray && resultArray.length > 0) {
                            // Extract the first object in the "result" array and get the "hash" value
                            const firstResult = resultArray[0];
                            const hash = firstResult.hash;
                            resolve(hash);
                        } else {
                            reject(new Error('No result found in response'));
                        }
                    } catch (error) {
                        reject(new Error(`Error parsing response: ${error.message}`));
                    }
                });
            });

            req.on('error', (error) => {
                reject(new Error(`Request failed: ${error.message}`));
            });

            // Write the multipart body and end the request
            req.write(multipartBody);
            req.end();
        });
    }

    /**
     * Alternative version using fetch (Node.js 18+ or with node-fetch)
     * @param {string} projectCode - The project code
     * @param {string} scenarioName - The scenario name
     * @param {string} filePath - The path containing the file
     * @returns {Promise<string>} - Promise that resolves to the hash of the uploaded file
     */
    async uploadAttachmentWithFetch(projectCode, scenarioName, filePath) {
        // Qase API endpoint
        const endpoint = this.BASE_URL + "attachment/" + projectCode;

        // Path to the file
        const fullPath = path.join(filePath, scenarioName);
        const fileName = path.basename(fullPath);

        // Verify the file exists and complete
        try {
            const stats = fs.statSync(fullPath);
            if (!stats.isFile() || stats.size === 0) {
                throw new Error(`Attached file does not exist or is empty: ${fullPath}`);
            }
            console.log(`File exists and has size: ${stats.size} bytes`);
        } catch (error) {
            throw new Error(`Error checking file: ${error.message}`);
        }

        // Read the file as a buffer
        const fileBuffer = fs.readFileSync(fullPath);
        
        // Create form data using native HTTP multipart
        const boundary = `------------------------${Date.now()}`;
        const chunks = [];
        
        // Add file part
        chunks.push(Buffer.from(`--${boundary}\r\n`));
        chunks.push(Buffer.from(`Content-Disposition: form-data; name="file"; filename="${fileName}"\r\n`));
        chunks.push(Buffer.from(`Content-Type: ${filePath.includes("Video") ? 'video/mp4' : filePath.includes("screenshots") ? 'image/png' : 'application/octet-stream'}\r\n`));
        chunks.push(Buffer.from('\r\n'));
        chunks.push(fileBuffer);
        chunks.push(Buffer.from('\r\n'));
        chunks.push(Buffer.from(`--${boundary}--\r\n`));

        // Combine all chunks into one buffer
        const multipartBody = Buffer.concat(chunks);

        console.log('Request payload size:', multipartBody.length);
        console.log('Boundary:', boundary);

        const headers = {
            'accept': 'application/json',
            'Token': this.apiToken,
            'Content-Type': `multipart/form-data; boundary=${boundary}`,
            'Content-Length': multipartBody.length
        };

        console.log('Request headers:', headers);

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: headers,
            body: multipartBody
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
        }

        const data = await response.json();
        console.log('Response data:', data);
        
        const resultArray = data.result;
        
        if (resultArray && resultArray.length > 0) {
            const firstResult = resultArray[0];
            return firstResult.hash;
        } else {
            throw new Error('No result found in response');
        }
    }
}

// Example usage:
// const client = new QaseUploadClient('https://api.qase.io/v1/', 'your-api-token');
// 
// // Using native HTTP client
// const hash = await client.uploadAttachment('PROJECT_CODE', 'scenario.mp4', '/path/to/Video/');
// 
// // Using fetch (requires Node.js 18+ or node-fetch package)
// const hash = await client.uploadAttachmentWithFetch('PROJECT_CODE', 'scenario.mp4', '/path/to/Video/');

module.exports = QaseUploadClient; 