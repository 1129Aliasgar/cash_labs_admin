import Joi from 'joi';

export const apmTransactionBodySchema = Joi.object({
  customer: Joi.object({
    firstName: Joi.string().trim().required(),
    middleName: Joi.string().trim().optional().allow(''),
    lastName: Joi.string().trim().required(),
    email: Joi.string().email().trim().required(),
    phone: Joi.string().trim().optional().allow(''),
    city: Joi.string().trim().optional().allow(''),
    address: Joi.string().trim().optional().allow(''),
    postalCode: Joi.string().trim().optional().allow(''),
    state: Joi.string().trim().optional().allow(''),
    country: Joi.string().trim().optional().allow(''),
  }).required(),
  transaction: Joi.object({
    amount: Joi.string().trim().required(),
    currency: Joi.string().trim().required(),
    returnUrl: Joi.string().uri().trim().required(),
  }).required(),
  meta: Joi.object({
    ipAddress: Joi.string().trim().optional().allow(''),
  }).optional().default({}),
});

export type ApmTransactionBody = {
  customer: {
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    phone?: string;
    city?: string;
    address?: string;
    postalCode?: string;
    state?: string;
    country?: string;
  };
  transaction: {
    amount: string;
    currency: string;
    returnUrl: string;
  };
  meta: {
    ipAddress?: string;
  };
};
