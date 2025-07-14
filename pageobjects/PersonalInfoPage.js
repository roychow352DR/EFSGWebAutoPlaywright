const { AbstractComponent } = require('../tests/utils/abstractComponent');

let abs;

class PersonalInfoPage {
    constructor(page) {
        abs = new AbstractComponent();
        this.page = page;
        this.lastNameField = page.locator("input[name='legalLastNameEn']");
        this.firstNameField = page.locator("input[name='legalFirstAndMiddleNameEn']");
        this.genderRadio = page.locator(".css-1jaw3da");
        this.countryDropdown = page.locator('#mui-component-select-jurisdictionOfResidence');
        this.dropdownOption = page.getByRole('option');
        this.calendarButton = page.locator(".css-slyssw");
        this.calendarExtendBtn = page.locator(".css-1wjkg3");
        this.yearItems = page.getByRole('button');
        this.dayItems = page.locator(".css-1vcqvsc");
        this.nationalityDropdown = page.locator("div[id='mui-component-select-jurisdiction']");
        this.idTypeDropdown = page.locator("#mui-component-select-identificationType");
        this.idNoField = page.locator("input[name='identificationNo']");
        this.buttons = page.getByRole('button');
    }

    async fillPersonalInfo() {
        await this.fillName();
        await this.selectGender();
        await this.selectCountry();
        await this.fillDob();
        await this.selectNationality();
        await this.selectIdType();
        await this.fillId();
        await this.clickNext();
    }

    async fillName() {
        await this.lastNameField.fill(abs.userInfoData.lastName);
        await this.firstNameField.fill(abs.userInfoData.firstName);
    }

    async selectGender() {
        await this.genderRadio.filter({ has: this.page.locator(`input[value=${abs.userInfoData.gender}]`) }).click();
    }

    async selectCountry() {
        await this.countryDropdown.click();
        await this.dropdownOption.filter({ hasText: abs.userInfoData.country }).click();
    }

    async fillDob() {
        await this.calendarButton.first().click();
        await this.calendarExtendBtn.click();
        await this.yearItems.filter({ hasText: abs.userInfoData.dobYear }).click();
        await this.dayItems.filter({ hasText: abs.userInfoData.dobDay }).click();

    }

    async selectNationality() {
        await this.nationalityDropdown.click();
        await this.dropdownOption.filter({ hasText: abs.userInfoData.nationality }).click();

    }

    async selectIdType() {
        await this.idTypeDropdown.click();
        await this.dropdownOption.filter({ hasText: abs.userInfoData.idType }).click();
    }

    async fillId()
    {
        await this.idNoField.fill(abs.userInfoData.id);
    }

    async clickNext()
    {
        this.buttons.filter({has : this.page.getByText('Next To Contact Information')}).click();
    }

    async clickButtonByText(buttonText)
    {
        await this.buttons.filter({hasText : buttonText}).click();
    }

}

module.exports = { PersonalInfoPage };