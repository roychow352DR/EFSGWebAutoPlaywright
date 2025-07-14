const { AbstractComponent } = require('../tests/utils/abstractComponent');

let abs;

class EmployeeFinInfoPage {
    constructor(page) {
        abs = new AbstractComponent();
        this.page = page;
        this.employeeStatus = page.locator("#mui-component-select-employmentStatus");
        this.annualIncome = page.locator("#mui-component-select-annualIncome");
        this.liquidNetWorth = page.locator("#mui-component-select-liquidNetworth");
        this.sourceOfFunds = page.locator("#mui-component-select-sourceOfFunds");
        this.taxJurisdiction = page.locator("#mui-component-select-jurisdictionOfTaxResidence");
        this.dropdownOption = page.getByRole("option");
        this.industrial = page.locator("#mui-component-select-industrial");
        this.nextBtn = page.getByRole('button');
        this.buttons = page.getByRole('button');
    }

    async fillEmployeeFinInfo() {
        await this.selectEmployeeStatus();
        await this.selectIndustrial();
        await this.selectAnnualIncome();
        await this.selectliquidNetWorth();
        await this.selectSourceOfFunds();
        await this.selecttaxJurisdiction();
        await this.clickNext();
    }

    async selectEmployeeStatus() {
        await this.employeeStatus.click();
        await this.dropdownOption.filter({ has: this.page.getByText(abs.userInfoData.employStatus, { exact: true }) }).click();
    }

    async selectIndustrial() {
        await this.industrial.click();
        await this.dropdownOption.filter({ has: this.page.getByText(abs.userInfoData.industrial, { exact: true }) }).click();
    }

    async selectAnnualIncome() {
        await this.annualIncome.click();
        await this.dropdownOption.filter({ has: this.page.getByText(abs.userInfoData.annualIncome, { exact: true }) }).click();

    }

    async selectliquidNetWorth() {
        await this.liquidNetWorth.click();
        await this.dropdownOption.filter({ has: this.page.getByText(abs.userInfoData.netWorth, { exact: true }) }).click();

    }

    async selectSourceOfFunds() {
        await this.sourceOfFunds.click();
        await this.dropdownOption.filter({ has: this.page.getByText(abs.userInfoData.tradeFunds, { exact: true }) }).click();

    }

    async selecttaxJurisdiction() {
        await this.taxJurisdiction.click();
        await this.dropdownOption.filter({ has: this.page.getByText(abs.userInfoData.taxCountry, { exact: true }) }).click();

    }

    async clickNext() {
        await this.nextBtn.filter({ hasText: 'Next To Trading Experience' }).click();
    }

    async clickButtonByText(buttonText) {
        await this.buttons.filter({ hasText: buttonText }).click();
    }

}

module.exports = { EmployeeFinInfoPage };