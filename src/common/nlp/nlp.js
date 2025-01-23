import OpenAI from "openai";
import { NlpManager } from "node-nlp";
import {
  productDetailPhrases,
  listCategoriesPhrases,
  getSingleProductDetail,
  getProductPriceDetail,
  getProductStockDetail,
  lowStockProductDetail,
  productCategoryActions,
} from "./intents.js";
import dotenv from "dotenv";
import ProductSchemaModel from "../../models/products.js";
import CategorySchemaModel from "../../models/category.js";

dotenv.config();

const manager = new NlpManager({ languages: ["en"] });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let databaseProducts = [];

const initializeNlpManager = async () => {
  listCategoriesPhrases.forEach((phrase) =>
    manager.addDocument("en", phrase, "list.categories")
  );

  productDetailPhrases.forEach((phrase) =>
    manager.addDocument("en", phrase, "allproduct.detail")
  );

  getSingleProductDetail.forEach((phrase) =>
    manager.addDocument("en", phrase, "singleproduct.detail")
  );

  getProductStockDetail.forEach((phrase) =>
    manager.addDocument("en", phrase, "product.stock")
  );

  getProductPriceDetail.forEach((phrase) =>
    manager.addDocument("en", phrase, "product.price")
  );

  lowStockProductDetail.forEach((phrase) =>
    manager.addDocument("en", phrase, "product.lowStock")
  );

  productCategoryActions.forEach((phrase) =>
    manager.addDocument("en", phrase, "findproduct.category")
  );

  await manager.train();
  await manager.save();

  databaseProducts = await ProductSchemaModel.find({}, "productnm");
};

initializeNlpManager();

export const testInput = async (input) => {
  const nlpResult = await getBestIntent(input);

  if (!nlpResult.intent || nlpResult.confidence < 0.5) {
    const chatGptResponse = await askChatGpt(input);
    return {
      intent: null,
      message: chatGptResponse,
      source: "ChatGPT",
    };
  }

  const dbResponse = await handleDatabaseQuery(nlpResult.intent, input);
  return {
    intent: nlpResult.intent,
    message: dbResponse,
    source: "NLP",
  };
};

const getBestIntent = async (input) => {
  const response = await manager.process("en", input);
  return {
    intent: response.intent,
    confidence: response.score,
  };
};

const askChatGptForQuery = async (input) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Generate a MongoDB query to fetch data based on the following: ${input}`,
        },
      ],
    });
    const query = completion.choices[0].message.content;
    console.log(query);
    return query;
  } catch (error) {
    console.error("Error with OpenAI API:", error);
    return "Sorry, I couldn't process your request at the moment.";
  }
};

const executeDatabaseQuery = async (query) => {
  try {
    const results = await ProductSchemaModel.find(query); 
    console.log(results);
    return results;
  } catch (error) {
    console.error("Database query failed:", error);
    return "Sorry, we couldn't fetch data from the database.";
  }
};

const handleDatabaseQuery = async (intent, input) => {
  const query = await askChatGptForQuery(input);
  
  if (!query || query.includes("error")) {
    return "No valid query generated.";
  }

  const results = await executeDatabaseQuery(JSON.parse(query)); 
  return results;
};

const askChatGpt = async (input) => {
  const prompt = `Provide a useful response to the following query: ${input}`;
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });
    const response = completion.choices[0].message.content;
    return response;
  } catch (error) {
    console.error("Error with OpenAI API:", error);
    return "I encountered an issue while processing your request.";
  }
};
