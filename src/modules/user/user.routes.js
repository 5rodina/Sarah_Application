import { Router } from "express"
import {validate} from '../../middleware/validate.js'
import userValidationSchema from "./user.validate.js"
import { signin, signup } from "./user.controller.js"
import {verifyToken} from '../../middleware/verifytoken.js'

const userRouter=Router()

userRouter.post('/signup',validate(userValidationSchema),signup)
userRouter.post('/signin',signin)


export default userRouter