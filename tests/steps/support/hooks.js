const { Before, After, AfterStep, BeforeAll, context } = require('@cucumber/cucumber');
const { chromium, firefox } = require("@playwright/test");
const playwright = require('playwright');
const { qaseApiClient } = require('../../utils/qaseApiClient.js');
const { BaseTest } = require('../../utils/baseTest.js');
const { setDefaultTimeout } = require('@cucumber/cucumber');
const fs = require('fs/promises');
const path = require('path');
let browserType, product, env;
let runId;
let qaseApiConfigClient;
let caseId;
let position;
let hash;
let steps = [];
let videoFolderDir = './videos/';
let screenshotFolderDir = './screenshots/';
let hookInstance;
setDefaultTimeout(100 * 1000);

class Hooks extends BaseTest {

    constructor() {
        super();
        browserType = process.env.BROWSER || 'chromium';
        product = process.env.PRODUCT;
        env = process.env.ENV;
    }
    get getQaseConfig() {
        const qaseConfig =
        {
            projectCode: super.retrieveDataProperty("qase_project_code"),
            apiToken: super.retrieveData.apiToken,
            testPlanId: super.retrieveDataProperty("qase_smoke_testPlanId"),
            product: super.retrieveData.product


        };
        return qaseConfig;
    }

    get initializeQaseApiClient() {
        return new qaseApiClient(this.getQaseConfig.apiToken, this.getQaseConfig.projectCode);
    }

    async createQaseTestRun() {
        //  return (async () => {
        //this.qaseApiClient = new qaseApiClient(this.getQaseConfig.apiToken, this.getQaseConfig.projectCode);
        qaseApiConfigClient = this.initializeQaseApiClient;
        runId = await qaseApiConfigClient.createTestRunByTestPlan(this.getQaseConfig.testPlanId,
            await qaseApiConfigClient.getTestPlanTitle(this.getQaseConfig.testPlanId, this.getQaseConfig.projectCode),
            browserType,
            super.retrieveData.env,
            super.retrieveData.entity);
        //  })
    }

    async videoPath(scenario, page) {
        const originalVideoPath = await page.video().path();
        let newVideoPath;
        if (originalVideoPath) {
            const scenarioName = scenario.pickle.name.replace(/\s+/g, '_');
            const videoDir = path.dirname(originalVideoPath);
            newVideoPath = path.join(videoFolderDir, `${scenarioName}.mp4`);
            fs.rename(originalVideoPath, newVideoPath);
            console.log(`Renamed to: ${newVideoPath}`);
        }
        return newVideoPath;
    }

    async emptyFolder(folderPath) {
        const files = await fs.readdir(folderPath);
        for (const file of files) {
            const filePath = path.join(folderPath, file);
            const stat = await fs.lstat(filePath);
            if (stat.isDirectory()) {
                await emptyFolder(filePath);
                await fs.rmdir(filePath);
            } else {
                await fs.unlink(filePath);
            }
        }
    }

    async captureScreenshot(scenario, page, stepName) {
        let screenshotDir;
        if (page) {

            // Ensure screenshots folder exists
            await fs.mkdir(screenshotFolderDir, { recursive: true });


            const screenshotName = stepName.replace(/\s+/g, '_');
            screenshotDir = path.join(screenshotFolderDir, `${screenshotName}.png`);


            // Capture screenshot
            await page.screenshot({ path: screenshotDir });

            console.log(`Screenshot saved: ${screenshotDir}`);
        }
        return screenshotDir;
    }

    getCaseId(scenario) {
        return qaseApiConfigClient.getCaseId(scenario, this.getQaseConfig.projectCode);
    }

    async prepareStepPayload(isPassed, position, stepAction, hash) {
        return await qaseApiConfigClient.stepsPayload(isPassed, position, stepAction, hash);
    }

    renameVideoFile() {
        super.renameVideoFile()
    }

    async updateTestResult(projectCode, scenario, videoPath) {

        console.log(videoPath);
        if (videoPath != null) {
            hash = await qaseApiConfigClient.uploadAttachment(projectCode, scenario.pickle.name, videoPath);
        }
        else { hash = ""; }
        try {
            await qaseApiConfigClient.createTestCaseResult(runId, projectCode, hash, scenario.result.status.toLowerCase(), caseId, steps);
        }
        catch (e) {
            console.error("Failed to update test result : " + e);
        }
    }

    async uploadScreenshot(scenario, page, stepAction) {
        const screenshotPath = await hookInstance.captureScreenshot(scenario, page, stepAction);
        return await qaseApiConfigClient.uploadAttachment(this.getQaseConfig.projectCode, scenario.pickle.name, screenshotPath);
        //  return await qaseApiConfigClient.uploadAttachment(projectCode, scenario.pickle.name, screenshotPath);
    }

    async cleanUpFolder() {
        await this.emptyFolder(videoFolderDir);
        await this.emptyFolder(screenshotFolderDir);
    }

    setProperty(variable, property) {
        if (property != null) {
            process.env[variable] = property;
        }

    }

    resetState() {
        steps.length = 0;
        position = 1;
    }

}

BeforeAll(async function () {
    hookInstance = new Hooks();
    hookInstance.setProperty("product", product);
    hookInstance.setProperty("env", env);
    //await hookInstance.createQaseTestRun();
    qaseApiConfigClient = hookInstance.initializeQaseApiClient;
    await hookInstance.emptyFolder('./test_results/trace');

});



Before(async function (scenario) {

    hookInstance.resetState();
    //this.browser = await chromium.launch({ headless: false });
    this.browser = await playwright[browserType].launch({ headless: false });

    this.context = await this.browser.newContext({
        recordVideo: {
            dir: videoFolderDir,    // directory where videos will be saved
            size: { width: 1280, height: 720 } // optional: video size
        }
    });

    await this.context.tracing.start({
        name: scenario.pickle.name,
        soruces: true,
        screenshots: true,
        snapshots: true
    });
    this.page = await this.context.newPage();
    caseId = hookInstance.getCaseId(scenario);

});

AfterStep(async function (scenario) {
    if (position >= 1) {
        try {
            const stepAction = await qaseApiConfigClient.getCaseStepAction(hookInstance.getQaseConfig.projectCode, caseId, position);
            const isPassed = scenario.result.status.toLowerCase();

            if (isPassed === "failed") {
                // const screenshotPath = await hookInstance.captureScreenshot(isPassed, scenario, this.page, stepAction);
                hash = await hookInstance.uploadScreenshot(scenario, this.page, stepAction);
            }
            steps.push(await hookInstance.prepareStepPayload(isPassed, position, stepAction, hash));
        }
        catch (e) {
            console.log("Failed to record step result: " + e);
        }
    }



    position++;
});

After(async function (scenario) {

    const path = `./test_results/trace/${scenario.pickle.name.replace(/\s+/g, '_')}.zip`
    await this.context.tracing.stop({ path: path });
    await this.page.close();
    await this.context.close();
    await this.browser.close();


    const videoPath = await hookInstance.videoPath(scenario, this.page);

    // update test result
    await hookInstance.updateTestResult(hookInstance.getQaseConfig.projectCode, scenario, videoPath);

    // cleanup folder
    await hookInstance.cleanUpFolder();

    // console.log(await this.hooks.videoPath(scenario, this.page));



});

