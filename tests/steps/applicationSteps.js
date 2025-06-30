const { Given, When, Then, setDefaultTimeout } = require("@cucumber/cucumber");

const {expect} = require("@playwright/test");

const {LoginPage} = require('../../pageobjects/LoginPage.js');

const {ApplicationListPage} = require('../../pageobjects/ApplicationListPage.js');

const { BaseTest } = require('../utils/baseTest.js');


class ApplicationSteps extends BaseTest
{
    get getProductLink()
    {
        return super.retrieveProductLink;
    }
}

Given("the user lands on Admin Portal login page",async function()
{
    stepInstance = new ApplicationSteps();
    this.loginPage = new LoginPage(this.page);
    await this.loginPage.goto(stepInstance.getProductLink);

})

Given('the user fills in with username {string} and password {string}',async function(username,password)
{
    await this.loginPage.fillCredential(username,password);
})

When("the user input nothing as username and password",async function()
{    
    await this.loginPage.fillCredential("","");

})

When('the user clicks Sign In button',async function()
{
    this.applicationListPage = await this.loginPage.clickLogin();
})

Then("the user sees the Sign In button is unclickable",async function()
{
    await expect(this.loginPage.loginCTA()).toBeDisabled();
})

Then('the user sees Menu display on the screen',async function()
{
    await expect(await this.applicationListPage.validateLogin()).toBeVisible();
})

Then("the user sees {string} message pop up",async function(errorText)
{
    await expect(this.loginPage.loginErrortext()).toBeTruthy();
})