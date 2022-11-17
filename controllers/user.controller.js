const db = require("../models");
const User = db.user;

//this function handles user object in DB during OTP for new users and existing
exports.handleUserDuringOTP = async (email) => {
    try {
        //find if there exists user with this email
        var user = await User.findOne({email: email}).exec()
        if (!user) {
            user = new User({
                email: email,
                otp: "",
                otpRequired: false,
                online: false,
                publicKey: ""
            })

            user = await user.save()
        }
        return user
    } catch (err) {
        throw err
    }
}

