import CryptoJS from "crypto-js";
import process from "process";

const SECRET_KEY =
  process.env.SECRET || "3B9z@9kL#H8a&5eR*Uj8M!4dQ2^bZ7yN6rQ%8wG";

export const encryptText = (password) => {
  return CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
};

export const decryptText = (encryptedPassword) => {
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
