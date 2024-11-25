const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    itemname: { type: String, required: true },
    description: { type: String },
    // quantity: { type: Number, default: 0 },
    unit: { type: String },
    // rate: { type: Number, default: 0 },
    // discount: { type: Number, default: 0 },
    hsn: { type: String },
    gst: { type: Number, default: 0 },
    // taxable: { type: Number },
    // amount: { type: Number },
    // discountAmount: { type: Number },
    code: { type: String },
    category: { type: String },
    subcategory: { type: String },
    actualprice: { type: String },
    sellingprice: { type: String },
    isdeleted: { type: Boolean, default: false},
    wishlist: {
        type: Boolean,
        default: false
      }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
