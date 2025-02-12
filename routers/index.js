const routers = require("express").Router();

// Routers
const routerEmail = require("./email");
const routerAssistant = require("./ai_assistant");

routers.use("/email", routerEmail);
routers.use("/assistant", routerAssistant);

module.exports = routers;
