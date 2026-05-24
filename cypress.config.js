const { defineConfig } = require("cypress");

module.exports = defineConfig({
    e2e: {
        baseUrl: "http://localhost:3000",
        specPattern: "test/e2e/**/*.spec.js",
        setupNodeEvents(on, config) { },
    },
});
