const Joi = require("joi");

const dateFormatRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[012])-\d{4}$/;

// Item List Validation Schema
const itemSchema = Joi.object({
  itemDescription: Joi.string().required(),
  hsnSac: Joi.string().required(),
  quantity: Joi.number().positive().required(),
  unit: Joi.string().required(),
  rate: Joi.number().positive().required(),
  discount: Joi.number().min(0).default(0),
  taxable: Joi.number().min(0).default(0),
  cgst: Joi.number().min(0).default(0),
  sgst: Joi.number().min(0).default(0),
  amount: Joi.number().positive().required(),
});

const extraChargesSchema = Joi.object({
  itemName: Joi.string().required(),
  percentage: Joi.number().min(0),
  amount: Joi.number().min(0),
});

// Sale Order Validation Schema
const orderValidationSchema = Joi.object({
  // Basic Information
  customer: Joi.string().required(),
  copyFrom: Joi.string().optional().allow(null, ""),

  // Party Details
  partyDetails: Joi.object({
    contactPerson: Joi.string().required(),
    salesCredit: Joi.string().valid("Yes", "No").default("No"),
    shippingAddress: Joi.string().default("Same as Billing Address"),
    executive: Joi.string().required(),
  }).required(),

  // Document Details
  documentDetails: Joi.object({
    orderNumber: Joi.string().optional(),
    reference: Joi.string().optional(),
    orderDate: Joi.string().regex(dateFormatRegex).optional()
      .messages({
        'string.pattern.base': 'orderDate must be in the format dd-mm-yyyy'
      }),
    dueDate: Joi.string().regex(dateFormatRegex).optional()
      .messages({
        'string.pattern.base': 'dueDate must be in the format dd-mm-yyyy'
      }),
    customerPoNumber: Joi.string().required(),
  }).required(),

  // Item List
  itemList: Joi.array().items(itemSchema).min(1).required(),

  address: Joi.object({
    address1: Joi.string().optional().allow(null, ''),
    address2: Joi.string().optional().allow(null,''),
    city: Joi.string().optional().allow(null,''),
    state: Joi.string().optional().allow(null,''),
    country: Joi.string().optional().allow(null,''),
    pincode: Joi.string().optional().allow(null,''),
    type: Joi.string().valid('Home', 'Office', 'Others').optional(), 
  }).optional().allow(null),

  // Terms & Conditions
  termsConditions: Joi.array()
    .items(Joi.string())
    .default(["No Terms & Conditions"]),

  // Bank Details
  bankDetails: Joi.string().required(),

  // Additional Fields
  notes: Joi.string().optional(),

  // Total & Charges
  total: Joi.number().positive().required(),
  grandTotal: Joi.number().positive().required(),
  addExtraCharges: Joi.array().items(extraChargesSchema).optional(),
  addDiscount: Joi.object({
    itemName: Joi.string().optional().allow(null,''),
    percentage: Joi.number().min(0).optional().allow(null),
    amount: Joi.number().min(0).optional().allow(null),
  }).optional().allow(null),
  status: Joi.string().valid('Received', 'WIP', 'Query', 'Packed', 'Cancelled', 'Done').optional().default('Recieved'),
  nextActions: Joi.object({
    email: Joi.boolean().optional(),
    whatsapp: Joi.boolean().optional(),
    print: Joi.boolean().optional(),
  }).optional(),
});

// Update Item List Validation Schema
const updateItemSchema = Joi.object({
  itemDescription: Joi.string().optional().allow(null, ""),
  hsnSac: Joi.string().optional().allow(null, ""),
  quantity: Joi.number().optional().default(1),
  unit: Joi.string().optional().allow(null, ""),
  rate: Joi.number().optional(),
  discount: Joi.number().optional().default(0),
  taxable: Joi.number().optional(),
  cgst: Joi.number().optional(),
  sgst: Joi.number().optional(),
  amount: Joi.number().optional(),
});

// Update Sale Order Validation Schema
const updateOrderValidationSchema = Joi.object({
  customer: Joi.string().optional(),
  copyFrom: Joi.string().optional().allow(null, ""),

  // Party Details
  partyDetails: Joi.object({
    contactPerson: Joi.string().optional().allow(null, ""),
    salesCredit: Joi.string().valid("Yes", "No").optional(),
    shippingAddress: Joi.string().optional().allow(null, ""),
    executive: Joi.string().optional().allow(null, ""),
  }).optional(),

  // Document Details
  documentDetails: Joi.object({
    orderNumber: Joi.string().optional(),
    reference: Joi.string().optional(),
    orderDate: Joi.string().regex(dateFormatRegex).optional()
      .messages({
        'string.pattern.base': 'orderDate must be in the format dd-mm-yyyy'
      }),
    dueDate: Joi.string().regex(dateFormatRegex).optional()
      .messages({
        'string.pattern.base': 'dueDate must be in the format dd-mm-yyyy'
      }),
    customerPoNumber: Joi.string().optional(),
  }).optional(),

  // Item List
  itemList: Joi.array().items(updateItemSchema).optional(),

  address: Joi.object({
    address1: Joi.string().optional().allow(null, ''),
    address2: Joi.string().optional().allow(null,''),
    city: Joi.string().optional().allow(null,''),
    state: Joi.string().optional().allow(null,''),
    country: Joi.string().optional().allow(null,''),
    pincode: Joi.string().optional().allow(null,''),
    type: Joi.string().valid('Home', 'Office', 'Others').optional(), 
  }).optional().allow(null),

  // Terms & Conditions
  termsConditions: Joi.array().items(Joi.string()).optional(),

  // Bank Details
  bankDetails: Joi.string().optional(),

  // Additional Fields
  notes: Joi.string().optional().allow(null, ""),

  // Total & Charges
  total: Joi.number().optional(),
  grandTotal: Joi.number().optional(),
  addExtraCharges: Joi.array().items(extraChargesSchema).optional(),
  addDiscount: Joi.object({
    itemName: Joi.string().optional().allow(null,''),
    percentage: Joi.number().min(0).optional().allow(null),
    amount: Joi.number().min(0).optional().allow(null),
  }).optional().allow(null),
  status: Joi.string().valid('Received', 'WIP', 'Query', 'Packed', 'Cancelled', 'Done').optional().default('Recieved'),
  nextActions: Joi.object({
    email: Joi.boolean().optional(),
    whatsapp: Joi.boolean().optional(),
    print: Joi.boolean().optional(),
  }).optional(),
}).min(1); // Ensure at least one field is being updated

// Exporting the validation schemas
module.exports = {
  orderValidationSchema,
  updateOrderValidationSchema,
};
