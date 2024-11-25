const Joi = require('joi');

const customerSchema = Joi.object({
  companyName: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  mobile: Joi.string().pattern(/^[0-9]{10}$/).required(),
  website: Joi.string().uri().allow('', null),
  industrySegment: Joi.string().allow('', null),
  country: Joi.string().required(),
  state: Joi.string().required(),
  city: Joi.string().required(),
  receivables: Joi.number().positive().allow(null),
  receivablesNotes: Joi.string().allow('', null),
  businessProspect: Joi.number().positive().allow(null),
  orderTarget: Joi.number().positive().allow(null),
  msmeNo: Joi.string().allow('', null),
  panNo: Joi.string().allow('', null),
  GSTIN: Joi.string().allow('', null),
});

module.exports = {
  customerSchema
};
