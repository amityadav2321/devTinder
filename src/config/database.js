const mongoose=require("mongoose");

const connectDB= async()=>{
    await mongoose.connect("mongodb+srv://Username:Password@cluster0.pkv06.mongodb.net/devTinder")
}

module.exports= connectDB;
