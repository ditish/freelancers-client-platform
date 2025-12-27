
const mongoose = require('mongoose');

const chatboxSchema =
  mongoose.Schema({
    user: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required:true
    },
    email: {
      type: String,
      required: true,
    },
    edited: {
      type: Boolean,
      default:false
    },
    time: {
      type: Date,
      default:Date.now
    },
      
   
  },
    {timestamps:true}
  );

module.exports = mongoose.model('Chatbox', chatboxSchema);

  
