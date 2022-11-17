const db = require("../models")
const User = db.user

userAccountIsSetup = (req, res, next) => {
    const userID = req.userID   //carried over after jwt is generated

    //perform database query to confirm that account is set up (by checking if public key is supplied)
    User.findById(userID).exec()
    .then(user=>{
        if (user) {
            if (user.publicKey === "") {
                req.user = user
                return res.status(200).send({status: "false"})
            } else {
                req.user = user
                return res.status(200).send({status: "true"})
            }
        } else {
            return res.status(400).send({message: "User not found"})
        }
    })
    .catch(err=> {
        return res.status(500).send({message: "Internal Server Error Occured"})
    })

}

userAccountNotSetup = (req, res, next) => {
    const userID = req.userID //carried over after jwt is generated

    //db query that account fields are not yet set up (new account)
    User.findById(userID).exec()
    .then(user=>{
        if (user) {
            if (user.publicKey === "") {
                req.user = user
                return res.status(200).send({status: "false"})
            } else {
                req.user = user
                return res.status(200).send({status: "true"})
            }
                
        } else {
            return res.status(400).send({message: "User not found"})    
        }
    })
    .catch(err=> {
        return res.status(500).send({message: "Internal Server Error Occured"})
    })
}

getUserAccount = (req, res, next) => {
    const userID = req.userID //carried over after jwt is generated
    
    //db query that account fields are not yet set up (new account)
    User.findById(userID).exec()
    .then(user=>{
        if (user) {
            req.user = user
            
            next()
        } else {
            return res.status(500).send({message: "User was not found."})    
        }
    })
    .catch(err=> {
        return res.status(500).send({message: "Internal Server Error Occured"})
    }) 
}

const userAccount = {
    userAccountIsSetup,
    userAccountNotSetup,
    getUserAccount
}

module.exports = userAccount
