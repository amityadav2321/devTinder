const express=require("express")
const {validateSignUpData}=require("./utils/validation")
const connectDB =require("./config/database")
const User=require("./models/user");
const app=express();
const validator=require("validator");
const bcrypt = require("bcrypt");
const cookieparser=require("cookie-parser")
const jwt=require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

app.use(express.json());
app.use(cookieparser());

app.post("/signup",async(req,res)=>{
 
  try{

    validateSignUpData(req);

    const {firstName,lastName,emailId, password,age,gender,about,skills,photoUrl}=req.body;

    //Encrypt the password
    const passwordHash= await bcrypt.hash(password,10);

    console.log(passwordHash);
    //creating a new instance of a User model
    const user = new User({
        firstName,
        lastName,
        emailId,
        password:passwordHash,
        age,
        gender,
        photoUrl,
        about,
        skills,
    });
    
        
         await user.save();
         res.send("Data has been saved...")
    }catch(err){
        res.status(400).send("ERROR : "+err.message)
    }

})

app.post("/login",async(req,res)=>{

    try{

        const {emailId,password}=req.body;

         if(!validator.isEmail(emailId)){
            throw new Error("Enter correct email")
        }

        const user =await User.findOne({emailId:emailId});
        if(!user){
            throw new Error("Invaild Credentials");
        }

       


        const isPasswordValid = await bcrypt.compare(password,user.password);

        if(isPasswordValid){

            //create a JWT token

            //Add the token to cookie and send the response back to the user
            const token= await jwt.sign({ _id:user._id},"DEV@Tinder$790",{expiresIn:"1d"})
            

            res.cookie("token",token);
            res.send("Login Successful!!!");
        }else{
            throw new Error("Invaild Credentials");
        }


    }
    catch(err){
        res.status(404).send("ERROR : "+err.message);
     }
})

app.get("/profile",userAuth,async(req,res)=>{

    try{ 
        const user=req.user;
        res.send(user);
    }catch(err){
        res.status(404).send("ERROR : "+err.message);
    }

});

app.get("/user",userAuth,async(req,res)=>{

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

app.patch("/user/:userId",async(req,res)=>{
     const userId=req.params?.userId;
     const data=req.body;

     try {
         const ALLOWED_UPDATES=[
        "photoUrl","about","gender","age","skills"
        
     ]
        const isUpdateAllowed=Object.keys(data).every((k)=>
        ALLOWED_UPDATES.includes(k));
        if(!isUpdateAllowed){
         throw new Error("Update not allowed");
         }
         if(data?.skills.length>10){
            throw new Error("Skills can be not more than 10");
         }
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
 
