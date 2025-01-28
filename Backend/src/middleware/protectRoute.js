import jwt from "jsonwebtoken";
import User from   "../models/user.js";


export const protectRoute=async(req,res,next)=>{
    try {

        //1st import parseCookie in index.js then wrote the next line
        const token=req.cookies.jwt;
        if(!token){
            return res.status(401).json({message:"Unothorizes-No token Provided"});

        }

        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({message:"Unothorizes-Invalid Token"});

        }

        const user =await User.findById(decoded.userId).select("-password");
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
req.user=user

next();
    } catch (error) {
        console.log("Error in protectRoutes middlewares",error.message);
        return res.status(500).json({message:"Internal Server Error"});
    
    }
}