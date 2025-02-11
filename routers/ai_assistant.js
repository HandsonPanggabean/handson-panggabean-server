var express = require("express");
var router = express.Router();

// Controllers
const AIAssistantController = require("../controllers/ai_assistant");

router.get("/initiate", AIAssistantController.generateFirstChat);
router.post("/talk", AIAssistantController.talkToAssistant);

module.exports = router;
