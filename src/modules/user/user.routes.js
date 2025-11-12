import { Router } from "express"
import {validate} from '../../middleware/validate.js'

import { changePassword, editProfile, forgetPassword, logout, resetPassword, signin, signup } from "./user.controller.js"
import {verifyToken} from '../../middleware/verifytoken.js'
import { changePasswordSchema, editProfileSchema, forgetPasswordSchema, resetPasswordSchema, signinSchema, signupSchema } from "./user.validate.js"

const userRouter=Router()

userRouter.post('/signup',validate(signupSchema),signup)
userRouter.post('/signin',validate(signinSchema),signin)
userRouter.get('/forgetPassword',validate(forgetPasswordSchema), forgetPassword)
userRouter.put('/resetPassword',validate(resetPasswordSchema), resetPassword)
userRouter.put('/editProfile', validate(editProfileSchema), verifyToken, editProfile)
userRouter.put('/changePassword', validate(changePasswordSchema), verifyToken, changePassword)
userRouter.get('/logout', verifyToken,logout)


export default userRouter