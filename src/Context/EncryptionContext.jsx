// src/Context/EncryptionContext.js
import { createContext, useContext, useState } from "react";
import CryptoJS from "crypto-js";

const EncryptionContext = createContext();

export const EncryptionProvider = ({ children }) => {
  const [key, setKey] = useState(null);

  const deriveKey = (password, email) => {
    const derivedKey = CryptoJS.PBKDF2(password, email, {
      keySize: 256 / 32,
      iterations: 1000,
    });
    setKey(derivedKey.toString());
  };

  return (
    <EncryptionContext.Provider value={{ key, deriveKey }}>
      {children}
    </EncryptionContext.Provider>
  );
};

export const useEncryption = () => useContext(EncryptionContext);
