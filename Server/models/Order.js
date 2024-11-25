const { required } = require("joi");
const mongoose = require("mongoose");
const crypto = require('crypto');


// Sale Order Schema
const SaleOrderSchema = new mongoose.Schema(
  {
    // Basic Information
    orderId: {
      type: String,
      unique:true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    copyFrom: {
      type: String,
    },

    partyDetails: {
      contactPerson: {
        type: String,
        required: true,
      },
      salesCredit: {
        type: String,
        enum: ["Yes", "No"],
        default: "No",
      },
      shippingAddress: {
        type: String,
      },
      executive: {
        type: String,
        required: true,
      },
    },

    documentDetails: {
      orderNumber: {
        type: String,
      },
      reference: {
        type: String,
      },
      orderDate: {
        type: String,
        required:true
      },
      dueDate: {
        type: String,
        required: true,
      },
      customerPoNumber: {
        type: String,
        
      },
    },

    // Item List
    itemList: [
      
      {
        itemDescription: String,
        hsnSac: String,
        quantity: Number,
        unit: String,
        rate: Number,
        discount: Number,
        taxable: Number,
        cgst: Number,
        sgst: Number,
        amount: Number,
      },
    ],
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

    // Terms & Conditions
    termsConditions: {
      type: [String],
      default: ["No Terms & Conditions"],
    },

    // Bank Details
    bankDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bankdetail",
    },

    // Additional Fields
    notes: {
      type: String,
    },

    // Total & Charges
    total: {
      type: Number,
      required: true,
    },
    grandTotal: {
      type: Number,
      required: true,
    },
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
      default: false,
    },
    updatedId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
      
      },
    wishlist: {
      type: Boolean,
      default: false
    },
    lead:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
    },
    status:{
      type:String,
      enum:['Received', 'WIP', 'Query', 'Packed', 'Cancelled', 'Done'],
    },
    nextActions:{
      email:{
        type: Boolean,
        default: false,
      },
      whatsapp:{
        type: Boolean,
        default: false,
      },
      print:{
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

SaleOrderSchema.pre('save', function(next) {
  if (this.isNew) {
    const hash = crypto.createHash('sha256');
    hash.update(this._id.toString());
    this.orderId = hash.digest('hex').substring(0, 5).toUpperCase();
  }
  next();
});

const Order = mongoose.model("Order", SaleOrderSchema);

module.exports = Order;
