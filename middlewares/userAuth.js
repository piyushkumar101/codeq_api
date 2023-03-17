const jwt = require("jsonwebtoken")
const User = require("../models/user")

const auth = async ( req , res , next ) => {
    try {
        const token = req.header("Authorization").replace('Bearer ' , '')
        const decodedToken = jwt.verify(token, process.env.SECRET)
        User.findOne(  { '_id': decodedToken._id } , ( err , user ) =>
        {
            if(err || !user) {
                res.status(401).send({
                    error : "Please Authenticate"
                })
            }else {
                next()
            }
        })
    } catch( e ) {
        res.status(401).send({
            error : "Please Authenticate"
        })
    }

}

module.exports = auth