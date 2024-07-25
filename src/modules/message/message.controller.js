import { catchError } from "../../middleware/catchError.js";
import Message from "../../../database/models/message.model.js"
import { appError } from "../../utils/appError.js";

export const addMessage=catchError(async(req,res,next)=>{
    const result = await Message.create(req.body)
    res.json({ message: "Message Sent Successfully" , result})
})

export const getMessages=catchError(async(req,res,next)=>{
    const { id: userId } = req.decodedToken 
    if(userId!==req.params.id) return next(new appError('you arent the owner'))
    const result=await Message.find({receiverId:req.params.id})
    res.json({ message: "Success" , result})
})

export const deleteMessage=catchError(async(req,res,next)=>{
    const { id: userId } = req.decodedToken 
    const result=await Message.findById(req.params.id)
    if(userId!==result.receiverId) return next(new appError('you arent the owner'))
    const resultt=await Message.findByIdAndDelete(req.params.id)
    res.json({ message: "Message Deleted Successfully" , resultt})
})