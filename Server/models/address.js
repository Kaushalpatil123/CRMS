const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    address1:{
        type: String,
    },
    address2:{
        type: String,
    },
    city:{
        type: String,
    },
    state:{
        type: String,
    },
    country:{
        type: String,
    },
    pincode:{
        type: String,
    },
    type:{
        type: String,
        enum: ['Home','Office','Others']
    },
    customer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    }
}, { timestamps: true });

module.exports = mongoose.model('Address', addressSchema);