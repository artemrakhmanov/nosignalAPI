const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const db = {};

db.mongoose = mongoose

db.user = require("./user.model")
db.message = require("./message.model")
db.chat = require("./chat.model")

module.exports = db
