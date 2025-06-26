# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


![alt text](<ChatGPT Image Jun 26, 2025, 11_13_42 PM.png>)

---

## 1. **Overview**

Your app is a **Password Manager** built with:

* React (SPA with routing)
* Context API for **auth** and **encryption**
* Tailwind CSS for styling
* Secure encryption using `crypto-js` and `PBKDF2`
* Backend hosted at `https://passwordmanagerbackend-c4n3.onrender.com`

The app allows users to:

* Sign up and log in
* Derive an encryption key from their password
* Encrypt/decrypt credentials client-side
* Store/retrieve encrypted data via the backend
* Manage saved credentials (edit, delete)

---

## 2. **Authentication Flow**

### Context: `AuthContext.js`

* Stores JWT `token` in `localStorage`
* Decodes token using `jwtDecode` to get user info (`email`, `username`)
* Provides:

  * `login(token)` – saves token and sets auth state
  * `logout()` – clears token and resets user

### Usage:

* `Home.jsx` uses `useAuth()` to:

  * `login(token)` after successful auth
  * Access `user.email` during encryption
* `Manager.jsx` uses the token to:

  * Fetch password data
  * Authorize CRUD operations

---

## 3. **Encryption Logic**

### Context: `EncryptionContext.js`

* Maintains derived `key` in memory (not stored anywhere)
* Uses:

  * `PBKDF2` (Password-Based Key Derivation Function 2)
  * Combines user password + email to create a consistent key
* Provides:

  * `deriveKey(password, email)` – generates key from login credentials
  * `encrypt(text, key)` – AES encryption
  * `decrypt(ciphertext, key)` – AES decryption

> The encryption key is not stored in localStorage for security; it's kept in memory only for the session.

---

## 4. **App Structure**

### `App.jsx`

```jsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/manager" element={<Manager />} />
  </Routes>
</BrowserRouter>
```

* Routes to `Home` (login/signup) and `Manager` (password vault)
* Wrapped by `AuthProvider` and `EncryptionProvider` in `main.jsx`

---

## 5. **Home Component (Login / Sign-up)**

### Features:

* Toggle between login and sign-up via `isLogin` state
* On **Login**:

  * Fetch token from backend
  * Call `login(token)`
  * Derive encryption key with `deriveKey(password, email)`
  * Navigate to `/manager`
* On **Sign-up**:

  * Sends new credentials to backend
  * If success, prompts user to switch to login

### UX:

* Flip card animation using Tailwind and CSS transforms
* Form inputs validate presence
* Alerts show server responses or errors

---

## 6. **Manager Component (Password Vault)**

### States:

* `form` – site/username/password input
* `passwordarray` – stored credentials (decrypted)
* `showUnlockModal` – shown if `key` is not present
* `tempPassword` – user-provided password for re-deriving key

### Key Operations:

#### 1. **Initial Load (useEffect)**

* If `key` is missing (due to page refresh), shows unlock modal
* Otherwise, fetches encrypted credentials
* Decrypts each field using stored `key`

#### 2. **Saving a Password**

```jsx
- Form input -> encrypt fields -> send POST to /api/manage
- On success -> show alert -> clear form
```

#### 3. **Editing a Password**

```jsx
- Pre-fill form with item -> delete original entry
- User edits and re-submits
```

#### 4. **Deleting a Password**

```jsx
- Confirm with user
- Send DELETE request -> filter entry from `passwordarray`
```

#### 5. **Unlock Modal**

* Triggered when `key` is missing (on reload)
* Prompts for password
* Re-derives key using `email` and entered password

### UI Highlights:

* Copy icons for site, username, and password using `navigator.clipboard`
* Responsive layout for mobile/desktop
* Smooth styling with Tailwind

---

## 7. **Navbar**

### Features:

* Shows user info from context
* Logout button clears token and redirects to login
* GitHub button styled as dropdown
* Responsive menu with `FaBars` for mobile

---

## 8. **Security Measures**

* **Client-Side Encryption**: All sensitive data is encrypted before being sent to the server
* **Key Derivation**: Uses PBKDF2 with password + email → consistent but unguessable key
* **No Key Storage**: Key exists only in memory during session
* **JWT Auth**: Token stored in `localStorage`, used for API requests
* **Unlock Modal**: Forces password re-entry on reload (because key is lost)

---

## 9. **Potential Improvements**

| Area                    | Suggestion                                                       |
| ----------------------- | ---------------------------------------------------------------- |
| Key Persistence         | Use sessionStorage instead of memory, if security policies allow |
| UX Enhancements         | Show loading spinners, error messages under inputs               |
| Password Strength Meter | Add indicator for user password during sign-up                   |
| Forgot Password Flow    | Implement secure reset mechanism                                 |
| Rate Limiting           | On backend to prevent brute-force attacks                        |
| Auto Logout             | On token expiry, log out automatically                           |
| Use HTTPS everywhere    | Ensure secure transport for all data                             |
| Code Splitting          | Use `React.lazy` for large components                            |

---

## Summary

Your app is a well-designed **secure password manager** that prioritizes:

* **Encryption**
* **Session-based security**
* **Client-side control over data**

It’s structured modularly using modern React patterns like Context, Hooks, and dynamic routing. The architecture allows for a clean separation between authentication, encryption, and UI logic.




How the passwords of Users securied in this website?

Certainly Satya. Below is a **detailed notes-style explanation** of `crypto-js` as used in your password manager project. It covers core cryptography concepts, the library's features, and working examples.

---

# **Crypto-JS in Password Manager Applications**

## 1. **What is `crypto-js`?**

`crypto-js` is a JavaScript library that provides standard and secure cryptographic algorithms. It is useful for performing encryption, decryption, and hashing in JavaScript applications, particularly when working with sensitive data like passwords.

### Common features include:

* AES (Advanced Encryption Standard) for symmetric encryption.
* SHA1, SHA256, SHA512 for hashing.
* PBKDF2 for key derivation from a password.
* Base64, Hex, Utf8, Latin1 encoding/decoding.

---

## 2. **Use Case in Password Managers**

In a password manager:

* You store user-entered passwords securely.
* You encrypt them **before** sending to the database.
* You decrypt them **only after** the user re-authenticates or provides their master password.

---

## 3. **AES Encryption and Decryption**

AES is a symmetric encryption algorithm:

* The same key is used for both encryption and decryption.
* If someone knows the key, they can decrypt the data.

### Example

```js
import CryptoJS from "crypto-js";

const key = "mysecretkey"; // Not secure for production use

const encrypted = CryptoJS.AES.encrypt("MyPassword123", key).toString();
const bytes = CryptoJS.AES.decrypt(encrypted, key);
const decrypted = bytes.toString(CryptoJS.enc.Utf8);

console.log(encrypted);  // Encrypted Base64 string
console.log(decrypted);  // MyPassword123
```

**Note**: This is insecure because the key is hardcoded or visible in browser tools.

---

## 4. **Using PBKDF2 for Secure Key Derivation**

PBKDF2 (Password-Based Key Derivation Function 2) is used to derive a strong encryption key from a weak input like a password.

### Parameters:

* `password`: The user’s login password (or master password).
* `salt`: A unique string (e.g., user email) to prevent dictionary attacks.
* `iterations`: How many times to hash the input (higher is more secure but slower).
* `keySize`: Size of the derived key in 32-bit words (e.g., 256 / 32 = 8 words for AES-256).

### Example

```js
const key = CryptoJS.PBKDF2("userPassword", "user@example.com", {
  keySize: 256 / 32,
  iterations: 1000
});
```

This `key` can now be used for AES encryption or decryption.

---

## 5. **Encrypting User Data**

You encrypt each field before storing it in MongoDB.

```js
const encryptedForm = {
  site: CryptoJS.AES.encrypt(form.site, key.toString()).toString(),
  username: CryptoJS.AES.encrypt(form.username, key.toString()).toString(),
  password: CryptoJS.AES.encrypt(form.password, key.toString()).toString(),
};
```

You send `encryptedForm` to the server instead of the raw form.

---

## 6. **Decrypting Data for Display**

When retrieving encrypted data from MongoDB, decrypt using the same key.

```js
const site = CryptoJS.AES.decrypt(encrypted.site, key.toString()).toString(CryptoJS.enc.Utf8);
const username = CryptoJS.AES.decrypt(encrypted.username, key.toString()).toString(CryptoJS.enc.Utf8);
const password = CryptoJS.AES.decrypt(encrypted.password, key.toString()).toString(CryptoJS.enc.Utf8);
```

Only perform this after the user logs in or re-enters their password to derive the key.

---

## 7. **Storage of Encryption Key**

**Not Recommended**:

* Storing key in `localStorage` or `sessionStorage`
* Hardcoding key in code

**Recommended**:

* Derive key in memory using PBKDF2 each time user logs in
* Re-derive the key when needed (e.g., prompt user for password)

---

## 8. **Handling Page Reloads**

Problem:

* React state is cleared on page reload, so the key is lost.

Solution:

* On page reload, prompt the user to re-enter their password.
* Use the password + user email again to re-derive the key using PBKDF2.
* Only then decrypt the data.

---

## 9. **Practical Flow in Password Manager**

1. **User logs in**

   * Store user token and email
   * Ask user to enter password again (or use login password)

2. **Derive AES key using PBKDF2**

   * Save in React Context or memory

3. **Encrypt user credentials before sending to backend**

   * Use AES with the derived key

4. **Store only encrypted data in MongoDB**

5. **On dashboard**

   * Decrypt data using the same derived key
   * Show decrypted data in the UI

6. **On reload**

   * Prompt for password again
   * Re-derive key
   * Decrypt again

---

## 10. **Security Best Practices**

* Always use PBKDF2 for key derivation.
* Never store plaintext passwords or keys in localStorage.
* Use a secure salt (e.g., user's email) to avoid key collisions.
* Avoid hardcoded or shared encryption keys across users.
* Never send encryption keys to the backend.




