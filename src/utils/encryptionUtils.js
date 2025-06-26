import CryptoJS from "crypto-js";

export const encrypt = (text, key) => {
  return CryptoJS.AES.encrypt(text, key).toString();
};

export const decrypt = (cipher, key) => {
  const bytes = CryptoJS.AES.decrypt(cipher, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};
