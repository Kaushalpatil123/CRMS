const mongoose = require('mongoose');

const prospectSchema = new mongoose.Schema({
  company: { type: String },
  title: { type: String, enum: ['Mr.', 'Mrs.', 'Ms.'] },
  firstName: { type: String },
  lastName: { type: String},
  mobile: { type: String, required: true },
  email: { type: String },
  website: { type: String },
  industrySegment: { type: String },
  country: { type: String },
  state: { type: String },
  city: { type: String },
  address1: { type: String },
  address2: { type: String },
  category: { type: String, enum: ['Customer', 'Prospect', 'Supplier'], default: 'Prospect'},
  product: { type: String, },
  executive: { type: String,},
  businessProspectAnnual: { type: Number },
  requirement:{type: String},
  orderTarget: { type: Number },
  receivables:{ type: Number},
  receivablesnotes:{ type: String},
  msmenumber:{ type: String},
  pannumber:{ type: String},
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
  // prospectStage: { type: String, enum: ['Prospect', 'Target', 'Lead', 'Customer'] },
  prospectStage: { type: String},
status: { 
  type: String 
},
new: { 
  type: Boolean, 
  default: true 
},
samplegiven: { 
  type: Boolean, 
  default: false 
},
discussion: { 
  type: String
},
closedate: { 
  type: String
}

  
},{
  timestamps: true
});

const Prospect = mongoose.model('Prospect', prospectSchema);

module.exports = Prospect;
