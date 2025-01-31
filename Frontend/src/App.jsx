import Home from "./pages/Home"
import SignUp from "./pages/SignUp"
import LogIn from "./pages/LogIn"
import Profile from "./pages/Profile"
import Settings from "./pages/Settings"
import { Navigate, Route,Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import { useAuth } from "./store/useAuth"
import { useEffect } from "react"
import {Loader} from "lucide-react"
import { Toaster } from "react-hot-toast";
import { useTheme } from "./store/useTheme"
function App() {

const {authUser,checkAuth,isCheckingAuth}=useAuth();
const {theme}=useTheme();
useEffect(()=>{
    checkAuth()
},[checkAuth]);


if(isCheckingAuth&&!authUser)return(
  <div className="flex items-center justify-center h-screen">
         <Loader className="size-10 animate-spin"/> 
  </div>
)
  return (
   <div data-theme={theme}>
    <Navbar/>
    <Routes>
      <Route path="/" element={authUser?<Home/>:<Navigate to="/login"/>} />
      <Route path="/signup" element={!authUser?<SignUp/>:<Navigate to="/"/>}/>
      <Route path="/login" element={!authUser?<LogIn/>:<Navigate to="/"/>}/>
      <Route path="/settings" element={<Settings/>}/>
      <Route path="/profile" element={authUser?<Profile/>:<Navigate to="/"/>}/>
    </Routes>
    <Toaster />
   </div>
  )
}

export default App
