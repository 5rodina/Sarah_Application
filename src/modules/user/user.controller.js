
import jwt from 'jsonwebtoken'
import User from "../../../database/models/user.model.js"
import bcrypt from 'bcrypt'
import { catchError } from '../../middleware/catchError.js'
import { appError } from '../../utils/appError.js'
import { sendEmails } from '../../email/email.js'


export const signup=catchError( async (req,res,next)=>{
    const { username, email, password } = req.body
    const user=await User.findOne({email})
    if(user) return next(new appError('email already exists' ,401)) 
    const hashed=await bcrypt.hash(password,5)
    let otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    sendEmails(email,otpCode)
    const result= await User.create({username,email,password:hashed,otpCode:otpCode})
    res.json({message:'signed up successfully',result})
})


export const signin=catchError(async(req,res,next)=>{
    const {email , password}=req.body
    const user = await User.findOne({email})
    if(!user.confirmEmail) return next(new appError('email isnt confirmed yet' ,401))
    if (!user)  return next(new appError('Invalid email or password' ,401))
    const isPasswordCorrect = await bcrypt.compare(password, user.password); 
    if(isPasswordCorrect||user.otpCode===password){
        jwt.sign({id:user._id,name:user.username},
        'koko',(err,token)=>{
            res.status(200).json({ message: 'Signed in successfully', token});
        }
    )}else{
        return next(new appError('Invalid email or password' ,401))
    }
})