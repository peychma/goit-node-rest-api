const Joi = require("joi");


const createContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean()
});

const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
  favorite: Joi.boolean()
}).min(1);

const updateFavoriteSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
  favorite: Joi.boolean().required(),
});
const registSchema = Joi.object({
    password: Joi.string().min(6).required(),
    email: Joi.string().required(),
    subscription: Joi.string(),
    token: Joi.string(),
});

const loginSchema = Joi.object({
    password: Joi.string().min(6).required(),
    email: Joi.string().required(),
});



module.exports = {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
  registSchema,
  loginSchema
};
