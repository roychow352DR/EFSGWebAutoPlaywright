require('dotenv').config({ path: 'dataResources/globalData.env' });
require('dotenv').config({ path: 'dataResources/qaseAdminPortal.env' });

class BaseTest {

    get retrieveData() {
        const dataSet = {
            browserType: process.env.browser,
            env: process.env.env,
            product: process.env.product,
            entity: process.env.entity,
            projectCode: process.env.qase_project_code,
            apiToken: process.env.qase_api_token
        };
        return dataSet;
    }

    retrieveDataProperty(propertyItem) {
        const PropertiesReader = require('properties-reader');
        var properties;
        if (this.retrieveData.product === "adminportal") {
            properties = PropertiesReader('dataResources/qaseAdminPortal.properties');
        }
        else if (this.retrieveData.product === "mio") {
            properties = PropertiesReader('dataResources/qaseMioAdminPortal.properties');
        }

        return properties.get(propertyItem);
    }

    async renameVideoFile(currentName, newName, folder) {
        const oldPath = path.join(folder, currentName);
        const newPath = path.join(folder, newName);

        await fs.rename(oldPath, newPath);
        console.log(`Renamed: ${oldPath} → ${newPath}`);
        return newPath;
    }

    get retrieveProductLink()
    {
        const env = this.retrieveData.env;
        return this.retrieveDataProperty(env);
    }
}

module.exports = { BaseTest };