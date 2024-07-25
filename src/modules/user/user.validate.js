import Joi from 'joi';


const userValidationSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  confirmEmail: Joi.boolean(),
  otpCode: Joi.string().optional()
});

export default userValidationSchema;