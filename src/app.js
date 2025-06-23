const express=require("express")
const connectDB =require("./config/database")
const User=require("./models/user")
const app=express();

app.use(express.json());
app.post("/signup",async(req,res)=>{
  console.log(req.body);
//creating a new instance of a User model
    const user = new User( req.body);
    try{
         await user.save();
         res.send("Data has been saved...")
    }catch(err){
        res.status(400).send("Error while saving data to database"+err.message)
    }

})

app.get("/user",async(req,res)=>{

    const userEmail=req.body.emailId;
    try{
         const users= await User.find({
        emailId:userEmail
    })

    if(users.length===0){
        res.status(404).send("user not found");
    }
    else{
        res.send(users);
    }
    }
    catch(err){
        res.status(400).send("something wrong");

    }
   
})
app.get("/feed",async(req,res)=>{
     
    try{
        const users=await User.find({});
        res.send(users);
    }
    catch(err){
        res.status(400).send("something wrong");

    }
});

app.delete("/user",async(req,res)=>{
     const userId=req.body.userId;
     try{
        const user= await User.findByIdAndDelete(userId);
        res.send("user deleted successfully");
     }
     catch(err){
        res.status(404).send("something went wrong");
     }
})

app.patch("/user",async(req,res)=>{
     const userId=req.body.userId;
     const data=req.body;

     try {
        await User.findByIdAndUpdate({_id:userId},data,{
            runValidators:true,
            returnDocument:"after",
        });
        res.send("user updated successfully");
     } catch (err) {
        res.status(400).send("UPDATE Failed:"+err.message);
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
 
