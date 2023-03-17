const express = require("express")
const {signup,signin,signout,verify_email} = require("../controllers/user");
const {check} = require("express-validator")
const userAuth = require("../middlewares/userAuth")
const router = express.Router()

router.post('/signup',[
    check("userName","User Name length must be greater than 3 characters").isLength({min: 3}),
    check("email","Email should be valid").isEmail(),
    check("password","Password must be greater that 6 characters").isLength({min: 6})
], signup)

router.post('/signin', signin)

router.get("/signout", userAuth ,signout)

router.post("/verify_email", verify_email)

module.exports = router
