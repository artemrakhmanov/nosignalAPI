const mongoose = require('mongoose')

const Chat = mongoose.model(
    "Chat",
    new mongoose.Schema({
        userEmail1: String,
        userEmail2: String,
        userID1: String,
        userID2: String,
        encryptedChatKey1: String,
        encryptedChatKey2: String,
        publicKey1: String,
        publicKey2: String,
        messages: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Message"
            }
        ]
    })
)

module.exports = Chat
