import { Router } from "express";
import { verifyToken } from "../../middleware/verifytoken.js";
import { validate } from "../../middleware/validate.js";
import messageValidationSchema from "./message.validate.js";
import { addMessage, deleteMessage, getMessages } from "./message.controller.js";

const messageRouter=Router()

messageRouter.use(verifyToken)

messageRouter.post('/',validate(messageValidationSchema),addMessage)
messageRouter.route('/:id').get(getMessages).delete(deleteMessage)

export default messageRouter