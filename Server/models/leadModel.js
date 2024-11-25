const mongoose = require('mongoose');
const crypto = require('crypto');

const contactSchema = new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String},
    email: { type: String },
    phoneNumber: { type: String }
});

const leadSchema = new mongoose.Schema({
    leadId: { 
        type: String, 
        unique: true, 
        // required: true 
    },
    companyName: { type: String},
    contacts: [contactSchema],
    country: { type: String },
    state: { type: String },
    city: { type: String },
    executive: { type: String},
    source: { type: String},
    designation: { type: String },
    product: { type: String },
    requirements: { type: String },
    notes: { type: String },
    status: { 
        type: String
    },
    agentstatus: {
        type: String,
        enum: ['Available', 'Unavailable / Not Answering', 'Busy', 'Switched Off', 'Not Reachable']
    },
    lastInteractions: [{
        executiveName: { type: String},
        date: { type: String},
        time: { type: String},
        description: { type: String     },
    }],
    nextInteraction: {
        executiveName:{type : String},
        date: { type: String },
        time: { type: String },
        description: { type: String },
    },
    isactive:{
        type: Boolean,
        default:true
    },
    reason:{
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    updatedId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        // required : true,
      
      },
      wishlist: {
        type: Boolean,
        default: false
    },
    order:{
        type:Boolean,
        default:false
    }
    
}, { timestamps: true });

leadSchema.pre('save', function(next) {
    if (this.isNew) {
        const hash = crypto.createHash('sha256');
        hash.update(this._id.toString());
        this.leadId = hash.digest('hex').substring(0, 5).toUpperCase();
    }
    next();
});

module.exports = mongoose.model('Lead', leadSchema);
