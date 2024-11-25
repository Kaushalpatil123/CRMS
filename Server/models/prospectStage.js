const { required } = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const StageSchema = Schema({
    status: {
    type: String,
    required : true,
    unique: true,
  },
//    role: {
//     type: String,
//     required: true,
//     enum: ["Lead","Prospect","Invoice","Quotation","Order","Purchase"]
//    },
   color:{
    type: String
   }
},{
  timestamps: true
});

// StatusSchema.index({ status: 1, role: 1 }, { unique: true });

const Stage = mongoose.model("Stage", StageSchema);

module.exports = Stage;