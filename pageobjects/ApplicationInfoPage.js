const { AbstractComponent } = require('../tests/utils/abstractComponent');

let abs;

let applicantEmail;

class ApplicationInfoPage {
    constructor(page) {
        abs = new AbstractComponent();
        this.page = page;
        this.entityDropdown = page.locator('#mui-component-select-entity');
        this.listItems = page.locator('.css-sudvrv');
        this.emailField = page.locator("input[name='email']");
        this.countryCodeField = page.locator('#mui-component-select-mobileCountryCode');
        this.phoneNumberField = page.locator("input[name='mobile']");
        this.nextButton = page.getByRole('button', { name: 'Next To Personal Information' });
        this.errorText = page.locator(".css-1wercf4");
        this.toastMsg = page.locator(".Toastify__toast-body div").nth(1);
        this.buttons = page.getByRole('button');
        this.reasonDropdown = page.locator("#mui-component-select-reason");
        this.dropdownOptions = page.getByRole('option');

    }

    async fillApplicationInfo() {
        await this.selectEntity();
        await this.fillEmail();
        await this.fillPhoneNumber();
        await this.submitApplicantInfo();
    }

    async selectEntity() {
        await this.entityDropdown.click();
        await this.listItems.filter({ hasText: process.env.entity }).click();
    }

    async fillEmail() {
        applicantEmail = abs.userInfoData.email;
        process.env.EMAIL = applicantEmail;
        await this.emailField.fill(applicantEmail);
    }

    async fillPhoneNumber() {
        await this.countryCodeField.click();
        await this.listItems.filter({ hasText: abs.userInfoData.countryCode }).click();
        await this.phoneNumberField.fill(abs.userInfoData.phoneNumber);
    }

    get submittedApplicantEmail() {
        return applicantEmail;
    }

    async errorValidation() {
        return await this.errorText.first().textContent();
    }

    async refill(errorText) {
        if (errorText.includes("email")) {
            await this.emailField.fill('');
            applicantEmail = abs.userInfoData.email;
            await this.emailField.fill(applicantEmail);

        }
        else if (errorText.includes("phone")) {
            await this.phoneNumberField.fill('');
            await this.emailField.fill(abs.userInfoData.phoneNumber);
        }
    }

    async clickNext() {
        await this.nextButton.click();
        return await this.toastMsg.textContent();
    }

    async submitApplicantInfo() {
        let toastMsg;
        do {
            toastMsg = await this.clickNext();
            if (toastMsg.includes("in use")) {
                await this.refill(toastMsg);
                toastMsg = await this.clickNext();
            }

        } while (toastMsg == null)
    }

    async clickButtonByText(buttonText)
    {
        await this.buttons.filter({hasText : buttonText}).click();
    }

    async selectReason(reason)
    {
        await this.reasonDropdown.click();
        await this.dropdownOptions.filter({hasText : reason}).click()
    }

}

module.exports = { ApplicationInfoPage };