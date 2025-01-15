import { getProductQuantityByName } from "../services/chatbot.js";
import { statusCodes, messages } from "../common/constant.js";

export const getProductQuantity = async (req, res) => {
  const { message } = req?.body;
  const userId = req?.query?.userId;

  const productName = extractProductName(message);

  if (!productName) {
    return res
      .status(statusCodes.badRequest)
      .json({ message: messages.data_not_found });
  }

  try {
    const product = await getProductQuantityByName(productName, userId);

    return res.json({
      product: product.productnm,
      quantity: product.quantity,
    });
  } catch (error) {
    return res
      .status(statusCodes.internalServerError)
      .json({ message: messages.fetching_failed });
  }
};

function extractProductName(message) {
  const regex = /product\s(\w+)/i;
  const match = message.match(regex);
  return match ? match[1] : null;
}
