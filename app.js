const fs = require('fs')
const express = require('express')
const https = require('https')
const cors = require('cors')
// const ws = require('ws')

const key = fs.readFileSync('./tls/key.pem')
const cert = fs.readFileSync('./tls/cert.pem')

const app = express()
const corsOptions = {
    origin: 'http://127.0.0.1:3000',
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}
app.use(cors(corsOptions))

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./models")
const dbConfig = require('./config/db.config')

db.mongoose
    .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(()=> {
        console.log("Successfully connected to MongoDB")
        initial()
    })
    .catch(err=> {
        console.error("Connection Error", err)
        process.exit()
    })

function initial() {
    //DB setup fields / check
}

//--------------------------------

//routes
require("./routes/auth.routes")(app)
require("./routes/chat.routes")(app)

var server = https.createServer({
    key: key,
    cert: cert
}, app)

app.get('/', (req, res) => { res.send('this is an secure server') })

server.listen(8000, () => { console.log('listening on 8000') })

// var wss = new ws.WebSocketServer({
//     server: server,
//     path: "/websocket"
// })

// wss.on('connection', function connection(ws) {
//     console.log('connection')
//     ws.on('message', function message(data) {
//         console.log("received some data ", data)
//     })

//     ws.send('something')
// })
