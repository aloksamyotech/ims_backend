import jwt from "jsonwebtoken";
import { statusCodes, messages } from "../common/constant.js";
import process from "process";

export const authenticateJWT = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res
      .status(statusCodes.forbidden)
      .json({ success: false, message: messages.required });
  }

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(statusCodes.unauthorized)
        .json({ success: false, message: messages.invalid_format });
    }

    req.user = decoded;
    next();
  });
};
