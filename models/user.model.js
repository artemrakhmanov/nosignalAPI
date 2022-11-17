const mongoose = require('mongoose')

const User = mongoose.model(
    "User",
    new mongoose.Schema({
        email: String,
        online: Boolean,
        otp: String,
        otpRequired: Boolean,
        publicKey: String
    })
)

module.exports = User
