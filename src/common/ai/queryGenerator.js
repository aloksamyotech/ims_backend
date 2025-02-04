export const rules = `
Example QUERY GENERATION RULES:

1. Syntax Rules:
- ALWAYS start queries with 'await'
- NEVER use 'const', 'let', or 'var' in queries
- Use IIFE pattern for complex queries: "await (async () => { ... })()"
- Return results directly without variable assignment

2. Basic Rules Examples:
- ALWAYS include userId filter in every query
- Use case-insensitive regex for name searches: { $regex: searchTerm, $options: 'i' }
- Return empty array [] instead of null for no results
- Always use try-catch in async queries
- Always use proper field names as defined in schema
- While generating query for orders and purchases use products.productId while populate products schema

✅ CORRECT:
"await ProductSchemaModel.countDocuments({ userId: userId })"
"await (async () => { return await ProductSchemaModel.find({ userId: userId }) })()"

❌ INCORRECT:
"const count = await ProductSchemaModel.countDocuments({ userId: userId })"
"let products = await ProductSchemaModel.find({ userId: userId })"

2. Schema-Specific Rules:
Orders/Purchases:
- Search in products array using products.productName
- Use embedded customer fields (customerName, customerEmail)
- Include invoice_no, date, order_status in results

Products:
- Search by productnm for product queries
- Include product_no, prices, and categoryName
- Check isDeleted: false in queries

3. Generate a product sales report showing:
1. Product name and category
2. Total quantity sold
3. Total sales amount
4. Average selling price
Consider only completed orders and sort by highest sales.

2. Date Query Rules:
   • ALWAYS use proper date formatting in queries
   • For date ranges, use $gte (greater than or equal) and $lte (less than or equal)
   • Format input dates as 'YYYY-MM-DD' in MongoDB queries
   • Handle timezone differences by using start/end of day
   • Include date validation in try-catch blocks; `;

export const statusValues = `
- Order Status: ["pending", "completed", "cancelled"]
- Purchase Status: ["pending", "completed", "cancelled"]
Note: Status values are always lowercase!`;

export const schemaDefinitions = `
ProductSchemaModel:
- _id (ObjectId): Product ID
- userId (ObjectId): Reference to the users(company)
- productnm (String): Product name
- product_no (String): Product number
- buyingPrice (Number): Buying price
- sellingPrice (Number): Selling price
- avgCost (Number): Average cost
- quantity (Number): Available quantity
- quantityAlert (Number): Alert threshold
- tax (Number): Tax percentage
- margin (Number): Profit margin
- notes (String): Product notes
- categoryId (ObjectId): Category reference
- categoryName (String): Category name
- image (String): Product image
- isDeleted (Boolean): Deletion status
- slug (String): URL-friendly name
- createdAt (Date): Creation timestamp
- updatedAt (Date): Last update timestamp

OrderSchemaModel:
- _id (ObjectId): Order ID
- userId (ObjectId): Reference to the users(company)
- customerId (ObjectId): Customer reference
- customerName (String): Customer name
- customerEmail (String): Customer email
- customerPhone (Number): Customer phone
- customerAddress (String): Customer address
- products: Array of {
    productId (ObjectId): Product reference
    productName (String): Product name
    categoryName (String): Category name
    quantity (Number): Order quantity
    price (Number): Product price
    buyingPrice (Number): Product buying price
  }
- order_status (String): Order status ["pending", "completed", "cancelled"]
- date (Date): Order date
- total (Number): Total amount
- subtotal (Number): Subtotal amount
- tax (Number): Tax amount
- isDeleted (Boolean): Deletion status
- invoice_no (String): Invoice number
- createdAt (Date): Creation timestamp
- updatedAt (Date): Last update timestamp

CategorySchemaModel:
- _id (ObjectId): Category ID
- userId (ObjectId): Reference to the users(company)
- catnm (String): Category name
- desc (String): Description
- isDeleted (Boolean): Deletion status
- createdAt (Date): Creation timestamp
- updatedAt (Date): Last update timestamp

CustomerSchemaModel:
- _id (ObjectId): Customer ID
- userId (ObjectId): Reference to the users(company)
- customernm (String): Customer name
- email (String): Email address
- phone (String): Phone number
- address (String): Customer address
- isDeleted (Boolean): Deletion status
- createdAt (Date): Creation timestamp
- updatedAt (Date): Last update timestamp

SupplierSchemaModel:
- _id (ObjectId): Supplier ID
- userId (ObjectId): Reference to the users(company)
- suppliernm (String): Supplier name
- email (String): Email address
- phone (String): Phone number
- address (String): Supplier address
- isDeleted (Boolean): Deletion status
- createdAt (Date): Creation timestamp
- updatedAt (Date): Last update timestamp

PurchaseSchemaModel:
- _id (ObjectId): Purchase ID
- userId (ObjectId): Reference to the users(company)
- supplierId (ObjectId): Supplier reference
- products: Array of {
    productId (ObjectId): Product reference
    productName (String): Product name
    categoryName (String): Category name
    quantity (Number): Purchase quantity
    price (Number): Product price
  }
- status (String): Purchase status ["pending", "completed", "cancelled"]
- date (Date): Purchase date
- total (Number): Total amount
- subtotal (Number): Subtotal amount
- tax (Number): Tax amount
- isDeleted (Boolean): Deletion status
- purchase_no (String): Purchase number
- createdAt (Date): Creation timestamp
- updatedAt (Date): Last update timestamp

EmployeeSchemaModel:
- _id (ObjectId): Employee ID
- userId (ObjectId): Reference to the users(company)
- name (String): Employee name
- email (String): Email address
- phone (String): Phone number
- isDeleted (Boolean): Deletion status
- createdAt (Date): Creation timestamp
- updatedAt (Date): Last update timestamp

SubscriptionSchemaModel:
- _id (ObjectId): Subscription ID
- title (String): Subscription title
- desc (String): Description
- noOfDays (Number): Duration in days
- amount (Number): Subscription amount
- discount (Number): Discount amount
- isDeleted (Boolean): Deletion status
- createdAt (Date): Creation timestamp
- updatedAt (Date): Last update timestamp
`;

export const basicQueries = `
1. Inventory Queries:
{
  "type": "database_query",
  "mongooseQuery": "await ProductSchemaModel.find({ userId: 'userId' }).select('productnm sellingPrice quantity');",
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
}`;

export const inventoryQueries = `
This is only the example query,If user ask any inventory-related question, generate the query using aggregation, filters, sums, and all other relevant operations to provide the user with 100% accurate results.

1. List all products:
{
  "mongooseQuery": "await ProductSchemaModel.find({ userId: 'userId', }).select('productnm sellingPrice quantity')",
  "schemaUsed": "ProductSchemaModel",
  "queryType": "list"
}

2. Find product by name:
{
  "mongooseQuery": "await ProductSchemaModel.findOne({ userId: 'userId', productnm: { $regex: 'Product Name', $options: 'i' } })",
  "schemaUsed": "ProductSchemaModel",
  "queryType": "detail"
}

3. Low stock products:
{
  "mongooseQuery": "await ProductSchemaModel.find({ userId: 'userId', quantity: { $lt: 50 } }).select('productnm quantity')",
  "schemaUsed": "ProductSchemaModel",
  "queryType": "low stock"
}

4. Get count/total product quantity/stock:
{
  "mongooseQuery": "await ProductSchemaModel.findOne({userId: 'userId', productnm: { $regex: 'productnm', $options: 'i' } }).select('productnm quantity')",
  "schemaUsed": "ProductSchemaModel",
  "queryType": "stock"
}

5.Find Orders by Product Name
{
  "mongooseQuery": "await (async () => { const product = await ProductSchemaModel.findOne({ userId: userId, productnm: { $regex: productName, $options: 'i' } }); if (!product) return []; return await OrderSchemaModel.find({ userId: userId, 'products.productId': product._id }).populate('products.productId', 'productnm sellingPrice').populate('customerId', 'customernm email phone').select('customerId products quantity total order_status createdAt invoice_no'); })()",
  "schemaUsed": ["ProductSchemaModel", "OrderSchemaModel"],
  "queryType": "list"
}

5.Find Purchase by Product Name
{
  "mongooseQuery": "await (async () => { const product = await ProductSchemaModel.findOne({ userId: userId, productnm: { $regex: productName, $options: 'i' } }); if (!product) return []; return await PurchaseSchemaModel.find({ userId: userId, 'products.productId': product._id }).populate('products.productId', 'productnm sellingPrice').populate('supplierId', 'suppliernm email phone').select('supplierId products quantity total status createdAt purchase_no'); })()",
  "schemaUsed": ["ProductSchemaModel", "PurchaseSchemaModel"],
  "queryType": "list"
}


7.Find Purchases by Supplier Name:
{
  "mongooseQuery": "await (async () => { const supplier = await SupplierSchemaModel.findOne({ userId: userId, suppliernm: { $regex: supplierName, $options: 'i' } }); if (!supplier) return []; return await PurchaseSchemaModel.find({ userId: userId, supplierId: supplier._id }).populate('products.productId', 'productnm sellingPrice').populate('supplierId', 'suppliernm email phone').select('supplierId purchase_no date total status products'); })()",
  "schemaUsed": ["SupplierSchemaModel", "PurchaseSchemaModel"],
  "queryType": "list"
}

7. Find products by category:
{
  "mongooseQuery": "await ProductSchemaModel.find({ userId: 'userId', categoryName: { $regex: 'categoryName', $options: 'i' } })",
  "schemaUsed": "ProductSchemaModel",
  "queryType": "list"
}

8. List of employee of inventory:
{
 "mongooseQuery": "await EmployeeSchemaModel.find({userId: 'userId'}).select('name email phone')",
  "schemaUsed": "EmployeeSchemaModel",
  "queryType": "list"
}

9. List of subscription of inventory:
{
 "mongooseQuery": "await SubscriptionSchemaModel.find({}).select('title noOfDays amount')",
  "schemaUsed": "SubscriptionSchemaModel",
  "queryType": "list"
}
`;

export const responseType = `
For Inventory Queries:
{
  "type": "database_query",
 "mongooseQuery": "the query to execute (must include userId filter)",
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
}`;

export const inventoryResponse = `
1. mongooseQuery: The exact query to execute
2. schemaUsed: Primary schema being queried
3. queryType: Type of query being performed`;
