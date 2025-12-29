const mongoose = require("mongoose")
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URl)
    console.log("mongodb is connected", )
  } catch (error) {
    console.log("there is problem while connecting mongoose", error)
    process.exit(1);
    
  }
   
}
module.exports = connectDB;