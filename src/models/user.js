const mongoose=require("mongoose");
const validator=require("validator")
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
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("gender data is not valid");
            }
        },
        lowercase:true,
    },
    photoUrl:{
        type:String,
        default:"https://geographyandyou.com/images/user-profile.png",
        alidate(value){
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


const User =mongoose.model("User",userSchema);

module.exports = User;