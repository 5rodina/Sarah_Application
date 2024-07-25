import Joi from 'joi';

const messageValidationSchema = Joi.object({
    content: Joi.string().required(),
   receiverId: Joi.string().required(),
});

export default messageValidationSchema;