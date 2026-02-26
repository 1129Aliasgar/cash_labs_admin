import Joi from 'joi';

const passwordRule = Joi.string()
  .min(8)
  .max(128)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#^()\-+])[A-Za-z\d@$!%*?&_#^()\-+]+$/)
  .required()
  .messages({
    'string.pattern.base':
      'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.',
    'string.min': 'Password must be at least 8 characters.',
    'string.max': 'Password must not exceed 128 characters.',
  });

export const signupSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required().messages({
    'string.email': 'Please provide a valid email address.',
  }),
  password: passwordRule,
  fullName: Joi.string().min(2).max(100).trim().required().messages({
    'string.min': 'Full name must be at least 2 characters.',
  }),
  companyName: Joi.string().min(2).max(150).trim().required().messages({
    'string.min': 'Company name must be at least 2 characters.',
  }),
  telegramId: Joi.string().trim().optional().allow(''),
  agreeToTerms: Joi.boolean().valid(true).required().messages({
    'any.only': 'You must agree to the Terms of Service and Privacy Policy.',
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().required().messages({
    'any.required': 'Password is required.',
  }),
});

export const verifyEmailSchema = Joi.object({
  token: Joi.string().hex().length(64).required().messages({
    'string.hex': 'Invalid verification token format.',
    'string.length': 'Invalid verification token length.',
  }),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().hex().length(64).required(),
  newPassword: passwordRule,
});
