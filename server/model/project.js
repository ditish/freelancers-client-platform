const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Ongoing", "Completed"], default: "Pending" },
  deadline: { type: Date, required: true },
  client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
  },
  description: {
      type:String,required:true
    }
  

}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);
