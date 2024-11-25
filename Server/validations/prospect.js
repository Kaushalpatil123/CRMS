const Joi = require('joi');

const dateRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[012])-\d{4}$/;

const interactionSchema = Joi.object({
  executiveName: Joi.string().required(),
  date: Joi.string().regex(dateRegex).required()
  .messages({
      'string.pattern.base': 'Date must be in the format dd-mm-yyyy'
  }),
  time: Joi.string(),
  description: Joi.string().required()
});

const prospectSchema = Joi.object({
  company: Joi.string().required(),
  title: Joi.string().valid('Mr.', 'Mrs.', 'Ms.').required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  mobile: Joi.number().required(),
  email: Joi.string().email().required(),
  website: Joi.string().uri().allow('', null),
  industrySegment: Joi.string().allow('', null),
  country: Joi.string().required(),
  state: Joi.string().required(),
  city: Joi.string().allow('', null),
  address1: Joi.string().allow('', null),
  address2: Joi.string().allow('', null),
  category: Joi.string().valid('Customer', 'Prospect', 'Supplier').default('Prospect'),
  product: Joi.string(),
  executive: Joi.string(),
  requirement: Joi.string(),
  businessProspectAnnual: Joi.number().positive().allow(null),
  orderTarget: Joi.number().positive().allow(null),
  receivables: Joi.number().allow(null),
  receivablesnotes: Joi.string().allow('', null),
  msmenumber: Joi.string().allow('', null),
  pannumber: Joi.string().allow('', null),
  lastInteractions: Joi.array().items(interactionSchema),
  nextInteraction: interactionSchema,
  status: Joi.string(),
  prospectStage: Joi.string(),
  new: Joi.boolean().default(true),
  samplegiven: Joi.boolean().default(false),
  discussion: Joi.string().allow('', null),
  closedate: Joi.string().regex(dateRegex).allow('', null)
    .messages({
      'string.pattern.base': 'Close date must be in the format dd-mm-yyyy'
    })
});

const updateProspectSchema = Joi.object({
  company: Joi.string(),
  title: Joi.string().valid('Mr.', 'Mrs.', 'Ms.'),
  firstName: Joi.string(),
  lastName: Joi.string(),
  mobile: Joi.string().pattern(/^[0-9]{10}$/).required(),
  email: Joi.string().email(),
  website: Joi.string().uri().allow('', null),
  industrySegment: Joi.string().allow('', null),
  country: Joi.string(),
  state: Joi.string(),
  city: Joi.string().allow('', null),
  address1: Joi.string().allow('', null),
  address2: Joi.string().allow('', null),
  category: Joi.string().valid('Customer', 'Prospect', 'Supplier'),
  product: Joi.string(),
  executive: Joi.string(),
  requirement: Joi.string(),
  businessProspectAnnual: Joi.number().positive().allow(null),
  orderTarget: Joi.number().positive().allow(null),
  receivables: Joi.number().allow(null),
  receivablesnotes: Joi.string().allow('', null),
  msmenumber: Joi.string().allow('', null),
  pannumber: Joi.string().allow('', null),
  lastInteractions: Joi.array().items(interactionSchema),
  nextInteraction: interactionSchema,
  status: Joi.string(),
  prospectStage: Joi.string(),
  new: Joi.boolean().default(true),
  samplegiven: Joi.boolean().default(false),
  discussion: Joi.string().allow('', null),
  closedate: Joi.string().regex(dateRegex).allow('', null)
    .messages({
      'string.pattern.base': 'Close date must be in the format dd-mm-yyyy'
    })
}).min(1);

const updateProspectCategorySchema = Joi.object({
  prospectStage: Joi.string().valid('New', 'Discussion', 'Samples Given', 'Estimate Shared', 'Done').required()
});

const importProspectSchema = Joi.object({
  company: Joi.string().required(),
  title: Joi.string().valid('Mr.', 'Mrs.', 'Ms.').required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  mobile: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
    'string.pattern.base': 'Mobile number must be 10 digits'
  }),
  email: Joi.string().email().required(),
  website: Joi.string().uri().allow('', null),
  industrySegment: Joi.string().allow('', null),
  country: Joi.string(),
  state: Joi.string(),
  city: Joi.string().allow('', null),
  address1: Joi.string().allow('', null),
  address2: Joi.string().allow('', null),
  category: Joi.string().valid('Customer', 'Prospect', 'Supplier'),
  product: Joi.string(),
  executive: Joi.string(),
  requirement: Joi.string(),
  businessProspectAnnual: Joi.number().positive().allow(null),
  orderTarget: Joi.number().positive().allow(null),
  receivables: Joi.number().allow(null),
  receivablesnotes: Joi.string().allow('', null),
  msmenumber: Joi.string().allow('', null),
  pannumber: Joi.string().allow('', null),
  lastInteractions: Joi.array().items(Joi.object({
    executiveName: Joi.string(),
    date: Joi.string(), 
    time: Joi.string(),
    description: Joi.string()
  })),
  nextInteraction: Joi.object({
    executiveName: Joi.string(),
    date: Joi.string(), 
    time: Joi.string(),
    description: Joi.string()
  }),
  status: Joi.string(),
  // prospectStage: Joi.string().valid('New', 'Discussion', 'Samples Given', 'Estimate Shared', 'Done'),
  new: Joi.boolean().default(true),
  samplegiven: Joi.boolean().default(false),
  discussion: Joi.string().allow('', null),
  closedate: Joi.string().regex(dateRegex).allow('', null)
    .messages({
      'string.pattern.base': 'Close date must be in the format dd-mm-yyyy'
    })
});

module.exports = {
  prospectSchema,
  updateProspectSchema,
  updateProspectCategorySchema,
  importProspectSchema
};