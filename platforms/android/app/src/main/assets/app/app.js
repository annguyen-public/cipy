require("./bundle-config");
const application = require("application");

application.start({ moduleName: "lunch_page/lunch-page" });

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
