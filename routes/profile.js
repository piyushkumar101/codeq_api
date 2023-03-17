const express = require("express")
const {create , modify , get} = require("../controllers/profile");
const {check} = require("express-validator")
const userAuth = require("../middlewares/userAuth");
const { route } = require("./user");
const router = express.Router()

router.post('/create', userAuth , create)
router.post('/modify', userAuth , modify)
router.post('/get', userAuth , get)

module.exports = router
