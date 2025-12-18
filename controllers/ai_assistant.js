const { GoogleGenAI } = require("@google/genai");

// Helpers
const { parseAIError } = require("../helpers/ai_error_handler");

const getAI = new GoogleGenAI(process.env.GEMINI_API_KEY);
// const model = getAI.getGenerativeModel({
//   model: process.env.AI_ASSISTANT_MODEL,
//   generationConfig: {
//     temperature: 0.2,
//     maxOutputTokens: 100,
//   },
// });

class AIAssistantController {
  static generateFirstChat = async (req, res) => {
    try {
      const prompt =
        req.body.lang === "id"
          ? "Perkenalkan dirimu sebagai Handson AI asisten yang didukung oleh Google, dan tanya apakah ada yang sesuatu yang bisa kamu bantu"
          : "Introduce yourself as Handson's AI assistant powered by Google and ask them is there any you can help";

      const result = await getAI.models.generateContent({
        model: process.env.AI_ASSISTANT_MODEL,
        contents: prompt,
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 100,
        },
      });

      res.status(200).send({ success: true, text: result.text });
    } catch (err) {
      const aiError = parseAIError(err);
      res.status(aiError.status).send(aiError.response);
    }
  };

  static talkToAssistant = async (req, res) => {
    try {
      const result = await getAI.models.generateContent({
        model: process.env.AI_ASSISTANT_MODEL,

        systemInstruction: {
          parts: [
            {
              text: "You are a concise assistant. Keep answers under 2 sentences unless asked otherwise.",
            },
          ],
        },

        contents: [
          {
            role: "user",
            parts: [{ text: req.body.message }],
          },
        ],

        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 80,
        },
      });

      res.status(201).send({
        success: true,
        text: result.text,
      });
    } catch (err) {
      const aiError = parseAIError(err);
      res.status(aiError.status).send(aiError.response);
    }
  };
}

module.exports = AIAssistantController;
