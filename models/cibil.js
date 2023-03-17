const mongoose = require('mongoose')

const cibilSchema = new mongoose.Schema({
    userName: {
        type: String,
        required:true,
        maxlength: 32,
        trim: true
    },
    userEmail:{
        type: String,
        required : true
    },
    loanCount: {
        type: Number,
        required: true
    },
    currentLoanCount:{
        type: Number,
        required: true
    },
    finishedOverdue:{
        type: Number,
        required: true
    },
    currentOverdue:{
        type: Number,
        required: true
    },
    securedLoanCount: {
        type: Number,
        required: true
    },
    unsecuredLoanCount:{
        type: Number,
        required: true
    },
    loanCountYear:{
        type: Number,
        required: true
    },
    disapprovedLoanCount:{
        type: Number,
        required: true
    },
    totalLoanCredited:{
        type: Number,
        required: true
    },
    presentLoanAmount:{
        type: Number,
        required: true
    },
    amountPaid:{
        type: Number,
        required: true
    }

} , { timeStamps : true })

cibilSchema.methods = {

}

module.exports = mongoose.model("Cibil" , cibilSchema )