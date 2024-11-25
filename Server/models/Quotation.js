const express = require('express');
const mongoose = require('mongoose');
const crypto = require('crypto');

const quotationSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    contactPerson: {
        type: String,
        required: true
    },
    salesCredit: {
        type: String,
        enum: ['Yes', 'No'],
        default: 'No'
    },
    address:{
        address1:{
            type: String
        },
        address2:{
            type: String
        },
        city:{
            type: String
        },
        state:{
            type: String
        },
        country:{
            type: String
        },
        pincode:{
            type: String
        },
        type:{
            type: String,
            enum: ['Home','Office','Others']
        },
    },
    shippingAddress: {
        type: String,
        required: true
    },
    
    reference: {
        type: String,
        required: true,
    },
    quotationDate: {
        type: String,
        required: true
    },
    dueDate: {
        type: String,
        required: true
    },
    ItemList: [{
        itemandDescription: {
            type: String,
            required: true,

        },
        hsnSac: {
            type: String,
            required: true,

        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        },
        unit: {
            type: String,
            enum: ['Piece', 'Kg', 'Litre', 'Meter', 'Item'],
            required: true,

        },
        rate: {
            type: Number,
            required: true,
            default: 0
        },
        discount: {
            type: Number,
            required: true,
            default: 0
        },
        taxable: {
            type: Number,
            required: true,

        },
        cgst: {
            type: Number,
            required: true,

        },
        sgst: {
            type: Number,
            required: true,

        },
        amount: {
            type: Number,
            required: true,

        },
    }],
    termsAndConditions: {
        type: String,

    },
    notes: {
        type: String,

    },
    bankDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bankdetail",
      },
    // GSTIN: {
    //     type: String,
    //     ref: "Bankdetail",
    //   },
    totalAmountBeforeTax: {
        type: Number,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    grandTotal: {
        type: Number,
        required: true,
    },
    uploadFile: {
        type: String,   
    },
    roundoff:{type: String},
    addExtraCharges: [{
        itemName: String,
        percentage: Number,
        amount: Number,
      }],
      addDiscount: {
        itemName: String,
        percentage: Number,
        amount: Number,
      },
    isDeleted: {
        type: Boolean,
        default: false
    },
    updatedId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
       },
       quotationId:{
        type: String
       },
       quotationNo: {
        type: String
       },
    status:{
        type: String,
        enum: ['Paid', 'Partially Paid','Overdue','Unpaid'],

    },
    wishlist: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});

quotationSchema.pre('save', function(next) {
    if (this.isNew) {
        const hash = crypto.createHash('sha256');
        hash.update(this._id.toString());
        this.quotationId = hash.digest('hex').substring(0, 5).toUpperCase();
    }
    next();
});

module.exports = mongoose.model('Quotation', quotationSchema);