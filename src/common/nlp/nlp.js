import { GoogleGenerativeAI } from "@google/generative-ai";
import { NlpManager } from "node-nlp";
import dotenv from "dotenv";
import mongoose from "mongoose";
import UserSchemaModel from "../../models/user.js";
import ProductSchemaModel from "../../models/products.js";
import CategorySchemaModel from "../../models/category.js";
import {
  productDetailPhrases,
  listCategoriesPhrases,
  getSingleProductDetail,
  getProductPriceDetail,
  getProductStockDetail,
  lowStockProductDetail,
  productCategoryActions,
  greet,
} from "./intents.js";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const mongoUri = process.env.DBURL;

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

const manager = new NlpManager({ languages: ["en"] });

const intentMappings = [
  { phrases: greet, intent: "greetings" },
  { phrases: productDetailPhrases, intent: "product_details" },
  { phrases: listCategoriesPhrases, intent: "list_categories" },
  { phrases: getSingleProductDetail, intent: "single_product" },
  { phrases: getProductPriceDetail, intent: "product_price" },
  { phrases: getProductStockDetail, intent: "product_stock" },
  { phrases: lowStockProductDetail, intent: "low_stock" },
  { phrases: productCategoryActions, intent: "category_actions" },
];

intentMappings.forEach(({ phrases, intent }) => {
  phrases.forEach((phrase) => manager.addDocument("en", phrase, intent));
});

const addProductsToNLP = async () => {
  try {
    const products = await ProductSchemaModel.find({});

    if (products.length === 0) {
      console.error("No products found in the database.");
      return;
    }

    products.forEach((product) => {
      const productName = product.productnm.toLowerCase();

      const variations = [
        productName,
        `${productName}s`,
        `${productName} item`,
        `${productName} product`,
      ];
      manager.addNamedEntityText("product", productName, ["en"], variations);
    });
    console.log("Products added to NLP manager successfully!");
  } catch (error) {
    console.error("Error adding products to NLP manager:", error);
  }
};
await addProductsToNLP();

await manager.train();
await manager.save();
await manager.load();


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
    return (
      result.response.text().trim() ||
      "Sorry, I didn't understand your question."
    );
  } catch (error) {
    return `An error occurred while generating a response: ${error.message}`;
  }
};

const handleProductQuery = async (intent, entities) => {
  try {
    const productNameEntity = entities.find((e) => e.entity === "product");
    const productName = productNameEntity ? productNameEntity.sourceText.toLowerCase() : null; 

    const category = entities.find((e) => e.entity === "category")?.sourceText;

    switch (intent) {
      case "product_details":
        return await ProductSchemaModel.find({});

        case "list_categories":
          return await CategorySchemaModel.find({});

      case "single_product":
        return productName
          ? await ProductSchemaModel.findOne({
              productnm: new RegExp(`^${productName}$`, "i"), 
            })
          : "Please specify a product name.";

      case "product_price":
        const priceProduct = await ProductSchemaModel.findOne({
          productnm: new RegExp(productName, "i"),
        });
        return priceProduct
          ? `The price of ${priceProduct.productnm} is $${priceProduct.sellingPrice}.`
          : `I couldn't find a product named "${productName}".`;

      case "product_stock":
        const stockProduct = await ProductSchemaModel.findOne({
          productnm: new RegExp(productName, "i"),
        });
        return stockProduct
          ? `Current stock for ${stockProduct.productnm}: ${stockProduct.quantity} units.`
          : "Product not found.";

      case "low_stock":
        const lowStockProducts = await ProductSchemaModel.find(
          { quantity: { $lt: quantityAlert } },
          "productnm quantity"
        );
        return lowStockProducts;

      case "category_actions":
        return category
          ? await ProductSchemaModel.find({
              categoryName: new RegExp(category, "i"),
            })
          : "Please specify a category.";

      default:
        return null;
    }
  } catch (error) {
    console.error("Product query error:", error);
    throw error;
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

    if (nlpResult.intent === "greetings" && nlpResult.confidence >= 0.6) {
      return {
        intent: "greetings",
        message: user.name
          ? getDynamicGreeting(user.name)
          : "Hi there! How are you?",
        source: "NLP",
      };
    }

    if (
      (nlpResult.confidence >= 0.6 && nlpResult.intent.includes("product")) ||
      nlpResult.intent.includes("categories")
    ) {
      const productResponse = await handleProductQuery(
        nlpResult.intent,
        nlpResult.entities
      );
      if (productResponse) {
        const formattedResponse = await generateResponseWithGemini(
          `You are an intelligent and helpful assistant. Your task is to simplify and present database responses in a user-friendly format based on a given user question. 
      
          Here is the user question: 
          ~~~~
          ${input}
          ~~~~
      
          Here is the database response:
          
          ~~~~~
          ${JSON.stringify(productResponse)}
          ~~~~~
      
          Please format your response as follows:
          - Address the user's question directly. For example: if user asked to list all products then you should return only name of the products. If the user asks price about a product, response should include the price of the product.
          - Use natural language that is easy to understand.
          - Provide only relevant details from the database response.
          - Avoid technical jargon or raw data formats unless specifically asked for.
          - If the database response contains multiple records, summarize them concisely.
          - **For specific product details, respond with the product name followed by the requested information. For example: "The price of [product name] is [price]."**
      
          Your response should be clear, concise, and helpful. Begin your response directly without repeating the user's question unless necessary.`
        );

        return {
          intent: nlpResult.intent,
          message: formattedResponse,
          source: "Database",
          data: productResponse,
        };
      }
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
