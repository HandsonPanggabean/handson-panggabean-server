const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.AI_ASSISTANT_API_KEY);
const model = genAI.getGenerativeModel({
  model: process.env.AI_ASSISTANT_MODEL,
});

class AIAssistantController {
  static generateFirstChat = async (req, res) => {
    try {
      const prompt =
        req.body.lang === "id"
          ? "Perkenalkan dirimu sebagai Handson AI asisten yang didukung oleh Google, dan tanya apakah ada yang sesuatu yang bisa kamu bantu"
          : "Introduce yourself as Handson's AI assistant powered by Google and ask them is there any you can help";

      const result = await model.generateContent(prompt);
      const response = await result.response.text();
      res.status(200).send({ success: true, text: response });
    } catch (err) {
      console.log("error: ", err.message);
      res.status(500).send({
        success: false,
        message: err.message,
      });
    }
  };

  static talkToAssistant = async (req, res) => {
    try {
      const result = await model.generateContent(req.body.message);
      const response = await result.response.text();
      res.status(201).send({ success: true, text: response });
    } catch (err) {
      console.log("error: ", err.message);
      res.status(500).send({
        success: false,
        message: err.message,
      });
    }
  };
}

module.exports = AIAssistantController;
