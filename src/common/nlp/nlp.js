import { NlpManager } from "node-nlp";
import {
    productDetailPhrases,
  listCategoriesPhrases,
  getSingleProductDetail,
  getProductPriceDetail,
  getProductStockDetail
} from "./intents.js";

const manager = new NlpManager({ languages: ["en"] });

export const testInput = async (input) => {
  listCategoriesPhrases.forEach((phrase) =>
    manager.addDocument("en", phrase, "list.categories")
  );

  // findCategoryNamePhrases.forEach((phrase) =>
  //     manager.addDocument('en', phrase, 'find.category.name')
  // );

  // categoryDetailsPhrases.forEach((phrase) =>
  //     manager.addDocument('en', phrase, 'category.details')
  // );
  productDetailPhrases.forEach((phrase) =>
    manager.addDocument("en", phrase, "product.detail")
  );

  getSingleProductDetail.forEach((phrase) =>
    manager.addDocument("en", phrase, "singleproduct.detail")
  );

  getProductStockDetail.forEach((phrase) =>
    manager.addDocument("en", phrase, "product.stock")
  );

  getProductPriceDetail.forEach((phrase) =>
    manager.addDocument("en", phrase, "product.price")
  );
  await manager.train();
  await manager.save();
  const result = await getBestIntent(input);
  return result;
};
const getBestIntent = async (input) => {
  try {
    const response = await manager.process("en", input);
    if (!response.intent || response.score < 0.5) {
      return {
        intent: null,
        message: "No matching intent found. Try refining your input.",
        confidence: response.score,
      };
    }
    return {
      intent: response.intent,
      confidence: response.score,
      entities: response.entities,
      answer: response.answer,
    };
  } catch (error) {
    console.error("Error processing input:", error);
    throw new Error("Failed to process input.");
  }
};
