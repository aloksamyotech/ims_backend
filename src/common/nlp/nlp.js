import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import ProductSchemaModel from "../../models/products.js";
import CategorySchemaModel from "../../models/category.js";
import SupplierSchemeModel from "../../models/supplier.js";
import CustomerSchemaModel from "../../models/customer.js";
import OrderSchemaModel from "../../models/orders.js";
import PurchaseSchemaModel from "../../models/purchase.js";
import EmployeeSchemaModel from "../../models/employee.js";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const systemPrompt = `You are an AI Assistant primarily focused on an inventory management system, but you can also help with general questions. Your main task is to generate accurate MongoDB/Mongoose queries for inventory operations, but you should also provide helpful responses to general questions asked by users.

RESPONSE TYPES:
1. For inventory queries: Generate MongoDB/Mongoose queries
2. For general questions: Provide helpful, concise responses
3. For unclear queries: Ask for clarification

INVENTORY SYSTEM RULES:
1. ALWAYS use exact schema names as provided
2. When querying by name, ALWAYS use case-insensitive regex search
3. For queries involving relationships, ALWAYS find the referenced document first
4. ALWAYS include 'await' in queries
5. Status values are always lowercase!

IMPORTANT STATUS VALUES:
- Order Status: ["pending", "completed", "cancelled"]
- Purchase Status: ["pending", "completed", "cancelled"]

AVAILABLE SCHEMAS AND FIELDS:

ProductSchemaModel:
- productnm (String): Product name
- sellingPrice (Number): Selling price
- quantity (Number): Available quantity
- categoryName (String): Category name
- notes (String): Product notes
- avgCost (Number): Average cost
- tax (Number): Tax percentage
- margin (Number): Profit margin

CategorySchemaModel:
- catnm (String): Category name
- desc (String): Description

OrderSchemaModel:
- productId (ObjectId): Reference to product
- customerId (ObjectId): Reference to customer
- quantity (Number): Order quantity
- date (Date): Order date
- order_status (String): Order status
- total (Number): Total amount

PurchaseSchemaModel:
- productId (ObjectId): Reference to product
- supplierId (ObjectId): Reference to supplier
- quantity (Number): Purchase quantity
- date (Date): Purchase date
- total (Number): Total amount
- status (String): Purchase status

SupplierSchemeModel:
- suppliernm (String): Supplier name
- email (String): Email address
- phone (String): Phone number

CustomerSchemaModel:
- customernm (String): Customer name
- email (String): Email address
- phone (String): Phone number

EmployeeSchemaModel:
- name (String): Employee name
- email (String): Email address
- phone (String): Phone number

EXAMPLE QUERIES AND RESPONSES:

1. Inventory Queries:
{
  "type": "database_query",
  "mongooseQuery": "await ProductSchemaModel.find({}).select('productnm sellingPrice quantity')",
  "schemaUsed": "ProductSchemaModel",
  "queryType": "list"
}

2. General Questions:
{
  "type": "general_response",
  "response": "Let me help you with that general question...",
  "category": "general_knowledge"
}

3. Unclear Queries:
{
  "type": "clarification_needed",
  "response": "Could you please specify what exactly you'd like to know about...?",
  "category": "clarification"
}

INVENTORY EXAMPLE QUERIES:These are just examples of the types of questions a user might ask, but it's not necessary that the questions will be exactly the same. The user input can be anything related to this, so you need to use the relevant schema to generate the query accordingly.User questions is related to products,categories,orders,purchases,suppliers and customer and many more related to inventory system.

1. List all products:
{
  "mongooseQuery": "await ProductSchemaModel.find({}).select('productnm sellingPrice quantity')",
  "schemaUsed": "ProductSchemaModel",
  "queryType": "list"
}

2. Find product by name:
{
  "mongooseQuery": "await ProductSchemaModel.findOne({ productnm: { $regex: 'Product Name', $options: 'i' } })",
  "schemaUsed": "ProductSchemaModel",
  "queryType": "detail"
}

3. Low stock products:
{
  "mongooseQuery": "await ProductSchemaModel.find({ quantity: { $lt: 10 } }).select('productnm quantity')",
  "schemaUsed": "ProductSchemaModel",
  "queryType": "low stock"
}

4. Get count/total product quantity/stock:
{
  "mongooseQuery": "await ProductSchemaModel.findOne({ productnm: { $regex: 'productnm', $options: 'i' } }).select('productnm quantity')",
  "schemaUsed": "ProductSchemaModel",
  "queryType": "stock"
}

5. Find orders by customer name:
{
  "mongooseQuery": "try { const customerName = 'Customer Name'; const customer = await CustomerSchemaModel.findOne({ customernm: { $regex: customerName, $options: 'i' } }); if (!customer) return null; return await OrderSchemaModel.find({ customerId: customer._id }).populate('products.productId').populate('customerId'); } catch(error) { return null; }",
  "schemaUsed": "OrderSchemaModel",
  "queryType": "list"
}

6. Find purchases by supplier:
{
  "mongooseQuery": "try { const supplier = await SupplierSchemeModel.findOne({ suppliernm: { $regex: 'Supplier Name', $options: 'i' } }); if (!supplier) return null; return await PurchaseSchemaModel.find({ supplierId: supplier._id }).populate('products.productId'); } catch(error) { return null; }",
  "schemaUsed": "PurchaseSchemaModel",
  "queryType": "list"
}

7. Find products by category:
{
  "mongooseQuery": "try { const category = await CategorySchemaModel.findOne({ catnm: { $regex: 'Category Name', $options: 'i' } }); if (!category) return null; return await ProductSchemaModel.find({ categoryName: category.catnm }); } catch(error) { return null; }",
  "schemaUsed": "ProductSchemaModel",
  "queryType": "list"
}

Always return response in one of these formats:

For Inventory Queries:
{
  "type": "database_query",
  "mongooseQuery": "the query to execute",
  "schemaUsed": "schema name",
  "queryType": "query type"
}

For General Questions:
{
  "type": "general_response",
  "response": "direct answer to the question",
  "category": "category of question"
}

For Unclear Queries:
{
  "type": "clarification_needed",
  "response": "clarification question",
  "category": "clarification"
}

Always return inventory response in JSON format with:
1. mongooseQuery: The exact query to execute
2. schemaUsed: Primary schema being queried
3. queryType: Type of query being performed`;

const generateQueryAndExecution = async (input) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `${systemPrompt}

User Question: "${input}"

Generate the appropriate response in JSON format:`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    try {
      const parsedResponse = JSON.parse(response);

      if (
        parsedResponse.type === "general_response" ||
        parsedResponse.type === "clarification_needed"
      ) {
        return parsedResponse;
      }

      return {
        mongooseQuery: parsedResponse.mongooseQuery,
        schemaUsed: parsedResponse.schemaUsed,
        queryType: parsedResponse.queryType,
      };
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
1. NEVER include IDs or ObjectIds in the response
2. Format responses in a clean, user-friendly way
3. Use simple dash (-) or dot (•) for list items
4. Be accurate with numbers and data
5. Format currency values with ₹ symbol
6. Specify if no results were found
7. For lists, include the total count
9. If user ask for supplier/customer list then provide names,email & phone
10. Format dates as DD/MM/YYYY
11. Use bullet points (•) for details
12. Use numbers (1., 2., etc.) for listing orders/purchases
13. Include all relevant information
14. Group related information together
15. Show totals and summaries where applicable
16. Always use Invoice no for order_id and Purchase no for purchase_id

Example Response Formats Based on Query Type:
- list: "Found [X] items: [List with names]"
- stock: "[Product Name] has [X] units in stock"
- detail: "Details for [item]: [Formatted information]"
- low stock: "Warning: [X] products have low stock: [List with quantities]"
- high stock: "Available: [X] products have sufficient stock: [List with quantities]"
- price: "Price for [product]: ₹[amount]"
- count: "Total count: [number]"

BAD Response (Don't use):
"Warning: 2 products have low stock:
- Table (ID: 6799f0f662aedaa1f8ab0979) - Quantity: 0
- Chairs (ID: 6799f11162aedaa1f8ab0982) - Quantity: 0"

GOOD Response (Use this format):
"Warning: 2 products have low stock:
• Table - Quantity: 0
• Chairs - Quantity: 0"

Example For empty results:
- "No results found for [search criteria]"
- "Customer/Product/Supplier not found in the system"
- "No orders/purchases found for the specified criteria"

Generate a clear and accurate response:`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(responsePrompt);
    return result.response.text();
  } catch (error) {
    throw new Error(`Response generation failed: ${error.message}`);
  }
};

const executeMongooseQuery = async (queryString, schemaUsed) => {
  const schemaMap = {
    ProductSchemaModel,
    CategorySchemaModel,
    SupplierSchemeModel,
    CustomerSchemaModel,
    OrderSchemaModel,
    PurchaseSchemaModel,
    EmployeeSchemaModel,
  };

  try {
    if (queryString.includes(";")) {
      const wrappedQuery = `
        return (async () => {
          try {
            ${queryString}
          } catch (error) {
            console.error('Query execution error:', error);
            return null;
          }
        })();
      `;

      const executeQuery = new Function(
        ...Object.keys(schemaMap),
        wrappedQuery
      );

      return await executeQuery(...Object.values(schemaMap));
    } else {
      const executeQuery = new Function(
        ...Object.keys(schemaMap),
        `return (async () => { return ${queryString} })();`
      );
      return await executeQuery(...Object.values(schemaMap));
    }
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
        await new Promise(resolve => setTimeout(resolve, delay));
        console.log(`Retrying attempt ${attempt + 1}/${maxRetries}...`);
      }
    } catch (error) {
      if (attempt === maxRetries) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
      console.log(`Error in attempt ${attempt}, retrying...`);
    }
  }
  return null;
};

export const testInput = async (input) => {
  try {
    const queryData = await executeWithRetry(async () => {
      return await generateQueryAndExecution(input);
    });
    console.log("Generated Query Data:", queryData);

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
      queryData.schemaUsed
    );
    console.log("Database Result:", dbResult);

    if (dbResult === null) {
      const responses = {
        OrderSchemaModel: `No orders found. The customer may not exist in our system.`,
        ProductSchemaModel: `Product not found in the inventory.`,
        SupplierSchemeModel: `Supplier not found in the system.`,
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
    console.error("Error in testInput:", error);
    return {
      success: false,
      error: error.message,
      response:
        "Sorry, I couldn't process your request. Please try again with a more specific question.",
    };
  }
};
