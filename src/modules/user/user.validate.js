import Joi from 'joi';

// Signup Validation Schema
export const signupSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// Signin Validation Schema
export const signinSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// Change Password Validation Schema
export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().min(6).required(),
  newPassword: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required(),
});

// Forget Password Validation Schema
export const forgetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

// Reset Password Validation Schema
export const resetPasswordSchema = Joi.object({
  otpCode: Joi.string().length(6).required(),
  newPassword: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required(),
});

// Edit Profile Validation Schema
export const editProfileSchema = Joi.object({
  email: Joi.string().email().optional(),
  username: Joi.string().min(3).max(30).optional(),
});

