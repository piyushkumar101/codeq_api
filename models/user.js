const mongoose = require("mongoose")
const crypto = require("crypto");
const uuid1 = require("uuid/v1");

const userSchema = new mongoose.Schema({
    userName:{
        type: String,
        required:true,
        maxlength: 32,
        trim: true ,
        unique: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    encrypted_password:{
        type: String,
        required: true
    },
    verified: String,
    salt: String,
}, {timestamps: true})

userSchema.virtual("password")
    .set(function (password){
        this._password = password
        this.salt = uuid1()
        this.encrypted_password = this.securePassword(password)
    })
    .get(function (){
        return this.password
    })

userSchema.methods = {
    authenticate: function(rawPassword){
        return this.encrypted_password === this.securePassword(rawPassword)
    },
    securePassword: function (rawPassword) {
        if(!rawPassword) return "";

        try{
            return crypto.createHmac("sha256", this.salt).update(rawPassword).digest("hex")
        }catch (e) {
            console.log(e);
            return e;
        }
    },
}

module.exports = mongoose.model("User",userSchema)
