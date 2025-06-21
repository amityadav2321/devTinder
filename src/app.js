const express=require("express")

const app=express();

app.get("/user",(req,res)=>{
    res.send({firstname:"Amit" , Lastname:"Yadav"});
});

app.post("/user",(req,res)=>{
    res.send("Data saved successfully stored to database");
});

app.use("/user",(req,res)=>{
    res.send("hahahahahahahahahaah")
})
app.listen(3000,()=>{
    console.log("server is running on 3000")
}); 