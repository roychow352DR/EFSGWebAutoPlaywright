class ApplicationListPage
{
    constructor(page)
    {
        this.page = page;
        this.menu = page.getByText('Menu');
    
    }

    async validateLogin()
    {
        return this.menu;
    }

}

module.exports = {ApplicationListPage};