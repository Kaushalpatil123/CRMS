const { required } = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = Schema({
  Role : {
    type: String,
    required : true,
    enum : ["User","Admin","Indiamart"]
  },
  userName : {
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
  password: {
    type: String,
    required: true,
  },
  isDeleted:{
    type:Boolean,
    default:false
  },
  wishlist: {
    type: Boolean,
    default: false
  }
},{
  timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;