import jwt from "jsonwebtoken";
import { statusCodes, messages } from "../common/constant.js";

const secret = "3B9z@9kL#H8a&5eR*Uj8M!4dQ2^bZ7yN6rQ%8wG";

export const authenticateJWT = (req, res, next) => {
  try {
    let token = req.headers["authorization"]?.split(" ")[1]?.replace(/^"|"$/g, "").trim();
    if (!token) {
      return next({ statusCode: statusCodes.forbidden, message: messages.required });
    }

    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return next({ statusCode: statusCodes.unauthorized, message: messages.invalid_format });
      }
      req.user = decoded;
      next();
    });
  } catch (error) {
    return next({ statusCode: 401, message: "Unauthorized", error: error.message });
  }
};
