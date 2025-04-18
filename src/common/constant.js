export const statusCodes = {
  ok: 200,
  created: 201,
  accepted: 202,
  noContent: 204,
  movedPermanently: 301,
  found: 302,
  notModified: 304,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  methodNotAllowed: 405,
  conflict: 409,
  internalServerError: 500,
  notImplemented: 501,
  badGateway: 502,
  serviceUnavailable: 503,
};

export const tableNames = {
  pcategory: "pcategory",
  punit: "punit",
  supplier: "supplier",
  customer: "customer",
  products: "products",
  orders: "orders",
  users: "users",
  purchase: "purchase",
  admin: "admin",
  subscription: "subscription",
  employee: "employee",
  empPermissions : "empPermissions",
};

export const messages = {
  already_registered: "User already registered",
  invalid_credentials: "Invalid email, username or password.",
  password_reset_success: "Password reset link has been sent to your email.",
  email_taken: "This email is already associated with an account.",
  registration_success: "Registration successful! You can now log in.",
  invalid_email_format: "Please provide a valid email address.",
  data_update_success: "Data updated successfully.",
  data_add_success: "Data added successfully",
  data_add_error: "Data not added",
  data_update_error: "Data not updated",
  data_deletion_success: "Data deleted successfully.",
  data_deletion_error: "Data deletion failed.",
  data_not_found: "Requested data not found.",
  server_error: "An unexpected error occurred. Please try again later.",
  bad_request: "The request could not be understood by the server.",
  unauthorized_access: "You do not have permission to access this resource.",
  fetching_failed : "Failed to fetch data",
  fetching_success : "Successfully fetch data",
  required : "This is required.",
  not_available: "Data not available",
  invalid_format: "Invalid data format",
  account_inactive: "Your account is inactive. Please contact the administrator.",
  already_exist: 'Already exist',
};

export const image_url = {  url :"https://ims.samyotech.in/api/" , };

export const key = "riya"