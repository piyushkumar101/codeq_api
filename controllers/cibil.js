const Cibil = require("../models/cibil")
const { validationResult } = require("express-validator")
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('express-jwt');

const get = (req, res) => {
    const { userName , userEmail } = req.body

    Cibil.findOne({ userName , userEmail }, (err, cibil) => {
        if (cibil) {
            res.status(200).json({
                message: "Cibil Details",
                cibil
            })
        }
        else {
            res.status(400).json({
                message: "No Such cibil Details Exists"
            })
        }
    })
}

module.exports = {
    "get": get
}