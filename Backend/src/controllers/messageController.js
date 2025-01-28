import User from "../models/user.js";
import Message from "../models/message.js"
import cloudinary from "../lib/cloudinary.js";
export const getUsersforSidebars=async (req,res)=>{
    try {
        const loggedInUserId=req.user._id;
        const filterUsers=await User.find({_id:{$ne:loggedInUserId}}).select("-password");

        res.status(200).json(filterUsers);
    } catch ( error ) {
        console.log("Error in getUsersforSidebars",error.message);
    res.status(500).json({message:"Internal Server Error"})
    }
}

export const getMessage=async (req,res)=>{
    try {
        const {id:usertToChatId}=req.params;
        const myId=req.user._id;
        const message=await Message.find({
            $or:[
                {senderId:myId ,receiverId:usertToChatId},
                {senderId:usertToChatId,receiverId:myId }
            ]

            
        })
        res.status(200).json(message)
    } catch (error) {
        console.log("Error in getMessage",error.message);
    res.status(500).json({message:"Internal Server Error"})
    }
}


export const sendMessage=async (req,res)=>{
    try {
        const {text,image}=req.body;
        const {id:receiverId}=req.params;
        const senderId=req.user._id;
        let imageUrl;
        if(image){
            const uploadResponse=await cloudinary.uploader.upload(image);
            imageUrl=uploadResponse.secure_url;
        }
   const newMessage=new Message({
    senderId,
    receiverId,
    text,
    image:imageUrl
   })
   await newMessage.save();
   //todo:realtime functionality goes here=>socket.io
   res.status(201).json(newMessage)

    } catch (error) {
        console.log("Error in sendMessage",error.message);
        res.status(500).json({message:"Internal Server Error"})
    }
}