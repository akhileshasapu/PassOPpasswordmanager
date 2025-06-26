
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { useEncryption } from "../Context/EncryptionContext";
function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { deriveKey } = useEncryption();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });
  const {login}= useAuth()

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit =async (e) => {
    e.preventDefault();
//handle login
    if (isLogin) {
      const res= await fetch("https://passwordmanagerbackend-c4n3.onrender.com/api/auth/login",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(form)
      })
      if(!res.ok){
         const errData = await res.json();
  alert(errData.message || "Login error");
  return;
      }
      const data = await res.json()
      if(data.token){
        login(data.token)
          deriveKey(form.password, form.email); 
        alert("login successfull")
        navigate("/manager")
      }
       
     
    } else {
      // handle signup
   
      
       const res= await fetch("https://passwordmanagerbackend-c4n3.onrender.com/api/auth/signup",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(form)
        
       })
       const data = await res.json()
       alert(data.message)
       if(res.ok){
         setIsLogin(true);
       }
      
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className={`relative w-96 h-[430px] perspective`}>
        <div className={`transition-transform duration-700 w-full h-full ${isLogin ? '' : 'rotate-y-180'} [transform-style:preserve-3d]`}>
          {/* Front: Login Card */}
          <div className="absolute w-full h-full bg-white rounded-xl shadow-lg backface-hidden p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input type="email" name="email" required onChange={handleInputChange} placeholder="Email" className="border p-2 rounded" />
              <input type="password" name="password" required onChange={handleInputChange} placeholder="Password" className="border p-2 rounded" />
              <button type="submit" className="bg-blue-600 text-white py-2 rounded">Login</button>
              <p className="text-sm text-center text-gray-600">Don't have an account? <span className="text-blue-600 cursor-pointer" onClick={() => setIsLogin(false)}>Sign Up</span></p>
            </form>
          </div>

          {/* Back: Signup Card */}
          <div className="absolute w-full h-full bg-white rounded-xl shadow-lg backface-hidden rotate-y-180 p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input type="text" name="username" required onChange={handleInputChange} placeholder="Username" className="border p-2 rounded" />
              <input type="email" name="email" required onChange={handleInputChange} placeholder="Email" className="border p-2 rounded" />
              <input type="password" name="password" required onChange={handleInputChange} placeholder="Password" className="border p-2 rounded" />
              <button type="submit" className="bg-green-600 text-white py-2 rounded">Sign Up</button>
              <p className="text-sm text-center text-gray-600">Already have an account? <span className="text-green-600 cursor-pointer" onClick={() => setIsLogin(true)}>Login</span></p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
