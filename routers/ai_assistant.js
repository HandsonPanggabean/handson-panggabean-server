var express = require("express");
var router = express.Router();

// Controllers
const AIAssistantController = require("../controllers/ai_assistant");

router.post("/initiate", AIAssistantController.generateFirstChat);
router.post("/talk", AIAssistantController.talkToAssistant);

module.exports = router;
