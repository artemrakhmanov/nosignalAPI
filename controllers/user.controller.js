const db = require("../models");
const User = db.user;

//this function handles user object in DB during OTP for new users and existing
exports.handleUserDuringOTP = async (email) => {
    try {
        //find if there exists user with this email
        const user = await User.findOne({email: email})

        return user
    } catch (err) {
        console.error(err)
        //create a new user
        const user = new User({
            email: email,
            otp: "",
            otpRequired: false,
            online: false,
            publicKey: ""
        })
        
        try {
            const newUser = await user.save()
            return newUser
        } catch (newUserError) {
            console.error(newUserError)
            throw newUserError
        }
    }
}