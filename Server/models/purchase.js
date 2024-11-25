const express = require('express');
const mongoose = require('mongoose');
const crypto = require('crypto');

const purchaseSchema = new mongoose.Schema({
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
    address: {
        type: String,
        required: true
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
        type: Date,
        default: Date.now()
    },
    dueDate: {
        type: Date,
        default: Date.now
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
        type: String,
        required: true,
    },
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
    addExtraCharges: {
        type: Number,
        default: 0
    },
    addDiscount: {
        type: Number,
        default: 0
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    updatedId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
       },
       purchaseId:{
        type: String
       },
      InvoiceNo: {
        type: String
       }
}, {
    timestamps: true
});

purchaseSchema.pre('save', function(next) {
    if (this.isNew) {
        const hash = crypto.createHash('sha256');
        hash.update(this._id.toString());
        this.purchaseId = hash.digest('hex').substring(0, 5).toUpperCase();
    }
    next();
});

module.exports = mongoose.model('purchase',purchaseSchema);
