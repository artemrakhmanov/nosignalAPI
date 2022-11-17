const mongoose = require('mongoose')

const Message = mongoose.model(
    "Message",
    new mongoose.Schema({
        messageID: String,
        senderID: String,
        receiverID: String,
        timestamp: String,
        body: String
    })
)

module.exports = Message