const { mongoose } = require("../models")
const db = require("../models")
const User = db.user
const Chat = db.chat
const Message = db.message

exports.getOwnUID = (req, res) => {
    res.status(200).send({status: true, userID: req.userID})
}

exports.getMyChats = (req, res) => {
    const uid = req.userID
    //query chats by userID1 or userID2
    queryMyChats(uid)
    .then((chats)=> {
        return res.status(200).send({status: true, chats: chats})
    })
    .catch(error => {
        console.log(error)
        return res.status(500).send({message: "Internal Server Error"})
    })
}

async function queryMyChats(userID) {
    try {
        const userID1Chats = await Chat.find({userID1: userID}).exec()
        console.log("userid1 chats", userID1Chats)
        
        const userID2Chats = await Chat.find({userID2: userID}).exec()
        console.log("userid2 chats", userID2Chats)

        return userID1Chats.concat(userID2Chats)
    } catch (error) {
        throw error
    }
}

exports.getOtherUsers = (req, res) => {
    const uid = req.userID
    queryUsers(uid)
    .then((users)=> {
        return res.status(200).send({status: true, users: users})
    })
    .catch(error => {
        console.log(error)
        return res.status(500).send({message: "Internal Server Error"})
    })
}

async function queryUsers(userID) {
    try {

        const users = await User.find({ 
            publicKey: { $ne: "" },
            _id: { $ne: mongoose.Types.ObjectId(userID)}
        }).exec()

        console.log(users)

        return users

    } catch (error) {
        throw error
    }
}

exports.getChat = (req, res) => {
    const receiverUser = req.body.receiverUser
    const myUserID = req.userID

    console.log("receiver:", receiverUser)

    retrieveMe(myUserID)
    .then(myUserObject => retrieveChat(myUserObject, receiverUser))
    .then(chat => {
        return res.status(200).send({status: true, chat: chat})
    })
    .catch(err=> {
        return res.status(500).send({message: "Internal Server Error"})
    })
}

async function retrieveMe(userID) {
    try {
        var user = await User.findById(userID).exec()
        console.log(user)
        if (!user) {
            console.log("NO USER")
        }
        return user
    } catch (error) {
        console.log(error)
        throw error
    }
}

async function retrieveChat(user, receiverUser) {
    try {
        var chat = await Chat.findOne({userID1: user._id, userID2: receiverUser._id})
        var chat2 = await Chat.findOne({userID2: user._id, userID1: receiverUser._id})
        console.log("ATTENTION", chat, chat2)
        if (!chat && !chat2) {
            //no chats found, need to generate
            var newChat = new Chat({
                userEmail1: user.email,
                userEmail2: receiverUser.email,
                userID1: user._id,
                userID2: receiverUser._id,
                encryptedChatKey1: "",
                encryptedChatKey2: "",
                publicKey1: user.publicKey,
                publicKey2: receiverUser.publicKey,
                messages: []
            })

            newChat = await newChat.save()

            return newChat
        } else {
            var myIndex = 0
            if (chat) {
                return chat
            } else {
                return chat2
            }
        }
    } catch (error) {
        console.log(error)
        throw error
    }
}

exports.setChatKeys = (req, res) => {
    const myIndex = req.body.myIndex
    const myAES = req.body.myAES
    const receiverAES = req.body.receiverAES
    const chatID = req.body.chatID

    setChatKeys(myIndex, myAES, receiverAES, chatID)
    .then(chatObject => {
        console.log("chatobject", chatObject)
        if (!chatObject) {
            //error
            return res.status(403).send({message: "Forbidden operation"})
        }
        return res.status(200).send({status: true, chat: chatObject})
    })
    .catch(err=> {
        return res.status(500).send({message: "Internal error"})
    })
}

async function setChatKeys(myIndex, myAES, receiverAES, chatID) {
    try {
        var chat = await Chat.findById(chatID).exec()
        if (myIndex === 1) {
            if (chat.encryptedChatKey1 !== "") {
                return null
            }
            chat.encryptedChatKey1 = myAES
            chat.encryptedChatKey2 = receiverAES
            chat = chat.save()

            return chat

        } else {
            if (chat.encryptedChatKey2 !== "") {
                return null
            }
            chat.encryptedChatKey2 = myAES
            chat.encryptedChatKey1 = receiverAES
            chat = chat.save()

            return chat
        }
    } catch (error) {
        console.log(error)
        throw error
    }
}

exports.saveMessage = (req, res) => {
    const userID = req.userID
    const cipher = req.body.cipher
    const iv = req.body.iv
    const timeCipher = req.body.timeCipher
    const timeIV = req.body.timeIV
    const senderID = req.body.senderID
    const receiverID = req.body.receiverID
    const chatID = req.body.chatID

    const messageObject = {
        body: cipher,
        iv: iv,
        timestamp: timeCipher,
        ivTimestamp: timeIV,
        senderID: senderID,
        receiverID: receiverID
    }

    getChat(chatID)
    .then(chat=> appendMessage(chat, messageObject))
    .then(result=> {
        console.log(result)
        return res.status(200).send({stauts: true, messages: result.messages})
    })
    .catch(err=> {
        console.log(err)
        return res.status(500).send({message: "Internal error"})
    })

}

async function getChat(chatID) {
    try {
        const chat = await Chat.findById(chatID).exec()
        return chat
    } catch {
        throw error
    }
}

async function appendMessage(chat, messageObject) {
    try {
        chat.messages.push(messageObject)
        chat = await chat.save()
        return chat
    } catch(error) {
        throw error
    }
}

exports.getMessages = (req, res) => {
    const chatID = req.body.chatID
    getChat(chatID)
    .then(result=> {
        console.log(result)
        return res.status(200).send({status: true, messages: result.messages})
    })
    .catch(err=> {
        console.log(err)
        return res.status(500).send({message: "Internal error"})
    })
}
