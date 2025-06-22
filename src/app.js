const express=require("express")
const connectDB =require("./config/database")
const User=require("./models/user")
const app=express();

app.post("/signup",async(req,res)=>{
  
//creating a new instance of a User model
    const user = new User( {
        firstName:"Amit",
        lastName:"Yadav",
        emailId:"amityadav@gmail.com",
        password:"amit@123",
        age:20,
        gender:"Male"
});
    try{
         await user.save();
         res.send("Data has been saved...")
    }catch(err){
        res.status(400).send("Error while saving data to database"+err.message)
    }

})


connectDB().then(()=>{
    console.log("Database connection established...");
    app.listen(3000,()=>{
    console.log("server is running on 3000")
}); 
}).catch(err=>{
    console.error("Database cannot be connected")
})
 
