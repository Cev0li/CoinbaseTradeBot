const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const CoinbasePro = require('coinbase-pro')
const {atomCandles, btcCandles} = require('./socket')
const {sortOrders, ordersToFills, accountUpdate} = require('./utils/utils')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))

let key
let secret
let pass
let apiURI
let cbClient = 1
const publicClient = new CoinbasePro.PublicClient()

let cbAccounts = []
let orderIds = []
let orders = []
let fills = []
let sells = []

io.on('connection', (socket) => {

    console.log('New websocket connection')
    io.emit('price', 'Functions loading data...') //Initalize front end price div

    socket.on('credentials', (credentials, callback) => {

        key = credentials.APIkey
        secret = credentials.APIsecret
        pass = credentials.APIpass
        apiURI = credentials.APIURI

        cbClient = new CoinbasePro.AuthenticatedClient(
            key,
            secret,
            pass,
            apiURI
        )

        accountUpdate(cbAccounts, cbClient)
        setTimeout(() => {socket.emit('accounts', cbAccounts)}, 2000)
            
        callback()
    })

    socket.on('buy', (order, callback) => {

        cbClient.buy(order, async(e, r) => {

            if(e){
                console.log(e.data)
                return callback('Buy order unsuccessful.')
            }

            const message = await JSON.parse(r.body)
            orderIds.push(message.id)
            console.log(orderIds)
            callback('Initalizing positions...')
        })
    })

    setInterval(function callback(){

        if(cbClient != 1){
            ordersToFills(orders, fills, cbClient)
            sortOrders(orderIds, orders, fills, cbClient)

                console.log(orders)    
                console.log(fills)
                console.log(sells)
            socket.emit('orderUpdates', orders, fills) //add sells
        }
    }, 10000)
})

setInterval(function callback(){
    io.emit('price', btcCandles[btcCandles.length - 1], atomCandles[atomCandles.length-1])
}, 60000)

server.listen(port, () => {
    console.log('Server up on port ' + port)
})

module.exports = {
    key,
    secret,
    pass,
    apiURI
}
