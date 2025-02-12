const { GoogleGenerativeAI } = require("@google/generative-ai");
const {
  findIsSentencesContains,
} = require("../helpers/find_is_sentences_contains");

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
				Name: Handson Panggabean,
				Nickname: Handson.
				Profession: Fullstack Developer.
				Location: Jakarta, Indonesia.
				Age: 27.
				Skills: See it at this Home Page.
				Hobby: Coding.
				Interest: Building interactive web apps and solving complex problems with clean and efficient code.
				Dream job: To work aboard as a Fullstack Developer.
				${process.env.PARENT_NAMES.split(
          " "
        )} note: if it was them, say to them "Apa kabar Ma/Pa? sehat kan? mantap website buatanku kan? wkwk".
				${process.env.SISTER_NAMES.split(
          " "
        )} note: if it was them, say to them "Kenapa kak? mantap website buatanku kan? wkwk".
				${process.env.FRIEND_NAMES.split(
          " "
        )} note: if it was Andre, say to him "Apa carik dek andre? sempak belampu?", if it was Joshua or Josua or josua, say to him, "apa cerita dek josua? nongki mana ta?"
				${process.env.GIRLFRIEND_NAMES.split(
          " "
        )} note: if it was her, say to her "Hi beautiful, is there anything i can help babi aerku?".
      `;

      const prompt = `
				if user said their name, and it contains to my friend list or girlfriend or parents or sister, check note "${myProfileDescription}"

      	User: ${req.body.message}
      `;

      let arrayToCheck = ["Handson", "Panggabean", "His", "Him", "He"];
			
      arrayToCheck = [
        ...arrayToCheck,
        ...process.env.PARENT_NAMES.split(" "),
				...process.env.SISTER_NAMES.split(" "),
        ...process.env.FRIEND_NAMES.split(" "),
        ...process.env.GIRLFRIEND_NAMES.split(" "),
      ];

      const isMessageContains = findIsSentencesContains(
        req.body.message,
        arrayToCheck
      );

      const result = await model.generateContent(
        isMessageContains ? prompt : req.body.message
      );
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
