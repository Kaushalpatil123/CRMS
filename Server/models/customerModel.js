const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    website: { type: String },
    industrySegment: { type: String },
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String },
    receivables: { type: Number },
    receivablesNotes: { type: String },
    businessProspect: { type: Number },
    orderTarget: { type: Number },
    msmeNo: { type: String },
    panNo: { type: String },
    GSTIN: { type: String }
}, { timestamps: true });

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
