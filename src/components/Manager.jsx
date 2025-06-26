import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FaCopy } from "react-icons/fa6";
import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { encrypt, decrypt } from "../utils/encryptionUtils";
import { useEncryption } from "../Context/EncryptionContext";

function Manager() {
  const { token, user } = useAuth();
  const { key, deriveKey } = useEncryption(); // used to re-derive key
  const [form, setform] = useState({ site: "", username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordarray, setpasswordarray] = useState([]);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [tempPassword, setTempPassword] = useState("");

  const handleCopy = (value) => {
    navigator.clipboard.writeText(value)
      .then(() => alert("Copied!"))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    if (!key) {
      setShowUnlockModal(true);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch("https://passwordmanagerbackend-c4n3.onrender.com/api/retrive", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok) {
          const decryptedData = data.map((entry) => ({
            ...entry,
            site: decrypt(entry.site, key),
            username: decrypt(entry.username, key),
            password: decrypt(entry.password, key),
          }));
          setpasswordarray(decryptedData);
        } else {
          console.error("Error:", data.message);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchData();
  }, [form, key]);

  const handlechange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  const handleeye = () => setShowPassword((prev) => !prev);

  const handleEdit = (item) => {
    setform(item);
    handleDelete(item, true);
  };

  const savepassword = async (e) => {
    e.preventDefault();
    if (!key) {
      alert("Encryption key missing. Please re-login.");
      return;
    }

    const encryptedForm = {
      site: encrypt(form.site, key),
      username: encrypt(form.username, key),
      password: encrypt(form.password, key),
    };

    const res = await fetch("https://passwordmanagerbackend-c4n3.onrender.com/api/manage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(encryptedForm),
    });

    const data = await res.json();
    if (!res.ok) return alert("Issue in saving password");

    alert(data.message);
    setform({ site: "", username: "", password: "" });
  };

  const handleDelete = async (item, suppressAlert = false) => {
    if (!suppressAlert) {
      const confirmDelete = window.confirm(`Do you want to delete ${item.site}?`);
      if (!confirmDelete) return;
    }

    try {
      const res = await fetch(`https://passwordmanagerbackend-c4n3.onrender.com/api/manage/${item._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();
      if (!res.ok) {
        alert("Deletion failed: " + (result.message || "Unknown error"));
        return;
      }

      if (!suppressAlert) alert(result.message || "Deleted successfully");
      setpasswordarray(passwordarray.filter((entry) => entry._id !== item._id));
    } catch (err) {
      console.error(err);
      alert("Something went wrong while deleting.");
    }
  };

  return (
    <>
      <Navbar />

      {/*Unlock Vault Modal if the page refreshes using the temp password which should be same as login password to gtenerate the same key because the crypto-js key is not getting stored in localstorage like login token does because of security reasons so we need to regenerate the same key everytime is refreshed */}
      {showUnlockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md">
            <h2 className="text-xl font-bold mb-4 text-center">🔐 Unlock Your Vault</h2>
            <p className="text-sm text-gray-600 mb-3 text-center">
              Enter your login password to decrypt your data.
            </p>
            <input
              type="password"
              placeholder="Login Password"
              className="w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none"
              value={tempPassword}
              onChange={(e) => setTempPassword(e.target.value)}
            />
            <button
              className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded"
              onClick={() => {
                deriveKey(tempPassword, user.email);
                setShowUnlockModal(false);
              }}
            >
              Unlock Vault
            </button>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-green-50 px-4 py-6">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
          <div className="w-full bg-white rounded-lg shadow p-6">
            <div className="text-center mb-4">
              <p className="text-3xl font-bold">
                <span className="text-green-600">&lt;</span>
                Pass
                <span className="text-green-600">OP/&gt;</span>
              </p>
              <p className="text-sm text-gray-600">Your Own Password Manager</p>
            </div>

            <form onSubmit={savepassword} className="space-y-4">
              <input
                required
                name="site"
                onChange={handlechange}
                value={form.site}
                placeholder="Enter website URL"
                className="w-full border-2 border-green-300 rounded-xl px-3 h-10"
              />
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  required
                  name="username"
                  onChange={handlechange}
                  value={form.username}
                  placeholder="Enter Username"
                  className="flex-1 border-2 border-green-300 rounded-xl px-3 h-10"
                />
                <div className="relative flex-1">
                  <input
                    required
                    name="password"
                    onChange={handlechange}
                    value={form.password}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Password"
                    className="w-full border-2 border-green-300 rounded-xl px-3 h-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={handleeye}
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm gap-2"
                >
                  <lord-icon
                    src="https://cdn.lordicon.com/lzsupfwm.json"
                    trigger="hover"
                    style={{ width: "20px", height: "20px" }}
                  ></lord-icon>
                  Save
                </button>
              </div>
            </form>
          </div>

          <div className="w-full">
            <h2 className="text-xl font-bold mb-2 text-center sm:text-left">Your Passwords</h2>
            {passwordarray.length > 0 ? (
              <div className="overflow-x-auto overflow-y-auto bg-white rounded-lg shadow max-h-64">
                <table className="w-full min-w-[600px] text-sm table-auto">
                  <thead className="bg-green-600 text-white sticky top-0">
                    <tr>
                      <th className="text-left px-4 py-2">Site</th>
                      <th className="text-left px-4 py-2">Username</th>
                      <th className="text-left px-4 py-2">Password</th>
                      <th className="text-left px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {passwordarray.map((item, index) => (
                      <tr key={index} className="even:bg-green-100 hover:bg-green-200">
                        <td className="px-4 py-2 break-all">
                          {item.site}
                          <button onClick={() => handleCopy(item.site)} className="ml-2 text-gray-500">
                            <FaCopy />
                          </button>
                        </td>
                        <td className="px-4 py-2 break-all">
                          {item.username}
                          <button onClick={() => handleCopy(item.username)} className="ml-2 text-gray-500">
                            <FaCopy />
                          </button>
                        </td>
                        <td className="px-4 py-2 break-all">
                          {item.password}
                          <button onClick={() => handleCopy(item.password)} className="ml-2 text-gray-500">
                            <FaCopy />
                          </button>
                        </td>
                        <td className="px-4 py-2 flex gap-2">
                          <button onClick={() => handleEdit(item)}>
                            <lord-icon
                              src="https://cdn.lordicon.com/vwzukuhn.json"
                              trigger="click"
                              style={{ width: "24px", height: "24px" }}
                            ></lord-icon>
                          </button>
                          <button onClick={() => handleDelete(item)}>
                            <lord-icon
                              src="https://cdn.lordicon.com/sxhqklqh.json"
                              trigger="click"
                              style={{ width: "24px", height: "24px" }}
                            ></lord-icon>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-lg mt-10 font-semibold">
                No passwords yet. Add your passwords.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Manager;
