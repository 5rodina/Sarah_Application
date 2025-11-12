import jwt from 'jsonwebtoken'
import User from "../../../database/models/user.model.js"
import bcrypt from 'bcrypt'
import { catchError } from '../../middleware/catchError.js'
import { appError } from '../../utils/appError.js'
import { sendEmails } from '../../email/email.js'
import tokenBlacklist from '../../utils/tokenBlacklist.js'


export const signup=catchError( async (req,res,next)=>{
    const { username, email, password } = req.body
    const user=await User.findOne({email})
    if(user) return next(new appError('User already exists' ,409)) 
    const hashedPassword=await bcrypt.hash(password,5)
    const result= await User.create({username,email,password:hashedPassword })
    if(result) return res.status(201).json({ message:"User registered successfully" , result})
    else return next(new appError('Failed to register' ,400))
})

export const signin= catchError(async(req,res,next)=>{
    const {email , password}=req.body
    const user = await User.findOne({email})
    if (!user)  return next(new appError('Invalid credentials' ,401))
    const isMatch = await bcrypt.compare(password, user.password); 
    if(isMatch){
        jwt.sign({id:user._id,name:user.username},
        'koko',(err,token)=>{
            if (err) return next(new appError('Token generation failed', 500)); 
            res.status(200).json({ message: 'Signed in successfully', token});
        }
    )
   }else{
        return next(new appError('Invalid credentials' ,401))
    }
})
export const changePassword = catchError(async (req, res, next) => {
        const { id: userId } = req.decodedToken 
        const { currentPassword, newPassword, confirmPassword } = req.body;
        if (!currentPassword || !newPassword || !confirmPassword)  
             return next(new appError('All fields are required' ,400))
        if (newPassword !== confirmPassword)  
             return next(new appError('New password and confirm password does not match' ,400))
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return next(new appError('Current password is incorrect' ,401))
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({ message: 'Password changed successfully' });
})

export const forgetPassword = catchError(async (req, res, next)=>{
    const { email} = req.body
    const user = await User.findOne({ email });
    if (!user) return next(new appError('Email not found', 404)); // 
    let otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    sendEmails(email,otpCode)
    const result = await User.findOneAndUpdate({ email }, { $set: { otpCode: otpCode } }, { new: true } );
    if(result) return res.status(200).json({ message: 'Check your mail' });
    else return next(new appError('Write your mail again' ,401))
})

export const resetPassword = catchError(async (req, res, next)=>{
    const { otpCode, newPassword, confirmPassword } = req.body;
    if ( !newPassword || !confirmPassword)  
         return next(new appError('All fields are required' ,400))
    if (newPassword !== confirmPassword)  
         return next(new appError('New password and confirm password does not match' ,400))
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const result = await User.findOneAndUpdate({ otpCode }, { $set: { password: hashedPassword } }, { new: true } );
    if(result) res.status(200).json({ message: 'Password Changed Successfully' });
    else return next(new appError('Change it again later' ,400))
})

export const editProfile = catchError(async(req, res, next)=>{
    const { id: userId } = req.decodedToken;
    const { email, username } = req.body;
    const user = await User.findById(userId);
    if (!user) return next(new appError('User not found', 404));
    let updated = false;
    if (email) {
        user.email = email;
        updated = true;
    }
    if (username) {
        user.username = username;
        updated = true;
    }
    if (!updated) return next(new appError('No changes were made', 400));
    await user.save();
    res.status(200).json({ message: 'Profile updated successfully', user });
})


export const logout = (req, res) => {
    let token = req.headers.token; // Extract token from headers

    if (!token) return res.status(400).json({ message: 'No token provided' });

    tokenBlacklist.add(token); // Add token to blacklist
    res.status(200).json({ message: 'Logged out successfully' });
};
