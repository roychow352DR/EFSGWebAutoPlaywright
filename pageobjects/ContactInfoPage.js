const { AbstractComponent } = require('../tests/utils/abstractComponent');

let abs;

class ContactInfoPage {
    constructor(page) {
        abs = new AbstractComponent();
        this.page = page;
        this.addressField = page.locator("input[name='addressLine1']");
        this.cityField = page.locator("input[name='city']");
        this.nextBtn = page.getByRole('button');
        this.buttons = page.getByRole('button');
    }

    async fillContactInfo() {
        await this.fillAddress();
        await this.clickNext();
    }

    async fillAddress() {
        await this.addressField.fill(abs.userInfoData.addressLine1);
        await this.cityField.fill(abs.userInfoData.city);
    }

    async clickNext() {
        await this.nextBtn.filter({ has: this.page.getByText('Next To Employee and Financial Information') }).click();
    }
    async clickButtonByText(buttonText) {
        await this.buttons.filter({ hasText: buttonText }).click();
    }

}

module.exports = { ContactInfoPage };