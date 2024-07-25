import mongoose from "mongoose"

const messageSchema=new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    receiverId:{
        type:String,
        required:true,
        ref:'User'
    }
})

const Message = mongoose.model('Message',messageSchema)

export default Message