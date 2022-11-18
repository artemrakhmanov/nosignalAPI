//imports of middlewares
const { verifyKeyToken, verifyOTPToken } = require("../middlewares/authJWT");
const { userAccountIsSetup, userAccountNotSetup, getUserAccount } = require("../middlewares/userAccount");
//imports of controllers
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
    app.use(function(req,res,next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    })

    app.post("/auth/requestOTP", controller.requestOTP)

    app.post("/auth/signInWithOTP", [verifyOTPToken, getUserAccount], controller.signInWithOTP)

    app.get("/auth/userIsSetUp", [verifyKeyToken, userAccountIsSetup], controller.userAccountIsSetup)

    app.post("/auth/signInWithKey", [verifyKeyToken, userAccountIsSetup], controller.supplyPublicKey)

}