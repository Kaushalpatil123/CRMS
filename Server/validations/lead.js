const Joi = require('joi');

const dateFormatRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[012])-\d{4}$/;

const contactSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().pattern(/^[0-9]{10}$/).required()
}).unknown();;

const interactionSchema = Joi.object({
    executiveName: Joi.string(),
    // date: Joi.string().regex(dateFormatRegex).required()
    // .messages({
    //     'string.pattern.base': 'Date must be in the format dd-mm-yyyy'
    // }),
    time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
    description: Joi.string().required()
}).unknown();;
const lastinterection = Joi.object({
  executiveName: Joi.string(),
//   date: Joi.string().regex(dateFormatRegex)
//   .messages({
//       'string.pattern.base': 'Date must be in the format dd-mm-yyyy'
//   }),
  time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
  description: Joi.string()
}).unknown();;

const leadSchema = Joi.object({
    companyName: Joi.string().required(),
    contacts: Joi.array().items(contactSchema).min(1).required(),
    country: Joi.string().required(),
    state: Joi.string().required(),
    city: Joi.string().required(),
    executive: Joi.string(),
    source: Joi.string().required(),
    designation: Joi.string().allow('', null),
    product: Joi.string().allow('', null),
    requirements: Joi.string().allow('', null),
    notes: Joi.string().allow('', null),
    status: Joi.string(),
    agentstatus: Joi.string().valid('Available', 'Unavailable / Not Answering', 'Busy', 'Switched Off', 'Not Reachable'),
    lastInteractions: Joi.array().items(lastinterection).default([]),
    nextInteraction: Joi.object({
        executiveName: Joi.string(),
        date: Joi.string().required()
        .messages({
            'string.pattern.base': 'Date must be in the format dd-mm-yyyy'
        }),
        time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
        description: Joi.string().allow('', null)
    }).allow(null)
});

const updateLeadSchema = Joi.object({
    companyName: Joi.string(),
    country: Joi.string().allow('', null),
    state: Joi.string().allow('', null),
    city: Joi.string().allow('', null),
    executive: Joi.string().allow('', null),
    source: Joi.string().allow('', null),
    designation: Joi.string().allow('', null),
    product: Joi.string().allow('', null),
    requirements: Joi.string().allow('', null),
    notes: Joi.string().allow('', null),
    status: Joi.string().allow('', null),
    agentstatus: Joi.string().valid('Available', 'Unavailable / Not Answering', 'Busy', 'Switched Off', 'Not Reachable'),
    lastInteractions: Joi.array().items(interactionSchema),
    nextInteraction: Joi.object({
        executiveName: Joi.string(),
        date: Joi.string().required()
        .messages({
            'string.pattern.base': 'Date must be in the format dd-mm-yyyy'
        }),
        time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
        description: Joi.string().allow('', null)
    }).allow(null),
    isactive: Joi.boolean(),
    reason: Joi.string().allow('', null),
    deleteContact: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
    addContact: contactSchema,
    updateContact: Joi.object({
        id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
        contact: contactSchema
    })
});
const lastInteractionSchema = Joi.object({
    executiveName: Joi.string(),
    date: Joi.string().regex(dateFormatRegex).required()
      .messages({
        'string.pattern.base': 'Date must be in the format dd-mm-yyyy'
      }),
    time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
    description: Joi.string().required()
  });

  const importcontactSchema = Joi.object({
    firstName: Joi.string().allow('', null),
    lastName: Joi.string().allow('', null),
    email: Joi.string().email().allow('', null),
    phoneNumber: Joi.number()
}).unknown();

const importinteractionSchema = Joi.object({
    executiveName: Joi.string().allow('', null),
    date: Joi.string().allow('', null),
    time: Joi.string().allow('', null),
    description: Joi.string().allow('', null)
}).unknown();

  const importLeadsSchema = Joi.object({
    companyName: Joi.string().required(),
    contacts: Joi.array().items(importcontactSchema).min(1).required(),
    country: Joi.string().allow('', null),
    state: Joi.string().allow('', null),
    city: Joi.string().allow('', null),
    executive: Joi.string().allow('', null),
    source: Joi.string().allow('', null),
    designation: Joi.string().allow('', null),
    product: Joi.string().allow('', null),
    requirements: Joi.string().allow('', null),
    notes: Joi.string().allow('', null),
    lastInteractions: Joi.array().items(importinteractionSchema).optional(),
    nextInteraction: importinteractionSchema.optional()
});
module.exports = {
    leadSchema,
    updateLeadSchema,
    lastInteractionSchema,
    importLeadsSchema
};