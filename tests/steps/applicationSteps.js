const { Given, When, Then, setDefaultTimeout } = require("@cucumber/cucumber");

const { expect } = require("@playwright/test");

const { LoginPage } = require('../../pageobjects/LoginPage.js');

const { ApplicationListPage } = require('../../pageobjects/ApplicationListPage.js');

const { BaseTest } = require('../utils/baseTest.js');

const { POManager } = require('../../pageobjects/POManager.js');


class ApplicationSteps extends BaseTest {
    get getProductLink() {
        return super.retrieveProductLink;
    }
}

Given("the user lands on Admin Portal login page", async function () {
    stepInstance = new ApplicationSteps();
    this.poManager = new POManager(this.page);
    this.loginPage = this.poManager.getLoginPage();
    await this.loginPage.goto(stepInstance.getProductLink);

})

Given('the user fills in with username {string} and password {string}', async function (username, password) {
    await this.loginPage.fillCredential(username, password);
})

When("the user input nothing as username and password", async function () {
    await this.loginPage.fillCredential("", "");

})

When('the user clicks Sign In button', async function () {
    this.applicationListPage = await this.loginPage.clickLogin();
})

Then("the user sees the Sign In button is unclickable", async function () {
    expect(await this.loginPage.loginCTA()).toBeDisabled();
})

Then('the user sees Menu display on the screen', async function () {
    await expect(await this.applicationListPage.validateLogin()).toBeVisible();
})

Then("the user sees {string} message pop up", async function (errorText) {

    await expect(await this.loginPage.loginErrortext(errorText)).toHaveText(errorText);
})

Given("the user logged in to Admin Portal as username {string} and password {string}", async function (username, password) {
    stepInstance = new ApplicationSteps();
    this.poManager = new POManager(this.page);
    await this.poManager.getLoginPage().loginETE(username, password, stepInstance.getProductLink);

})

Given("the user clicks {string} button on the application page", async function (buttonName) {
    await this.poManager.getApplicationListPage().clickButton(buttonName);
})

Given("the user selects {string} radio button on the create account pop up", async function (buttonName) {
    await this.poManager.getApplicationListPage().clickRadioButton(buttonName);
})

Given("the user fills application information page", async function () {

    await this.poManager.getApplicationInfoPage().fillApplicationInfo();
})

Given("the user clicks Submit button on the create account pop up", async function () {
    await this.poManager.getApplicationListPage().clickSubmit();
})

Given("the user fills personal information page",async function()
{
    await this.poManager.getPersonalInfoPage().fillPersonalInfo();
})

Given("the user fills contact information page",async function()
{
    await this.poManager.getContactInfoPage().fillContactInfo();
}
)

Given("the user fills employee & financial information page",async function()
{
    await this.poManager.getEmployeeFinInfoPage().fillEmployeeFinInfo();
})

Given("the user fills trading experience page",async function()
{
    await this.poManager.getTradingExpPage().fillTradingExp();
})

Given("the user clicks {string} button on the trading experience page",async function(buttonName)
{
    await this.poManager.getTradingExpPage().submitApplication(buttonName);
})

Then("the user sees a record in {string} status is created on the application list",async function(applicationStatus)
{
    await expect(await this.poManager.getApplicationListPage().getApplicationStatus()).toHaveText(applicationStatus);
})

When("the user clicks detail button of {string} record on the application page",async function(applicationStatus)
{
    await this.poManager.getApplicationListPage().clickDetailBtn(applicationStatus);
})

When("the user clicks {string} button on the application information page",async function(buttonText)
{
    await this.poManager.getApplicationInfoPage().clickButtonByText(buttonText);
})

When("the user clicks {string} button on the personal information page",async function(buttonText)
{
    await this.poManager.getPersonalInfoPage().clickButtonByText(buttonText);
})

When("the user clicks {string} button on the contact information page",async function(buttonText)
{
    await this.poManager.getContactInfoPage().clickButtonByText(buttonText);
})

When("the user clicks {string} button on the employee & financial information page",async function(buttonText)
{
    await this.poManager.getEmployeeFinInfoPage().clickButtonByText(buttonText);
})

When("the user selects {string} as verify reason on the verify pop up",async function(buttonText)
{
    await this.poManager.getTradingExpPage().selectReason(buttonText);
})

When("the user selects {string} as verify reason on the activate live trade account pop up",async function(reason)
{
    await this.poManager.getApplicationInfoPage().selectReason(reason);
})
