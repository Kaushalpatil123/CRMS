// validations/category.js
const Joi = require('joi');

const subcategorySchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow('', null)
});

const categorySchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow('', null),
    subcategories: Joi.array().items(subcategorySchema).default([])
});

module.exports = { categorySchema, subcategorySchema };