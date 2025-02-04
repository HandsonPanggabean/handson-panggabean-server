const routers = require("express").Router();

// Routers
const routerEmail = require("./email");

routers.use("/email", routerEmail);

module.exports = routers;
