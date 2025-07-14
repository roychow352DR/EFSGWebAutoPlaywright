const {AbstractComponent} = require('../tests/utils/abstractComponent');

let abs;

let statusChangedEmail;

class ApplicationListPage {
    constructor(page) {
        abs = new AbstractComponent();
        this.page = page;
        this.menu = page.getByText('Menu');
        this.buttons = page.getByRole('button');
        this.radioButtons = page.locator('label');
        this.submitButton = page.getByRole('button',{name : 'Submit'});
        this.column = page.locator(".css-vh3dxd");
        this.row = page.locator('tbody tr');
        this.statusCol = page.locator('td:nth-child(6)');
    }

    async validateLogin() {
        return this.menu;
    }

    async clickButton(buttonName) {
        await this.buttons.filter({ hasText: buttonName }).click();

    }

    async clickRadioButton(buttonName){
       await this.radioButtons.filter({hasText: buttonName}).click();
    }

    async clickSubmit()
    {
        await this.submitButton.click();
    }

    async getApplicationStatus()
    {
        const emailStatus = await this.row.filter({hasText : process.env.EMAIL}).locator(".css-4soh8v").nth(1);
      //  console.log(await emailStatus.textContent());
        return emailStatus;
    }

    async clickDetailBtn(applicationStatus)
    {
       await this.row.filter({hasText : `${applicationStatus}`}).getByRole('button',{ name : 'Detail'}).first().click();
       process.env.EMAIL = await this.row.filter({hasText : `${applicationStatus}`}).first().locator('.css-ff6t81').nth(1).textContent();
    }

}

module.exports = { ApplicationListPage };