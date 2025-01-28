import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.js"
import bcrypt from "bcryptjs"
export const signup = async (req, res) => {
    const { fullName, password, email } = req.body;

    try {
        if(!fullName||!email||!password)
{
    return res.status(400).json({message:"All fields are require"})
}        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be At least 6 Characters" })
        }
      

        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "Email Already Exist" })
        
            
            //next two line for bcryption of password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)
      
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })
    
        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();
            res.status(201).json(
                {
                    _id: newUser._id,
                    fullName: newUser.fullName,
                    email: newUser.email,
                    profilePic: newUser.profilePic
                }
            )
        } else {
            res.status(400).json({ message: "Invalid user data" })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal server error" })
    }
}
export const login = async (req, res) => {
                   const {password,email}=req.body;
                   try {
                    const user =await User.findOne({email});
                    if(!user){
                        return res.status(400).json({message:"Invalid Credentials"});

                    }
                    const isPasswordCorrect=await bcrypt.compare(password,user.password);
                    if(!isPasswordCorrect){
                        return res.status(400).json({message:"Invalid Credentials"})
                    }
                    generateToken(user._id,res);
                    res.status(200).json({
                        _id:user._id,
                        fullName:user.fullName,
                        email: user.email,
                    profilePic: user.profilePic
                    })
                   } catch (error) {
                    console.log("error in login controller",error.message);
                  res.status(500).json({message:"Internal server error"})
                }
}
export const logout = async (req, res) => {
  try {
      res.cookie("jwt","",{maxAge:0});
      res.status(200).json({message:"Logged Out Successfully"})
  } catch (error) {
    console.log("error in logout controller",error.message);
    res.status(500).json({message:"Internal server error"})
  }
}
export const updateProfile = async (req, res) => {
      try {
        const {profilePic}=req.body;
        const userId=req.user._id;

        if(!profilePic){
            return res.status(400).json({message:"Profile pic is required"})
        }

        const uploadResponse=await cloudinary.uploader.upload(profilePic);
        const updateUser=await User.findByIdAndUpdate(
            userId,
            {profilePic:uploadResponse.secure_url},
            {new:true}
        )
        res.status(200).json(updateUser)
      } catch (error) {
        console.log("error in your update profile",error.message);
    res.status(500).json({message:"Internal server error"})
      }
  }
  
export const checkAuth=(req,res)=>{
    try {
        res.status(200).json(req.user);

    } catch (error) {
         console.log("error in checkAuth Controller",error.message);
    res.status(500).json({message:"Internal server error"})
    }
}