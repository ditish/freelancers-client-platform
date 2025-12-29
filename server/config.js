const mongoose = require("mongoose")
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONG_url);
    console.log("mongodb is connected", )
  } catch (error) {
    console.log("there is problem while connecting mongoose", error)
    process.exit(1);
    
  }
   
}
module.exports = connectDb;