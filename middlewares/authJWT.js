const jwt = require('jsonwebtoken')
const config = require('../config/auth.config.js')
const db = require('../models')
const User = db.user

verifyOTPToken = (req, res, next) => {
    let token = req.headers["x-access-token"]

    if (!token) {
        return res.status(403).send({message: "No token provided"})
    }

    jwt.verify(token, config.jwtSecret, (err, decoded) => {
        if (err) {
            return res.status(401).send({message: "Unauthoraized"})
        }

        req.userID = decoded.userID;
        next()
    })
}

verifyKeyToken = (req, res, next) => {
    let token = req.headers["x-access-token"]

    console.log("in key token verification")

    if (!token) {
        return res.status(403).send({message: "No token provided"})
    }

    jwt.verify(token, config.jwtSecret, (err, decoded) => {
        if (err) {
            console.log("token not verified?")
            return res.status(401).send({message: "Unauthoraized"})
        }
        if (decoded.otpAuthorized !== true) {
            return res.status(401).send({message: "Unauthoraized"})
        }

        if (decoded.keyAuthorized !== true) {
            return res.status(401).send({message: "Unauthoraized"})
        }

        console.log("token verified!")
        req.userID = decoded.userID;
        next()
    })
}

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"]

    if (!token) {
        return res.status(403).send({message: "No token provided"})
    }

    jwt.verify(token, config.jwtSecret, (err, decoded) => {
        if (err) {
            return res.status(401).send({message: "Unauthoraized"})
        }
        
        if (decoded.authorized === false) {
            return res.status(401).send({message: "Unauthoraized"})
        }
        req.userID = decoded.userID;
        next()
    })
}

const authJWT = {
    verifyToken,
    verifyOTPToken,
    verifyKeyToken
}
module.exports = authJWT
