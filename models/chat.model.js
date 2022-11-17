const mongoose = require('mongoose')

const Chat = mongoose.model(
    "Chat",
    new mongoose.Schema({
        chatID: String,
        userID_1: String,
        userID_2: String,
        encryptedChatKey_1: String,
        encryptedChatKey_2: String,
        publicKey_1: String,
        publicKey_2: String,
        tmpKeyExchange_12: String,
        tmpKeyExchange_21: String,
        messages: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Message"
            }
        ]
    })
)

module.exports = Chat
