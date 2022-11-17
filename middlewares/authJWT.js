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
        console.log(decoded.authorized)
        
        req.userID = decoded.id;
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
        console.log(decoded.authorized)
        if (decoded.authorized === false) {
            return res.status(401).send({message: "Unauthoraized"})
        }
        req.userID = decoded.id;
        next()
    })
}

const authJWT = {
    verifyToken
}
module.exports = authJWT
