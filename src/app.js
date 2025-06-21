const express=require("express")

const app=express();

app.get("/user",(req,res)=>{
    res.send({firstname:"Amit" , Lastname:"Yadav"});
});

app.listen(3000,()=>{
    console.log("server is running on 3000")
}); 