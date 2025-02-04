var express = require("express");
var router = express.Router();

// Controllers
const EmailController = require("../controllers/email");

// Helpers
const { sendEmail } = require("../helpers/mailer");

router.post("/send", EmailController.sendEmailToMe, sendEmail);

module.exports = router;