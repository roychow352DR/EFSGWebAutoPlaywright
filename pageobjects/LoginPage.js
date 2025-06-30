const {ApplicationListPage} = require('./ApplicationListPage');

class LoginPage
{
    constructor(page)
    {
        this.page = page;
        this.userNameField = page.locator(".css-1x5jdmq");
        this.passwordField = page.locator(".css-1uvydh2");
        this.loginButton = page.locator(".css-1m4mrb3-root-contained-root-contained");
        this.errorText = page.getByText("Invalid username or password.");
    }

    async fillCredential(userName,passWord)
    {
        await this.userNameField.fill(userName);
        await this.passwordField.fill(passWord);
    }

    async clickLogin()
    {
    
        await this.loginButton.click();
        return new ApplicationListPage(this.page);
    }

    async goto(link)
    {
        await this.page.goto(link);
        await this.page.waitForLoadState('networkidle');
    }

    async loginErrortext()
    {
        return this.errorText;
    }

    async loginCTA()
    {
        return this.loginButton;
    }
}

module.exports = {LoginPage};