const Joi = require('joi');

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

const purchaseValidationSchema = Joi.object({
    customer: Joi.string().required(),
    contactPerson: Joi.string().required(),
    salesCredit: Joi.string().valid('Yes', 'No').default('No').required(),
    address: Joi.string().required(),
    shippingAddress: Joi.string().required(),
    reference: Joi.string().required(),
    invoiceDate: Joi.date().default(() => new Date()), 
    dueDate: Joi.date().default(() => new Date()),  
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
    termsAndConditions: Joi.string(),
    notes: Joi.string(),
    bankDetails: Joi.string().required(),
    totalAmountBeforeTax: Joi.number().required(),
    total: Joi.number().required(),
    grandTotal: Joi.number().required(),
    addExtraCharges: Joi.number(),
    addDiscount: Joi.number(),
});

module.exports = {
    purchaseValidationSchema
};
