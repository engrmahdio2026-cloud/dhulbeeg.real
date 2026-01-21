class DhulBeegApp {
    constructor() {
        this.name = "DhulBeegApp";

        this.CONFIG = {
            apiEndpoint: "https://api.dhulbeegapp.com",
            version: "1.0.0",
            defaultLanguage: "en",
        };

        this.init();
        this.defaultLanguage = this.CONFIG.defaultLanguage;
        this.currentUser = null;

    }

}