const db = require("../models")
const User = db.user

userAccountIsSetup = (req, res, next) => {
    const userID = req.userID   //carried over after jwt is generated

    //perform database query to confirm that account is set up (by checking if public key is supplied)

}

userAccountNotSetup = (req, res, next) => {
    const userID = req.userID //carried over after jwt is generated

    //db query that account fields are not yet set up (new account)
}

const userAccount = {
    userAccountIsSetup,
    userAccountNotSetup
}

module.exports = userAccount
