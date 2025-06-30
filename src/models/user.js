const mongoose=require("mongoose");
const validator=require("validator");
const jwt=require("jsonwebtoken");
const bcrypt = require("bcrypt");


const userSchema=mongoose.Schema({
    firstName:{
        type:String,
        require:true,
        minLength:4,
        maxLength:50
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        lowercase:true,
        require:true,
        unique:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invaild email address :"+value)
            }
        }
        
    },
    password:{
        type:String,
        require:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong password :"+ value)
            }
        }
    },
    age:{
        type:Number,
        min:18
    },
    gender:{
        type:String,
        enum:{
            values:["male","female","other"],
            message:`{VALUE} is not a valid gender type`,
        },
        // validate(value){
        //     if(!["male","female","others"].includes(value)){
        //         throw new Error("gender data is not valid");
        //     }
        // },
        lowercase:true,
    },
    photoUrl:{
        type:String,
        default:"https://geographyandyou.com/images/user-profile.png",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invaild Photo URL  :"+value)
            }
        }
    },
    about:{
        type:String,
        default:"This is the default about of user!"
    }, 
    skills:{
        type:[String]
    }
},{
    timestamps:true,
})


userSchema.index({firstName:1,lastName:1})

userSchema.methods.getJWT=async function (){
    const user=this;
    const token= await jwt.sign({_id:user._id},"DEV@Tinder$790",{expiresIn:"1d"});
    return token;
}

userSchema.methods.validatePassword=async function (passwordInputByUser){
    const user=this;
    const passwordHash=user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser,passwordHash);
    return isPasswordValid;
}

const User =mongoose.model("User",userSchema);

module.exports = User;