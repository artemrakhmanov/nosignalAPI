const mongoose = require('mongoose')

const Message = mongoose.model(
    "Message",
    new mongoose.Schema({
        senderID: String,
        receiverID: String,
        timestamp: String,
        ivTimestamp: String,
        body: String,
        iv: String
    })
)

module.exports = Message