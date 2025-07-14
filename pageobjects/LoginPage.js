//const { ApplicationListPage } = require('./ApplicationListPage');


class LoginPage {
    constructor(page) {
        this.page = page;
        this.userNameField = page.locator(".css-1x5jdmq");
        this.passwordField = page.locator(".css-1uvydh2");
        this.loginButton = page.locator(".css-1m4mrb3-root-contained-root-contained");
        this.invalidErrorText = page.getByText("Invalid username or password.", { exact: true });
        this.suspendErrorText = page.getByText("User account is suspended! Please contact administration", { exact: true });
    }

    async fillCredential(userName, passWord) {
        await this.userNameField.fill(userName);
        await this.passwordField.fill(passWord);
    }

    async clickLogin() {

        await this.loginButton.click();

    }

    async goto(link) {
        await this.page.goto(link);
        await this.page.waitForLoadState('networkidle');
    }

    async loginErrortext(text) {
        if (text.includes("Invalid")) {
            return this.invalidErrorText;
        }
        else if (text.includes("suspended")) {
            return this.suspendErrorText;
        }
    }

    async loginCTA() {
        return this.loginButton;
    }

    async loginETE(username, password, link) {
        await this.goto(link);
        await this.fillCredential(username, password);

        await this.clickLogin();
    }
}

module.exports = { LoginPage };