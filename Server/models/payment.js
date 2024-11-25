const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  alternateNumber: String,
  receiptDate: {
    type: String,
    required: true,
  },
  receiptNumber: {
    type: String,
    required: true,
  },
  dueDate: String,
  products: {
    type: String,
    required: true,
  },
  amountReceived: String,
  amountReceivedInFavourOf: String,
  totalDueAmount: {
    type: Number,
    required: true,
  },
  amountPaid: {
    type: Number,
  },
  balanceDue: {
    type: Number,
  },
  description: String,
  executive: {
    type: String,
    required: true,
  },
  paymentMode: {
    type: String,
    enum: ['CASH', 'CHEQUE', 'ONLINE'],
    required: true,
  },
  chequeDetails: {
    type: String,
  },
  onlinePaymentDetails: {
    mode: String,
    bank: String
  },
  authorizedSignatory: {
    type: String,
  },
  updatedId : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User",  
  },
},{
    timestamps:true
});

module.exports = mongoose.model('Payment', paymentSchema);
