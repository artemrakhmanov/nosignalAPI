const { gmailAddress, gmailAppPassword } = require("../config/auth.config");
const config = require("../config/auth.config");
const { otpEmailSubject } = require("../config/email.config");
const { getEmailOTPMessage } = require("./email.controller");
const db = require("../models");
const { handleUserDuringOTP } = require("./user.controller");
const User = db.user;
const otpGenerator = require('otp-generator')
const nodemailer = require('nodemailer')
var jwt = require("jsonwebtoken");

//otp generation + user creation if necessary (return a notifier on the state)
exports.requestOTP = (req, res) => {
    const email = req.body.email
    
    //handle new / existing user setup & retrieve user object
    handleUserDuringOTP(email)
    .then(user => generateOTP(user))    //generate OTP & add to DB
    .then(user => sendOTPEmail(user))  //send email with the OTP
    .then(user => generateOTPToken(user))
    .then(token => {
        console.log("OTP CREATED, token granted", token)
        res.status(200).send({
            message: "OTP Requested, mail sent, token passed",
            token: token
        })
    })
    .catch((error)=> {
        console.error(error)
        //remove otp & set otpRequested to false
        return res.status(500).send({message: "Internal Server Error Occured"})
    })
    
}

async function generateOTPToken(user) {
    try {
        var token = jwt.sign({
            userID: user._id,
            authorized: false,
            keyAuthorized: false,
            otpAuthorized: true
        }, config.jwtSecret, {
            expiresIn: 600  //short lived 10 minute token
        })

        return token

    } catch (err) {
        throw err
    }
}

async function generateOTP(user) {
    try {
        //generate otp
        // const otp = otpGenerator.generate(6, {
        //     upperCaseAlphabets: false,
        //     specialChars: false,
        // })
        // const otp = otpGenerator.generate(6)
        const otp_length = 6
        var digits = "0123456789";
        let OTP = "";
        for (let i = 0; i < otp_length; i++) {
          OTP += digits[Math.floor(Math.random() * 10)];
        }

        //change DB to require OTP & add otp
        user.otp = OTP
        user.otpRequired = true
        const newUser = await user.save()
        return newUser
    } catch (err) {
        throw err
    }
}


//otp auth 
exports.signInWithOTP = (req, res) => {
    
    if (!req.user) {
        return res.status(500).send({message: "Internal Server Error Occured: user req"})
    }

    const user = req.user

    //test if otp is requested
    if (!user.otpRequired) {
        return res.status(200).send({message: "Otp was not requested.", status: false})
    }

    compareOTP(user, req.body.otp)
    .then((status)=>{
        
        if (!status) {
            return res.status(200).send({
                message: "The password was not correct",
                status: false
            })
        }
        
        generateKeyToken(user)
        .then(token=> {
            return res.status(200).send({token: token, status: true})
        })
        .catch(err=> {
            console.error(err)
            return res.status(500).send({message: "Internal Server Error Occured"})
        })
    })
    .catch(err=>{
        console.error(err)
        return res.status(500).send({message: "Internal Server Error Occured"})
    })

}

async function compareOTP(user, otp) {
    try {
        const result = otp === user.otp
        
        if (!result) {
            console.log("setting comparison to false")
            return false
        }
        user.otpRequired = false
        user.otp = ""
        const newUser = await user.save()
        return true
    } catch (err) {
        throw err
    }
}

async function generateKeyToken(user) {
    try {
        var token = jwt.sign({
            userID: user._id,
            authorized: false,
            keyAuthorized: true,
            otpAuthorized: true
        }, config.jwtSecret, {
            expiresIn: 600  //short lived 10 minute token
        })

        return token

    } catch (err) {
        throw err
    }
}

//collect public key to complete new user registration
exports.supplyPublicKey = (req, res) => {
    //this method is to be executed only after middleware [token, userNotSetup]
    var user = req.user

    if (req.userAccountIsSetup === false) {
        //new user - populate the public key field
        user.publicKey = req.body.publicKey
        user.save()
    } else {
        //test that keys are same
        if (user.publicKey !== req.body.publicKey) {
            return res.status(401).send({message: "Unauthorized. Provided secret does not match one on account."})
        }
    }

    //return a JWT with authorized: true and longer lifetime
    var token = jwt.sign({
        userID: user._id,
        authorized: true,
        keyAuthorized: true,
        otpAuthorized: true
    }, config.jwtSecret, {
        expiresIn: 1800  //short lived 10 minute token
    })

    return res.status(200).send({token: token})

}

exports.userAccountIsSetup = (req, res) => {
    return res.status(200).send({status: req.userAccountIsSetup})
}

//--------EMAILING----------

//nodemailer transporter
const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
        user: gmailAddress,
        pass: gmailAppPassword,
    },
    secure: true,
    tls: {
        rejectUnauthorized: true    //reject non-encrypted emailing
    }
})

//async function that handles nodemailer email departure
async function sendOTPEmail(user) {
    return new Promise((resolve, reject)=> {
        const mailData = {
            from: gmailAddress,
            to: user.email,
            subject: otpEmailSubject,
            text: getEmailOTPMessage(user.otp, user.email)
        }
        
        transporter.sendMail(mailData, (error, info)=> {
            if (error) {
                console.log(error)
                reject(false)
            }
            resolve(user)
        })
    })
}