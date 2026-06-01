const mongoose = require("mongoose");
const Task = require("./task");

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Ongoing", "Completed"], default: "Pending" },
  deadline: { type: Date, required: true },
  client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
freelancer: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
  description: {
      type:String,required:true
    }
  

}, { timestamps: true },
);
//all task delete related to particular project
projectSchema.pre("findOneAndDelete", async function (next) {
  const projectId = this.getQuery()._id;

  await Task.deleteMany({ projectId });
});

module.exports = mongoose.model("Project", projectSchema);
