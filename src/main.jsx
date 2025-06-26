import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from "./Context/AuthContext";
import { EncryptionProvider } from './Context/EncryptionContext';
createRoot(document.getElementById('root')).render(
 <EncryptionProvider>
  <AuthProvider>
    <App />
  </AuthProvider>
</EncryptionProvider>
)
