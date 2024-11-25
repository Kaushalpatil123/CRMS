const mongoose = require('mongoose');

const bankdetailSchema = new mongoose.Schema({
    accountname:{
        type: String,
    },   
    bankname:{
        type: String,
    },
    branch:{
        type: String,
    },
    accountnumber:{
        type: String,
    },
    IFSC:{
        type: String,
    }
}, { timestamps: true });

module.exports = mongoose.model('Bankdetail', bankdetailSchema);