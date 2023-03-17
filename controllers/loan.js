const Loan = require("../models/loan")
const Cibil = require("../models/cibil")
const { validationResult } = require("express-validator")
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('express-jwt');

const create = (req, res) => {
    const { id, borrowerEmail, borrowerUserName } = req.body

    const userName = borrowerUserName
    const userEmail = borrowerEmail

    Cibil.findOne({ userName, userEmail }, (err, cibil) => {
        if (cibil) {
            Cibil.updateOne({ userName, userEmail }, {
                $set: {
                    "loanCount": cibil.loanCount + 1,
                    "disapprovedLoanCount": cibil.disapprovedLoanCount + 1
                }
            }, (err, response) => {
                if (err) {
                    console.log("Error found")
                }
            })
        }

        if (err || !cibil) {
            const cibil = new Cibil({
                userName: userName, userEmail: userEmail, loanCount: 1, currentLoanCount: 0,
                finishedOverdue: 0, securedLoanCount: 0, unsecuredLoanCount: 0,
                loanCountYear: 0, disapprovedLoanCount: 1, currentOverdue: 0, presentLoanAmount: 0,
                amountPaid: 0, totalLoanCredited: 0
            })
            cibil.save((e, cibil) => {
                if (e)
                    console.log(e)
                else
                    console.log("Cibil Added")
            })
        }
    })

    Loan.findOne({ id }, (err, loan) => {
        if (loan) {
            res.status(400).json({
                message: "Loan Already Exists . Id repeated ."
            })
        }

        if (err || !loan) {

            const loan = new Loan(req.body)

            loan.save((e, loan) => {
                if (e) {
                    return res.status(400).json({
                        error: "Loan Already exits ." + e,
                    })
                }

                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'a.antsapps@gmail.com',
                        pass: 'rmyqwmhoebnglmds'
                    }
                });
                const mailOptions = {
                    from: 'a.antsapps@gmail.com',
                    to: borrowerEmail,
                    subject: 'Successsfully Applied for loan',
                    text: `You have sucessfully applied for loan . Your loan id is ${id} . 
                    Use this id to track status of loan .`
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        res.json({
                            error: error
                        })
                    }
                })

                return res.status(200).json({
                    message: "Successfully Applied for Loan",
                    loan
                })
            })
        }
    })

}


const modify = (req, res) => {

    const { id, loanTenure, interestRate, borrowerEmail, status } = req.body

    if (status === "applied") {
        Loan.updateOne({ id }, {
            $set: {
                "loanTenure": loanTenure,
                "interestRate": interestRate
            }
        }, (err, response) => {
            if (response) {

                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'a.antsapps@gmail.com',
                        pass: 'rmyqwmhoebnglmds'
                    }
                });
                const mailOptions = {
                    from: 'a.antsapps@gmail.com',
                    to: borrowerEmail,
                    subject: 'Successsfully Updated Loan Details',
                    text: `You have sucessfully updated your loan details having id ${id} . 
                    Use this id to track status of loan .`
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        res.json({
                            error: error
                        })
                    }
                })

                return res.status(200).json({
                    message: "Loan Details Updated Successfully",
                    response
                })
            }

            if (err || !response) {
                res.status(400).json({
                    message: "Such Loan Does Not Exists"
                })
            }
        })
    } else {
        res.status(200).json({
            message: "Accepted Loans can not be modified"
        })
    }

}

const accept = (req, res) => {

    const { id, lenderUserName, lenderEmail, status, borrowerEmail, borrowerUserName, date, secured, loanAmount } = req.body

    var userName = borrowerUserName
    var userEmail = borrowerEmail

    Cibil.findOne({ userName, userEmail }, (err, cibil) => {
        if (cibil) {
            var securedLoanCount = cibil.securedLoanCount
            var unsecuredLoanCount = cibil.unsecuredLoanCount
            if (secured) {
                securedLoanCount++
            }
            else {
                unsecuredLoanCount++
            }

            Cibil.updateOne({ userName, userEmail }, {
                $set: {
                    "currentLoanCount": cibil.currentLoanCount + 1,
                    "securedLoanCount": securedLoanCount,
                    "unsecuredLoanCount": unsecuredLoanCount,
                    "loanCountYear": cibil.loanCountYear + 1,
                    "disapprovedLoanCount": cibil.disapprovedLoanCount - 1,
                    "presentLoanAmount": cibil.presentLoanAmount + loanAmount,
                    "totalLoanCredited": cibil.totalLoanCredited + loanAmount
                }
            }, (err, response) => {
                if (err) {
                    console.log("Error found ." + err)
                } else {
                    console.log("Cibil updated")
                }
            })
        }
    })

    if (status === "accepted") {
        Loan.updateOne({ id }, {
            $set: {
                "lenderUserName": lenderUserName,
                "lenderEmail": lenderEmail,
                "status": status,
                "date": date,
                "secured": secured
            }
        }, (err, response) => {
            if (response) {

                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'a.antsapps@gmail.com',
                        pass: 'rmyqwmhoebnglmds'
                    }
                });
                const mailOptions = {
                    from: 'a.antsapps@gmail.com',
                    to: borrowerEmail,
                    subject: 'Your loan got accepted',
                    text: `Your loan with id ${id} got accepted by ${lenderUserName}. You can view further details on the app .`
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        res.json({
                            error: error
                        })
                    }
                })

                const mailOptions2 = {
                    from: 'a.antsapps@gmail.com',
                    to: lenderEmail,
                    subject: 'Your accepted the loan',
                    text: `You accepted the loan with id ${id} posted by ${borrowerUserName}. You can view further details on the app .`
                };

                transporter.sendMail(mailOptions2, (error, info) => {
                    if (error) {
                        res.json({
                            error: error
                        })
                    }
                })

                return res.status(200).json({
                    message: "Loan Accepted Successfully",
                    response
                })
            }

            if (err || !response) {
                res.status(400).json({
                    message: "Such Loan Does Not Exists"
                })
            }
        })
    }
}

const get = (req, res) => {
    const { id } = req.body

    Loan.findOne({ id }, (err, loan) => {
        if (loan) {
            res.status(200).json({
                message: "Loan Details",
                loan
            })
        }
        else {
            res.status(400).json({
                message: "No Such Loan Details Exists"
            })
        }
    })
}

const all_loans = (req, res) => {

    const status = "applied"

    Loan.find({ status }, (err, response) => {
        if (response[0]) {
            return res.status(200).json({
                message: "All Loans",
                response
            })
        }

        if (err || !response[0]) {
            res.status(400).json({
                message: "No Loan Exists"
            })
        }
    })
}

const applied_loans = (req, res) => {

    const { borrowerEmail, borrowerUserName } = req.body

    Loan.find({ borrowerEmail, borrowerUserName }, (err, response) => {
        if (response[0]) {
            return res.status(200).json({
                message: "All Loans",
                response
            })
        }

        if (err || !response[0]) {
            res.status(400).json({
                message: "No Loan Exists"
            })
        }
    })
}

const accepted_loans = (req, res) => {

    const { lenderEmail, lenderUserName } = req.body

    Loan.find({ lenderEmail, lenderUserName }, (err, response) => {
        if (response[0]) {
            return res.status(200).json({
                message: "All Loans",
                response
            })
        }

        if (err || !response[0]) {
            res.status(400).json({
                message: "No Loan Exists"
            })
        }
    })
}

const paid_amount = (req, res) => {

    const { userName, userEmail, amountPaid, overdue } = req.body

    Cibil.findOne({ userName, userEmail }, (err, cibil) => {
        if (cibil) {
            if (overdue) {
                Cibil.updateOne({ userName, userEmail }, {
                    $set: {
                        "presentLoanAmount": cibil.presentLoanAmount - amountPaid,
                        "amountPaid": cibil.amountPaid + amountPaid,
                        "currentOverdue": cibil.currentOverdue + 1
                    }
                }, (err, response) => {
                    if (err) {
                        console.log("Error found ." + err)
                    } else {
                        return res.status(200).json({
                            message: "Cibil UPdated Successfully",
                            response
                        })
                    }
                })
            }
            else {
                Cibil.updateOne({ userName, userEmail }, {
                    $set: {
                        "presentLoanAmount": cibil.presentLoanAmount - amountPaid,
                        "amountPaid": cibil.amountPaid + amountPaid
                    }
                }, (err, response) => {
                    if (err) {
                        console.log("Error found ." + err)
                    } else {
                        return res.status(200).json({
                            message: "Cibil UPdated Successfully",
                            response
                        })
                    }
                })
            }
        }
    })

}

const finished_loan = (req, res) => {
    const { id, lenderUserName, lenderEmail, status, borrowerEmail, borrowerUserName, overdue } = req.body

    var userName = borrowerUserName
    var userEmail = borrowerEmail

    Cibil.findOne({ userName, userEmail }, (err, cibil) => {
        if (cibil) {

            var a = 0

            if (overdue) {
                a++
            }

            Cibil.updateOne({ userName, userEmail }, {
                $set: {
                    "finishedOverdue": cibil.finishedOverdue + a,
                    "currentLoanCount": cibil.currentLoanCount - 1
                }
            }, (err, response) => {
                if (err) {
                    console.log("Error found ." + err)
                } else {
                    console.log("Cibil updated")
                }
            })
        }
    })


    Loan.updateOne({ id }, {
        $set: {
            "status": status,
        }
    }, (err, response) => {
        if (response) {

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'a.antsapps@gmail.com',
                    pass: 'rmyqwmhoebnglmds'
                }
            });
            const mailOptions = {
                from: 'a.antsapps@gmail.com',
                to: borrowerEmail,
                subject: 'Your completed the loan amount',
                text: `Your loan with id ${id} is completely paid to ${lenderUserName}. You can view further details on the app .`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    res.json({
                        error: error
                    })
                }
            })

            const mailOptions2 = {
                from: 'a.antsapps@gmail.com',
                to: lenderEmail,
                subject: 'Your got the complete loan amount',
                text: `You are paid the complete loan amount with id ${id} by ${borrowerUserName}. You can view further details on the app .`
            };

            transporter.sendMail(mailOptions2, (error, info) => {
                if (error) {
                    res.json({
                        error: error
                    })
                }
            })

            return res.status(200).json({
                message: "Loan Paid Successfully",
                response
            })
        }

        if (err || !response) {
            res.status(400).json({
                message: "Such Loan Does Not Exists"
            })
        }
    })

}

const send_remainder = (req, res) => {

    const { email, message, userName } = req.body

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'a.antsapps@gmail.com',
            pass: 'rmyqwmhoebnglmds'
        }
    });
    const mailOptions = {
        from: 'a.antsapps@gmail.com',
        to: email,
        subject: "Remainder from " + userName,
        text: message
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(400).json({
                error: error
            })
        }
        else
        {
            return res.status(200).json({
                message : "Mail Sent Successfully"
            })
        }
    })

}

module.exports = {
    "create": create,
    "modify": modify,
    "get": get,
    "accept": accept,
    "all_loans": all_loans,
    "applied_loans": applied_loans,
    "accepted_loans": accepted_loans,
    "paid_amount": paid_amount,
    "finished_loan": finished_loan ,
    "send_remainder":send_remainder
}