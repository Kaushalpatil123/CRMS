const { number } = require('joi');
const mongoose = require('mongoose');
const crypto = require('crypto');


const invoiceSchema = new mongoose.Schema({
    invoiceId: {
        type: String,
        unique: true,
    },
    type: {
        type: String,
        enum: ['party invoice', 'cash memo'],
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    partyDetails: {
        contactPerson: String,
        billingAddress: String,
        salesCredit: Number,
        shippingAddress: String,
        shippingDetails: String
    },
    documentDetails: {
        invoiceNo: {
            type: String,
            // required: true
        },
        reference: String,
        invoiceDate: {
            type: String,
            required: true
        },
        dueDate: {
            type : String,
        }
    },
    itemList: [
        {
            no: Number,
            itemDescription: String,
            qty: Number,
            unit: String,
            rate: Number,
            discount: Number,
            taxable: Number,
            CGST: Number,
            SGST: Number,
            hsn: String,
            amount: Number,
           
        }
    ],
    updatedId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
      
      },
      
    finalTotal:{type: String},
    roundoff:{type: String},
    amount:{type: String},
    extracharges: [{
        itemName: String,
        percentage: Number,
        amount: Number,
      }],
      discount: {
        itemName: String,
        percentage: Number,
        amount: Number,
      },
    isDeleted:{
        type:Boolean,
        default:false
    },
    wishlist:{
        type:Boolean,
        default:false
    },
    status:{
        type: String,
        enum:['Paid', 'Partially Paid', 'Overdue', 'Unpaid'],
    },
    paidAmount:{
        type: String
    },
    balanceAmount:{
        type: String
    },
    project:{
        type: String
    },
    bankDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bankdetail",
      },
    // GSTIN: {
    //     type: String,
    //     ref: "Bankdetail",
    //   },
    note:{
        type: String
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
    }

}, { timestamps: true });

invoiceSchema.pre('save', function(next) {
    if (this.isNew) {
        const hash = crypto.createHash('sha256');
        hash.update(this._id.toString());
        this.invoiceId = hash.digest('hex').substring(0, 5).toUpperCase();
    }
    next();
});

module.exports = mongoose.model('Invoice', invoiceSchema);