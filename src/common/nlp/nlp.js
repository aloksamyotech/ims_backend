import { GoogleGenerativeAI } from "@google/generative-ai";
import { NlpManager } from "node-nlp";
import dotenv from "dotenv";
import mongoose from "mongoose";
import UserSchemaModel from "../../models/user.js";
import { greet } from "./intents.js";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const mongoUri = process.env.DBURL;

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

const intentMappings = [
  { phrases: greet, intent: "greetings" },
];

const manager = new NlpManager({ languages: ["en"] });

intentMappings.forEach(({ phrases, intent }) => {
  phrases.forEach((phrase) => manager.addDocument("en", phrase, intent));
});

await manager.train();
await manager.save();

const getBestIntent = async (input) => {
  const response = await manager.process("en", input);
  return {
    intent: response.intent,
    confidence: response.score,
    entities: response.entities,
  };
};

const getDynamicGreeting = (userName) => {
  const greetResponses = [
    "How can I assist you today?",
    "What can I do for you?",
    "How’s it going?",
    "How can I help?",
  ];
  const randomIndex = Math.floor(Math.random() * greetResponses.length);
  return `Hi!, ${userName}. How are you? ${greetResponses[randomIndex]}`;
};

const generateResponseWithGemini = async (input) => {
  try {
    const result = await model.generateContent(input); 
    return result.response.text().trim() || "Sorry, I didn't understand your question.";
  } catch (error) {
    return `An error occurred while generating a response: ${error.message}`;
  }
};

export const testInput = async (input, userId) => {
  try {
    const user = await UserSchemaModel.findOne({ _id: userId });

    if (!user) {
      return {
        intent: "error",
        message: "User not found.",
        source: "System",
      };
    }

    const nlpResult = await getBestIntent(input);

    if (nlpResult.intent === "greetings" && nlpResult.confidence >= 0.5) {
      return {
        intent: "greetings",
        message: user?.name ? getDynamicGreeting(user.name) : "Hi there! How are you?",
        source: "NLP",
      };
    }

    const generalResponse = await generateResponseWithGemini(input); 
    return {
      intent: "general",
      message: generalResponse,
      source: "Gemini",
    };

  } catch (error) {
    return {
      intent: "error",
      message: `An error occurred while processing your request. Error: ${error.message}`,
      source: "System",
    };
  }
};
