const Joi = require('joi');

const dateRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[012])-\d{4}$/;

const paymentValidationSchema = Joi.object({
    customer: Joi.string().required(),
    address: Joi.string().required(),
    mobileNumber: Joi.string().required(),
    alternateNumber: Joi.string().optional(),
    receiptDate: Joi.string().regex(dateRegex).required()
    .messages({
        'string.pattern.base': 'Date must be in the format dd-mm-yyyy'
    }),
    // receiptNumber: Joi.string().required(),
    dueDate: Joi.string().regex(dateRegex).required()
    .messages({
        'string.pattern.base': 'Date must be in the format dd-mm-yyyy'
    }),
    products: Joi.string().required(),
    amountReceived: Joi.string().required(),
    amountReceivedInFavourOf: Joi.string().optional(),
    totalDueAmount: Joi.number().required(),
    amountPaid: Joi.number().optional(),
    balanceDue: Joi.number().optional(),
    description: Joi.string().optional(),
    executive: Joi.string().required(),
    paymentMode: Joi.string().valid('CASH', 'CHEQUE', 'ONLINE').required(),
    chequeDetails: Joi.string().optional().allow(null, ''),
    onlinePaymentDetails: Joi.alternatives().try(
      Joi.object({
          mode: Joi.string().optional().allow(null, ''),
          bank: Joi.string().optional().allow(null, ''),
      }),
      Joi.string().custom((value, helpers) => {
        try {
          const parsed = JSON.parse(value); 
          if (typeof parsed !== 'object' || parsed === null) {
            throw new Error();
          }
          return parsed; 
        } catch (err) {
          return helpers.message('onlinePaymentDetails must be a valid JSON object');
        }
      })
  ).optional().allow(null, ''),
});

const updatePaymentValidationSchema = Joi.object({
    customer: Joi.string().optional(),
    address: Joi.string().optional(),
    mobileNumber: Joi.string().optional(),
    alternateNumber: Joi.string().optional(),
    receiptDate: Joi.string().regex(dateRegex).optional()
    .messages({
        'string.pattern.base': 'Date must be in the format dd-mm-yyyy'
    }),
    // receiptNumber: Joi.string().optional(),
    dueDate: Joi.string().regex(dateRegex).optional()
    .messages({
        'string.pattern.base': 'Date must be in the format dd-mm-yyyy'
    }),
    products: Joi.string().optional(),
    amountReceived: Joi.string().required(),
    amountReceivedInFavourOf: Joi.string().optional(),
    totalDueAmount: Joi.number().optional(),
    amountPaid: Joi.number().optional(),
    balanceDue: Joi.number().optional(),
    description: Joi.string().optional(),
    executive: Joi.string().optional(),
    paymentMode: Joi.string().valid('CASH', 'CHEQUE', 'ONLINE').optional(),
    chequeDetails: Joi.string().optional().allow(null, ''),
    onlinePaymentDetails: Joi.alternatives().try(
      Joi.object({
          mode: Joi.string().optional().allow(null, ''),
          bank: Joi.string().optional().allow(null, ''),
      }),
      Joi.string().custom((value, helpers) => {
        try {
          if (!value) return null;
          const parsed = JSON.parse(value); 
          if (typeof parsed !== 'object' || parsed === null) {
            throw new Error();
          }
          return parsed; 
        } catch (err) {
          return helpers.message('onlinePaymentDetails must be a valid JSON object');
        }
      })
  ).optional().allow(null, ''),
});

module.exports = {
    paymentValidationSchema,
    updatePaymentValidationSchema
}