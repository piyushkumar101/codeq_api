const express = require("express")
const {create , modify , get , accept , all_loans , accepted_loans , applied_loans , paid_amount , finished_loan, send_remainder} = require("../controllers/loan");
const {check} = require("express-validator")
const userAuth = require("../middlewares/userAuth");
const { route } = require("./user");
const router = express.Router()

router.post('/create', userAuth , create)
router.post('/modify', userAuth , modify)
router.post('/accept', userAuth , accept)
router.post('/paidAmounts', userAuth , paid_amount)
router.post('/finishedLoans', userAuth , finished_loan)
router.get('/get', userAuth , get)
router.get('/allLoans', userAuth , all_loans)
router.post('/appliedLoans', userAuth , applied_loans)
router.post('/acceptedLoans', userAuth , accepted_loans)
router.post('/sendRemainder' , userAuth , send_remainder)

module.exports = router
