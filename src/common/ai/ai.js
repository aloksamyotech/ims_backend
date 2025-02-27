import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import ProductSchemaModel from "../../models/products.js";
import CategorySchemaModel from "../../models/category.js";
import SupplierSchemaModel from "../../models/supplier.js";
import CustomerSchemaModel from "../../models/customer.js";
import OrderSchemaModel from "../../models/orders.js";
import PurchaseSchemaModel from "../../models/purchase.js";
import EmployeeSchemaModel from "../../models/employee.js";
import SubscriptionSchemaModel from "../../models/subscription.js";
import { buildSystemPrompt } from "./systemPrompt.js";
import {
  responseFormat,
  responseQueryFormat,
  emptyResponse,
  commonResponse,
} from "./responseFormat.js";
import mongoose from "mongoose";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const systemPrompt = buildSystemPrompt();

const generateQueryAndExecution = async (input, userId) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `${systemPrompt}

User Question: "${input}"

Generate the appropriate response in JSON format. Use '${userId}' as the userId value in queries.
Example format:
{
  "mongooseQuery": "await ProductSchemaModel.find({ userId: '${userId}' }).select('productnm sellingPrice quantity')",
  "schemaUsed": "SchemaModelName",
  "queryType": "query_type"
}`;
    const result = await model.generateContent(prompt);
    let response = result.response.text();
    response = response.replace(/```json|```/g, "").trim();
    try {
      const parsedResponse = JSON.parse(response);

      if (
        parsedResponse.type === "general_response" ||
        parsedResponse.type === "clarification_needed"
      ) {
        return parsedResponse;
      }
      return parsedResponse;
    } catch (error) {
      throw new Error(`Invalid query generation response: ${error.message}`);
    }
  } catch (error) {
    throw new Error(`Query generation failed: ${error.message}`);
  }
};

const generateResponse = async (input, dbResult, queryType) => {
  const responsePrompt = `
Generate a precise and accurate response for this database result:

Input Query: "${input}"
Query Type: ${queryType}
Result: ${JSON.stringify(dbResult)}

Example Response Formatting Rules:
${responseFormat}

Example Response Formats Based on Query Type:
${responseQueryFormat}

${commonResponse}

Example For empty results:
${emptyResponse}

Generate a clear and accurate response:`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(responsePrompt);
    return result.response.text();
  } catch (error) {
    throw new Error(`Response generation failed: ${error.message}`);
  }
};

const executeMongooseQuery = async (queryString, schemaUsed, userId) => {
  const schemaMap = {
    ProductSchemaModel,
    CategorySchemaModel,
    SupplierSchemaModel,
    CustomerSchemaModel,
    OrderSchemaModel,
    PurchaseSchemaModel,
    EmployeeSchemaModel,
    SubscriptionSchemaModel,
  };

  try {
 
    const wrappedQuery = `
      return (async () => {
        try {
          const result = ${queryString};
          if (!result || result.length === 0) {
            throw new Error("No data found.");
          }
          return result;
        } catch (error) {
          console.error('Query execution error:', error);
          return null;
        }
      })();
    `;

    const executeQuery = new Function(...Object.keys(schemaMap), "mongoose", wrappedQuery);

    return await executeQuery(...Object.values(schemaMap), mongoose);
  } catch (error) {
    throw new Error(`Query execution failed: ${error.message}`);
  }
};


const executeWithRetry = async (func, maxRetries = 3, delay = 500) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await func();
      if (result !== null && result !== undefined) {
        return result;
      }

      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    } catch (error) {
      if (attempt === maxRetries) throw error;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  return null;
};

export const testInput = async (input, userId) => {
  try {
    const queryData = await executeWithRetry(async () => {
      return await generateQueryAndExecution(input, userId);
    });

    if (
      queryData.type === "general_response" ||
      queryData.type === "clarification_needed"
    ) {
      return {
        success: true,
        data: {
          type: queryData.type,
          response: queryData.response,
          category: queryData.category,
        },
      };
    }

    const dbResult = await executeMongooseQuery(
      queryData.mongooseQuery,
      queryData.schemaUsed,
      userId
    );

    if (dbResult === null || dbResult.length === 0) {
      const responses = {
        OrderSchemaModel: `No orders found. The customer may not exist in our system.`,
        ProductSchemaModel: `Product not found in the inventory.`,
        SupplierSchemaModel: `Supplier not found in the system.`,
        CustomerSchemaModel: `Customer not found in the system.`,
        CategorySchemaModel: `Category not found in the system.`,
        PurchaseSchemaModel: `No purchases found for the specified criteria.`,
      };

      return {
        success: true,
        data: {
          query: queryData.mongooseQuery,
          result: null,
          response:
            responses[queryData.schemaUsed] ||
            `No results found for your query.`,
        },
      };
    }

    const response = await generateResponse(
      input,
      dbResult,
      queryData.queryType
    );
    return {
      success: true,
      data: {
        query: queryData.mongooseQuery,
        result: dbResult,
        response: response,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      response:
        "Sorry, I couldn't process your request. Please try again with a more specific question.",
    };
  }
};
