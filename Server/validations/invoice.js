const Joi = require('joi');


const dateFormatRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[012])-\d{4}$/;

const extraChargesSchema = Joi.object({
  itemName: Joi.string().required(),
  percentage: Joi.number().min(0),
  amount: Joi.number().min(0),
});

// Schema for validating the creation of a new invoice
const invoiceSchema = Joi.object({
  type: Joi.string().valid('party invoice', 'cash memo').required(),
  customer: Joi.string().required(),
  copyFrom: Joi.string().optional().allow(null, ''),
  partyDetails: Joi.object({
    contactPerson: Joi.string().optional().allow(null, ''),
    billingAddress: Joi.string().optional().allow(null, ''),
    salesCredit: Joi.number().optional().allow(null),
    shippingAddress: Joi.string().optional().allow(null, ''),
    shippingDetails: Joi.string().optional().allow(null, '')
  }).optional().allow(null),
  documentDetails: Joi.object({
    invoiceNo: Joi.string().optional().allow(null, ''),
    reference: Joi.string().optional().allow(null, ''),
    invoiceDate: Joi.string().regex(dateFormatRegex).required()
    .messages({
        'string.pattern.base': 'Date must be in the format dd-mm-yyyy'
    }),
    dueDate: Joi.string().regex(dateFormatRegex).required()
    .messages({
        'string.pattern.base': 'Date must be in the format dd-mm-yyyy'
    }),
  }).required(),
  itemList: Joi.array().items(
    Joi.object({
      no: Joi.number().integer().optional().allow(null),
      itemDescription: Joi.string().optional().allow(null, ''),
      qty: Joi.number().required(),
      unit: Joi.string().optional().allow(null, ''),
      rate: Joi.number().required(),
      discount: Joi.number().optional().allow(null, 0),
      taxable: Joi.number().optional().allow(null, 0),
      CGST: Joi.number().optional().allow(null, 0),
      SGST: Joi.number().optional().allow(null, 0),
      amount: Joi.number().required(), // Added amount field
      hsn: Joi.string().optional().allow(null, ''),
    })
  ).required(),
  status: Joi.string().valid('Paid', 'Partially Paid', 'Overdue', 'Unpaid').optional(),
  finalTotal: Joi.string().optional().allow(null),
  amount: Joi.string().optional().allow(null),
  roundoff: Joi.string().optional().allow(null),
  extracharges: Joi.array().items(extraChargesSchema).optional(),
  discount: Joi.object({
    itemName: Joi.string().optional().allow(null,''),
    percentage: Joi.number().min(0).optional().allow(null),
    amount: Joi.number().min(0).optional().allow(null),
  }).optional().allow(null),
  paidAmount: Joi.string().optional().allow(null),
  balanceAmount: Joi.string().optional().allow(null),
  bankDetails: Joi.string().optional(),
  // GSTIN: Joi.string().optional(),
  project: Joi.string().required(),
  note: Joi.string().optional().allow(null),
  address: Joi.object({
    address1: Joi.string().optional().allow(null, ''),
    address2: Joi.string().optional().allow(null,''),
    city: Joi.string().optional().allow(null,''),
    state: Joi.string().optional().allow(null,''),
    country: Joi.string().optional().allow(null,''),
    pincode: Joi.string().optional().allow(null,''),
    type: Joi.string().valid('Home', 'Office', 'Others').optional(), 
  }).optional().allow(null),
  finalTotal: Joi.number().optional().allow(null),
});

// Schema for validating updates to an existing invoice
const updateInvoiceSchema = Joi.object({
  type: Joi.string().valid('party invoice', 'cash memo').optional(),
  customer: Joi.string().optional(),
  copyFrom: Joi.string().optional().allow(null, ''),
  partyDetails: Joi.object({
    contactPerson: Joi.string().optional().allow(null, ''),
    billingAddress: Joi.string().optional().allow(null, ''),
    salesCredit: Joi.number().optional().allow(null),
    shippingAddress: Joi.string().optional().allow(null, ''),
    shippingDetails: Joi.string().optional().allow(null, '')
  }).optional().allow(null),
  documentDetails: Joi.object({
    invoiceNo: Joi.string().optional().allow(null, ''),
    reference: Joi.string().optional().allow(null, ''),
    invoiceDate: Joi.string().regex(dateFormatRegex).required()
    .messages({
        'string.pattern.base': 'Date must be in the format dd-mm-yyyy'
    }),
    dueDate: Joi.string().regex(dateFormatRegex).required()
    .messages({
        'string.pattern.base': 'Date must be in the format dd-mm-yyyy'
    }),
  }).optional(),
  itemList: Joi.array().items(
    Joi.object({
      no: Joi.number().integer().optional().allow(null),
      itemDescription: Joi.string().optional().allow(null, ''),
      qty: Joi.number().optional(),
      unit: Joi.string().optional().allow(null, ''),
      rate: Joi.number().optional(),
      discount: Joi.number().optional().allow(null, 0),
      taxable: Joi.number().optional().allow(null, 0),
      CGST: Joi.number().optional().allow(null, 0),
      SGST: Joi.number().optional().allow(null, 0),
      amount: Joi.number().optional(), // Added amount field
      hsn: Joi.string().optional().allow(null, ''),
    })
  ).optional(),
  status: Joi.string().valid('Paid', 'Partially Paid', 'Overdue', 'Unpaid').optional(),
  finalTotal: Joi.string().optional().allow(null),
  amount: Joi.string().optional().allow(null),
  roundoff: Joi.string().optional().allow(null),
  extracharges: Joi.array().items(extraChargesSchema).optional(),
  discount: Joi.object({
    itemName: Joi.string().optional().allow(null,''),
    percentage: Joi.number().min(0).optional().allow(null),
    amount: Joi.number().min(0).optional().allow(null),
  }).optional().allow(null),
  paidAmount: Joi.string().optional().allow(null),
  balanceAmount: Joi.string().optional().allow(null),
  // GSTIN: Joi.string().optional(),
  bankDetails: Joi.string().optional(),
  project: Joi.string().optional().trim().min(1).messages({
    'string.min': 'Project cannot be an empty string or whitespace',
    'string.base': 'Project must be a string'
  }),
  note: Joi.string().optional().allow(null),
  address: Joi.object({
    address1: Joi.string().optional().allow(null, ''),
    address2: Joi.string().optional().allow(null,''),
    city: Joi.string().optional().allow(null,''),
    state: Joi.string().optional().allow(null,''),
    country: Joi.string().optional().allow(null,''),
    pincode: Joi.string().optional().allow(null,''),
    type: Joi.string().valid('Home', 'Office', 'Others').optional(),
  }).optional().allow(null),
  finalTotal: Joi.number().optional().allow(null),
}).min(1);

module.exports = {
  invoiceSchema,
  updateInvoiceSchema
};
