import Joi from "joi";

export const registerSchema: any = {
  name: Joi.string().max(255).required(),
  username: Joi.string().max(255).required(),
  password: Joi.string().max(255).required(),
  email: Joi.string().email().max(255).required(),
};

export const loginSchema: any = {
  email: Joi.string().email().max(255).required(),
  password: Joi.string().max(255).required(),
};
