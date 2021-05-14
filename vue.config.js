module.exports = {
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            builderOptions: {
                productName:"Moon",
                appId:"CoMo",
                publish: [
                    {
                        "provider": "generic",
                        "url": "http://up.chmzho.com",
                        "channel": "latest"
                    }
                ]
            }
        }
    }
}