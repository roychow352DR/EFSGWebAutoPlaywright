const { LoginPage } = require('./LoginPage');
const { ApplicationListPage } = require('./ApplicationListPage');
const { ApplicationInfoPage } = require('./ApplicationInfoPage');
const { PersonalInfoPage } = require('./PersonalInfoPage');
const { ContactInfoPage } = require('./ContactInfoPage');
const { EmployeeFinInfoPage } = require('./EmployeeFinInfoPage');
const { TradingExpPage } = require('./TradingExpPage');


class POManager {
    constructor(page) {
        this.page = page;
        this.loginPage = new LoginPage(this.page);
        this.applicationListPage = new ApplicationListPage(this.page);
        this.applicationInfoPage = new ApplicationInfoPage(this.page);
        this.personalInfoPage = new PersonalInfoPage(this.page);
        this.contactInfoPage = new ContactInfoPage(this.page);
        this.employeeFinInfoPage = new EmployeeFinInfoPage(this.page);
        this.tradingExpPage = new TradingExpPage(this.page);
    }

    getLoginPage() {
        return this.loginPage;
    }

    getApplicationListPage() {
        return this.applicationListPage;
    }

    getApplicationInfoPage() {
        return this.applicationInfoPage;
    }

    getPersonalInfoPage(){
        return this.personalInfoPage;
    }

    getContactInfoPage(){
        return this.contactInfoPage;
    }

    getEmployeeFinInfoPage()
    {
        return this.employeeFinInfoPage;
    }

    getTradingExpPage()
    {
        return this.tradingExpPage;
    }
}

module.exports = { POManager };