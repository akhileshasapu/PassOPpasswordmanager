import { createContext, useContext, useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode"; // ✅ correct

const AuthContext = createContext()

export const AuthProvider= ({children})=>{
const [token, settoken] = useState(localStorage.getItem("token")||null)
const [user, setuser] = useState(null)
useEffect(() => {
    if(token){
         const decoded=jwtDecode(token)
 setuser(decoded)
    }
    else{
        setuser(null)
    }

}, [token])


const login =(newtoken)=>{
    localStorage.setItem("token",newtoken)
    settoken(newtoken)
}
const logout =()=>{
    localStorage.removeItem("token")
settoken(null)
}
return (
    <AuthContext.Provider value={{token,user,login,logout}}>
        {children}
    </AuthContext.Provider>
)


}
export const useAuth = ()=> useContext(AuthContext)