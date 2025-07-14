class AbstractComponent {
    randomAlphanumeric(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    get userInfoData() {
        const randomEmailSeed = Math.floor(Math.random() * 10001);
        const randomPhoneno = Math.floor(Math.random() * 10000001);
        const date = new Date();
        const userDataSet =
        {
            email: "qaauto" + randomEmailSeed + "@yopmail.com",
            phoneNumber: randomPhoneno.toString(),
            entity: process.env.entity,
            promoCode: "Test",
            referCode: "Test123",
            countryCode: "+852",
            lastName: "Peter",
            firstName: "Chu",
            country: "Hong Kong, China",
            nationality: "Hong Kong, China",
            gender: "Male",
            idType: "ID Card",
            dobYear: "1990",
            dobDay: "20",
            dobYearBelow18: (date.getFullYear() - 15).toString(),
            id : this.randomAlphanumeric(6),
            passwordNo : this.randomAlphanumeric(6),
            addressLine1 : "Mong Kok",
            city : "Kowloon",
            employStatus : "Employed ",
            industrial : "Education",
            annualIncome : "Less than $200,000 (Appx. USD 25,000)",
            netWorth : "Less than $40,000 (Appx. USD 5,000)",
            tradeFunds : "Employment",
            taxCountry : "Hong Kong, China",
            tadeEXP : "No",
            investExp : "No",
            expiryYear : date.getFullYear(),
            expiryDay : date.getDate()
        }
        return userDataSet;
    }
}

module.exports = {AbstractComponent};