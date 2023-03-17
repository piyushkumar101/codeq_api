const express = require("express")
const { get } = require("../controllers/cibil");
const {check} = require("express-validator")
const userAuth = require("../middlewares/userAuth");
const { route } = require("./user");
const router = express.Router()


router.post('/get', userAuth , get)

module.exports = router