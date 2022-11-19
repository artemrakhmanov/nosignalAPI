//imports of middlewares
const { verifyKeyToken, verifyOTPToken, verifyToken } = require("../middlewares/authJWT");
const { userAccountIsSetup, userAccountNotSetup, getUserAccount } = require("../middlewares/userAccount");
//imports of controllers
const controller = require("../controllers/chat.controller");

module.exports = function(app) {
    app.use(function(req,res,next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    })

    app.get("/uid", [verifyToken], controller.getOwnUID)

    app.get("/chat/mychats", [verifyToken], controller.getMyChats)

    app.get("/chat/availableusers", [verifyToken], controller.getOtherUsers)

    app.post("/chat/getChat", [verifyToken], controller.getChat)

    app.post("/chat/initialiseChat", [verifyToken], controller.setChatKeys)

    app.post("/chat/sendMessage", [verifyToken], controller.saveMessage)
    app.post("/chat/getMessages", [verifyToken], controller.getMessages)

    // app.post("/auth/requestOTP", controller.requestOTP)

    // app.post("/auth/signInWithOTP", [verifyOTPToken, getUserAccount], controller.signInWithOTP)

    // app.get("/auth/userIsSetUp", [verifyKeyToken, userAccountIsSetup], controller.userAccountIsSetup)

    // app.post("/auth/signInWithKey", [verifyKeyToken, userAccountIsSetup], controller.supplyPublicKey)

}