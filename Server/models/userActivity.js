const mongoose = require("mongoose");
const { Schema } = mongoose;

const userActivitySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessions: [{
    loginTime: {
      type: Date,
      required: true
    },
    idletime :  [{
      startTime: Date,
      endTime: Date
    }],
    logoutTime: Date,
    breaks: [{
      nameOfBreak: {
        type: String,
        enum: ['LUNCH BREAK', 'TEA BREAK', 'TEAM MEETING', 'OUT OF OFFICE', 'CLIENT VISIT']
      },
      startTime: Date,
      endTime: Date
    }],
    workTime: Number,  
    breakTime: Number,
    idletimes: Number, 
  }],
  lastLoginTime: Date,
  lastLogoutTime: Date,
  isLoggedIn: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const UserActivity = mongoose.model("UserActivity", userActivitySchema);

module.exports = UserActivity;