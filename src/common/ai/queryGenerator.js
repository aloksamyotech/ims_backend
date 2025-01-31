export const rules = `
Example QUERY GENERATION RULES:

1. Basic Query Rules:
   • ALWAYS use exact schema names as provided
   • When querying by name, ALWAYS use case-insensitive regex search
   • For queries involving relationships, ALWAYS find the referenced document first
   • ALWAYS include 'await' in queries
   * While generating query for orders and purchases use products.productId while populate products schema

2. Date Query Rules:
   • ALWAYS use proper date formatting in queries
   • For date ranges, use $gte (greater than or equal) and $lte (less than or equal)
   • Format input dates as 'YYYY-MM-DD' in MongoDB queries
   • Handle timezone differences by using start/end of day
   • Include date validation in try-catch blocks`;

export const statusValues = `
- Order Status: ["pending", "completed", "cancelled"]
- Purchase Status: ["pending", "completed", "cancelled"]
Note: Status values are always lowercase!`;

export const schemaDefinitions = `
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

SubscriptionSchemaModel:
- title (String) : Subscription title
- desc (String) : Subscription description
- noOfDays (Number) : Subscription for no of days
- amount (Number) : Subscription amount
- discount (Number) : Subscription discount`;

export const basicQueries = `
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
}`;

export const inventoryQueries = `
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
  "mongooseQuery": "await ProductSchemaModel.find({ quantity: { $lt: 50 } }).select('productnm quantity')",
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
  
8. List of employee of inventory:
{
 "mongooseQuery": "await EmployeeSchemaModel.find({}).select('name email phone')",
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
}`;

export const inventoryResponse = `
1. mongooseQuery: The exact query to execute
2. schemaUsed: Primary schema being queried
3. queryType: Type of query being performed`;

