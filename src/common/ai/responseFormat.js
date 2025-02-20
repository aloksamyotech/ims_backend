export const responseFormat = `
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
17.Return the complete stock management report with the following details for each product only when user input is about to reports:
• Product name
• Selling price
• Average cost
• Quantity available
• Total sales
• Total purchases
• Total profit

Ensure the data is grouped by product and properly formatted, with all relevant fields included in the response.`;

export const responseQueryFormat = `- list: "Found [X] items: [List with names]"
- stock: "[Product Name] has [X] units in stock"
- detail: "Details for [item]: [Formatted information]"
- low stock: "Warning: [X] products have low stock: [List with quantities]"
- high stock: "Available: [X] products have sufficient stock: [List with quantities]"
- price: "Price for [product]: ₹[amount]"
- count: "Total count: [number]"`;

export const emptyResponse = `- "No results found for [search criteria]"
- "Customer/Product/Supplier not found in the system"
- "No orders/purchases found for the specified criteria"`;

export const commonResponse = `BAD Response (Don't use):
"Warning:
- Table (ID: 6799f0f662aedaa1f8ab0979)
- Customer Name (ID: 6799f11162aedaa1f8ab0982)"

GOOD Response (Use this format):
"Warning:
• Table - Quantity: 0
• Chairs - Quantity: 0"`;
