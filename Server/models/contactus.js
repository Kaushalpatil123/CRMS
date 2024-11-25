const { required } = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const contactusSchema = Schema({
  name : {
    type: String,
    required : true,
  },
  mobile: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  Comment: {
    type: String,
    // required: true,
  },
},{
  timestamps: true
});

const Contactus = mongoose.model("Contactus", contactusSchema);

module.exports = Contactus;