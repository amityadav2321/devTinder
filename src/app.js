const express=require("express")

const app=express();

app.use("/test",(req,res)=>{
    res.send("Hello  how are you ");
})

app.listen(3000,()=>{
    console.log("server is running on 3000")
});