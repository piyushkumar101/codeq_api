const mongoose = require('mongoose')

const loanSchema = new mongoose.Schema({
    id :{
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    borrowerUserName: {
        type: String,
        required:true,
        maxlength: 32,
        trim: true ,
        default: " "
    },
    borrowerEmail:{
        type: String,
        required : true
    },
    lenderUserName: {
        type: String,
        required: true,
        maxlength: 32,
        default: " "
    },
    lenderEmail:{
        type: String,
        required : true
    },
    loanAmount: {
        type: Number,
        required: true
    },
    loanTenure:{
        type: Number,
        required: true
    },
    interestRate:{
        type: Number,
        required: true
    },
    status:{
        type: String ,
        required: true
    },
    secured:{
        type: Boolean ,
        required: true
    },
    date:{
        type: String ,
        required: true
    }

} , { timeStamps : true })

loanSchema.methods = {

}

module.exports = mongoose.model("Loan" , loanSchema )