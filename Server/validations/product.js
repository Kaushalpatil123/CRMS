const Joi = require('joi');

const productSchema = Joi.object({
    itemname: Joi.string().required(),
    description: Joi.string().allow('', null),
    // quantity: Joi.number().min(0).default(0),
    unit: Joi.string().allow('', null),
    // rate: Joi.number().min(0).default(0),
    // discount: Joi.number().min(0).max(100).default(0),
    hsn: Joi.string().allow('', null),
    gst: Joi.number().min(0).max(100).default(0),
    // taxable: Joi.number().min(0),
    // amount: Joi.number().min(0),
    // discountAmount: Joi.number().min(0)
    code: Joi.string().allow('', null),
    category: Joi.string().allow('', null),
    subcategory: Joi.string().allow('', null),
    actualprice: Joi.string().allow('', null),
    sellingprice: Joi.string().allow('', null)
});

const productUpdateSchema = Joi.object({
    itemname: Joi.string(),
    description: Joi.string().allow('', null),
    // quantity: Joi.number().min(0),
    unit: Joi.string().allow('', null),
    // rate: Joi.number().min(0),
    // discount: Joi.number().min(0).max(100),
    hsn: Joi.string().allow('', null),
    gst: Joi.number().min(0).max(100),
    // taxable: Joi.number().min(0),
    // amount: Joi.number().min(0),
    // discountAmount: Joi.number().min(0)
    code: Joi.string().allow('', null),
    category: Joi.string().allow('', null),
    subcategory: Joi.string().allow('', null),
    actualprice: Joi.string().allow('', null),
    sellingprice: Joi.string().allow('', null)
}).min(1); 

module.exports = { productSchema, productUpdateSchema };