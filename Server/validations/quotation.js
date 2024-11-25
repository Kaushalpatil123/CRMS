const Joi = require('joi');
const dateRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[012])-\d{4}$/;
// Define the Joi validation schema for an individual item in the ItemList
const itemSchema = Joi.object({
    itemandDescription: Joi.string().required(),
    hsnSac: Joi.string().required(),
    quantity: Joi.number().required().default(1),
    unit: Joi.string().required(),
    rate: Joi.number().required(),
    discount: Joi.number().required().default(0),
    taxable: Joi.number().required(),
    cgst: Joi.number().required(),
    sgst: Joi.number().required(),
    amount: Joi.number().required(),
});

const addressSchema = Joi.alternatives().try(
    Joi.object({
      address1: Joi.string().optional().allow(null, ''),
      address2: Joi.string().optional().allow(null, ''),
      city: Joi.string().optional().allow(null, ''),
      state: Joi.string().optional().allow(null, ''),
      country: Joi.string().optional().allow(null, ''),
      pincode: Joi.string().optional().allow(null, ''),
      type: Joi.string().valid('Home', 'Office', 'Others').optional(),
    }),
    Joi.string().custom((value, helpers) => {
      try {
        const parsed = JSON.parse(value); 
        if (typeof parsed !== 'object' || parsed === null) {
          throw new Error();
        }
        return parsed; 
      } catch (err) {
        return helpers.message('Address must be a valid JSON object');
      }
    })
  ).optional().allow(null);

  const extraChargesSchema = Joi.object({
  itemName: Joi.string(),
  percentage: Joi.number().min(0),
  amount: Joi.number().min(0),
}).optional().allow(null);


// Define the main Joi validation schema for the Quotation
const quotationValidationSchema = Joi.object({
    customer: Joi.string().required(),
    contactPerson: Joi.string().required(),
    salesCredit: Joi.string().valid('Yes', 'No').default('No').required(),
    address: addressSchema,
    shippingAddress: Joi.string().required(),
    reference: Joi.string().required(),
    quotationDate: Joi.string().regex(dateRegex).required()
    .messages({
        'string.pattern.base': 'Date must be in the format dd-mm-yyyy'
    }),
    dueDate: Joi.string().regex(dateRegex).required()
    .messages({
        'string.pattern.base': 'Date must be in the format dd-mm-yyyy'
    }),
    ItemList: Joi.alternatives().try(
        Joi.string().custom((value, helpers) => {
            try {
                const parsed = JSON.parse(value);
                if (!Array.isArray(parsed)) {
                    throw new Error();
                }
                return parsed;
            } catch (err) {
                return helpers.message('ItemList must be a valid JSON array');
            }
        }),
        Joi.array().items(itemSchema)
    ).required(),
    status: Joi.string().valid('Paid', 'Partially Paid', 'Overdue', 'Unpaid').optional(),
    termsAndConditions: Joi.string(),
    notes: Joi.string(),
    bankDetails: Joi.string().required(),
    totalAmountBeforeTax: Joi.number().required(),
    total: Joi.number().required(),
    grandTotal: Joi.number().required(),
    // GSTIN: Joi.string().optional(),
    roundoff: Joi.string().optional().allow(null),
    addExtraCharges: Joi.alternatives().try(
        Joi.string().custom((value, helpers) => {
            try {
                const parsed = JSON.parse(value);
                if (!Array.isArray(parsed)) {
                    throw new Error();
                }
                return parsed;
            } catch (err) {
                return helpers.message('addExtraCharges must be a valid JSON array');
            }
        }),
        Joi.array().items(extraChargesSchema)
    ).optional().allow(null),
    addDiscount: Joi.alternatives().try(
        Joi.string().custom((value, helpers) => {
            try {
                const parsed = JSON.parse(value);
                if (typeof parsed !== 'object' || Array.isArray(parsed)) {
                    throw new Error();
                }
                return parsed;
            } catch (err) {
                return helpers.message('addDiscount must be a valid JSON object');
            }
        }),
        Joi.object({
            itemName: Joi.string().optional().allow(null, ''),
            percentage: Joi.number().min(0).optional().allow(null),
            amount: Joi.number().min(0).optional().allow(null),
        })
    ).optional().allow(null),
});
const updateItemSchema = Joi.object({
    itemandDescription: Joi.string().optional().allow(null, ''),
    hsnSac: Joi.string().optional().allow(null, ''),
    quantity: Joi.number().optional().default(1),
    unit: Joi.string().optional().allow(null, ''),
    rate: Joi.number().optional(),
    discount: Joi.number().optional().default(0),
    taxable: Joi.number().optional(),
    cgst: Joi.number().optional(),
    sgst: Joi.number().optional(),
    amount: Joi.number().optional(),
});

// Define the main Joi validation schema for updating the Quotation
const updateQuotationValidationSchema = Joi.object({
    customer: Joi.string().optional(),
    contactPerson: Joi.string().optional(),
    salesCredit: Joi.string().valid('Yes', 'No').optional(),
    address: addressSchema,
    shippingAddress: Joi.string().optional(),
    reference: Joi.string().optional(),
    quotationDate: Joi.string().regex(dateRegex).allow(null, ''),
    dueDate: Joi.string().regex(dateRegex).allow(null, ''),
    // Handle ItemList as a string or array
    ItemList: Joi.alternatives().try(
        Joi.string().custom((value, helpers) => {
            try {
                const parsed = JSON.parse(value);
                if (!Array.isArray(parsed)) {
                    throw new Error();
                }
                return parsed;
            } catch (err) {
                return helpers.message('ItemList must be a valid JSON array');
            }
        }),
        Joi.array().items(updateItemSchema)
    ).optional(),
    status: Joi.string().valid('Paid', 'Partially Paid', 'Overdue', 'Unpaid').optional(),
    termsAndConditions: Joi.string().optional().allow(null, ''),
    notes: Joi.string().optional().allow(null, ''),
    bankDetails: Joi.string().optional(),
    roundoff: Joi.string().optional().allow(null),
    totalAmountBeforeTax: Joi.number().optional(),
    total: Joi.number().optional(),
    grandTotal: Joi.number().optional(),
    // GSTIN: Joi.string().optional(),
    addExtraCharges:Joi.alternatives().try(
        Joi.string().custom((value, helpers) => {
            try {
                const parsed = JSON.parse(value);
                if (!Array.isArray(parsed)) {
                    throw new Error();
                }
                return parsed;
            } catch (err) {
                return helpers.message('addExtraCharges must be a valid JSON array');
            }
        }),
        Joi.array().items(extraChargesSchema)
    ).optional().allow(null), 
    addDiscount: Joi.alternatives().try(
        Joi.string().custom((value, helpers) => {
            try {
                const parsed = JSON.parse(value);
                if (typeof parsed !== 'object' || Array.isArray(parsed)) {
                    throw new Error();
                }
                return parsed;
            } catch (err) {
                return helpers.message('addDiscount must be a valid JSON object');
            }
        }),
        Joi.object({
            itemName: Joi.string().optional().allow(null, ''),
            percentage: Joi.number().min(0).optional().allow(null),
            amount: Joi.number().min(0).optional().allow(null),
        })
    ).optional().allow(null),
}).min(0); // Ensure at least one field is being updated

module.exports = {
    quotationValidationSchema,
    updateQuotationValidationSchema,
};
