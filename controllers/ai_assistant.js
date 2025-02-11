const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.AI_ASSISTANT_API_KEY);
const model = genAI.getGenerativeModel({
  model: process.env.AI_ASSISTANT_MODEL,
});

class AIAssistantController {
  static generateFirstChat = async (req, res) => {
    try {
      const prompt =
        "Introduce yourself as Handson's AI assistant powered by Google and ask them is there any you can help";

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
      const myProfileDescription = `
				My name is Handson Panggabean, you can call me Handson.
				a passionate full-stack developer with experience in React, Tailwind, Javascript, TypeScript, and more.
				I love building interactive web apps and solving complex problems with clean, efficient code.
				Currently live in Medan, Indonesia.
				Im 27 years old.
				My hobby is coding.
				My dream job is to be an employee outside my country, or to work about 
      `;

      const prompt = `
      	Based on the following profile description, answer the user's question:
      	"${myProfileDescription}"

      	User: ${req.body.message}
      	AI:
      `;

      const result = await model.generateContent(prompt);
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
