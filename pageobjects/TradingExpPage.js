const { AbstractComponent } = require('../tests/utils/abstractComponent');

let abs;

class TradingExpPage {
    constructor(page) {
        abs = new AbstractComponent();
        this.page = page;
        this.tradeExp = page.locator("#mui-component-select-fiveOrMorTransactionLastThreeYears");
        this.investExp = page.locator("#mui-component-select-haveOtherTrade");
        this.dropdownOption = page.getByRole('option');
        this.buttons = page.getByRole('button');
        this.reasonDropdown = page.locator("#mui-component-select-verify");
    }

    async fillTradingExp() {
        await this.selectTradeExp();
        await this.selectInvestExp();
    }

    async selectTradeExp() {
        await this.tradeExp.click();
        await this.dropdownOption.filter({ has: this.page.getByText(abs.userInfoData.tadeEXP, { exact: true }) }).click();
    }

    async selectInvestExp() {
        await this.investExp.click();
        await this.dropdownOption.filter({ has: this.page.getByText(abs.userInfoData.investExp, { exact: true }) }).click();
    }

    async submitApplication(buttonName) {
        await this.buttons.filter({ hasText: buttonName }).click();
    }

    async selectReason(reason)
    {
        await this.reasonDropdown.click()
        await this.dropdownOption.filter({hasText : reason}).click();
    }
}

module.exports = { TradingExpPage };