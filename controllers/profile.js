const Profile = require("../models/profile")
const { validationResult } = require("express-validator")
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('express-jwt');

const create = (req, res) => {
    const { email, userName } = req.body

    Profile.findOne({ email }, (err, profile) => {
        if (profile) {
            res.status(400).json({
                message: "Profile Already Exists"
            })
        }

        if (err || !profile) {

            Profile.findOne({ userName }, (err, profile) => {
                if (profile) {
                    res.status(400).json({
                        message: "Profile Already Exists"
                    })
                }

                if (err || !profile) {

                    const profile = new Profile(req.body)

                    profile.save((e, profile) => {
                        if (e) {
                            return res.status(400).json({
                                error: "Profile Already exits",
                            })
                        }

                        return res.status(200).json({
                            message: "Profile saved Successfully",
                            profile
                        })
                    })
                }
            })

        }
    })
}


const modify = (req, res) => {

    const { email, userName, name, mobile, address, occupation, aadhaarNo, panNo,
         bankAccountNo, ifscCode , imgUrl , aadhaarUrl , panUrl , bankUrl } = req.body

    Profile.updateOne({ userName }, {
        $set: {
            "email": email,
            "name": name,
            "mobile": mobile,
            "address": address,
            "occupation": occupation,
            "aadhaarNo": aadhaarNo,
            "panNo": panNo,
            "bankAccountNo": bankAccountNo,
            "ifscCode": ifscCode ,
            "imgUrl" : imgUrl ,
            "aadhaarUrl" :aadhaarUrl ,
            "panUrl" : panUrl ,
            "bankUrl" :bankUrl
        }
    }, (err, response) => {
        if (response) {
            return res.status(200).json({
                message: "Profile Updated Successfully",
                response
            })
        }

        if (err || !response) {
            res.status(400).json({
                message: "Profile Does Not Exists"
            })
        }
    })
}

const get = (req , res) =>
{
    const {userName} = req.body

    Profile.findOne({userName} , (err , profile ) =>
    {
        if (profile) {
            res.status(200).json({
                message: "Profile Found" ,
                profile
            })
        }
        else
        {
            res.status(400).json({
                message: "Profile Does Not Exists"
            })
        }
    })
}

module.exports = {
    "create" : create ,
    "modify" : modify ,
    "get"  : get
}