const WebSocket = require('ws')
const {reduceToCandle, sortByTicker} = require('./utils/utils')

let candle = []
let btcCandles = ['Functions loading data...']
let atomCandles = ['Functions loading data...']
let endState

const stream = new WebSocket('wss://ws-feed.exchange.coinbase.com')

stream.on('open', () => {
    stream.send(JSON.stringify({
        "type": "subscribe",
        "product_ids": [
            "BTC-USD",
            "ATOM-USD"
        ],
        "channels": [
            "ticker"
        ]
    }))
})

stream.on('message', (data) => {
    let message = JSON.parse(data)
    let num = message.price
    let intervalLength = 2
 
if(message.type == 'subscriptions'){
    console.log('Price feed is live')
}

if(message.type == 'ticker'){
    let time = message.time.slice(14, 16)
    let startState = time
    
    if(endState == startState - 1 && time % intervalLength == 0){

        let BTC = sortByTicker(candle, 'BTC-USD')
        let atom = sortByTicker(candle, 'ATOM-USD')

        let atomCandle =  reduceToCandle(atom)
        let btcCandle = reduceToCandle(BTC)

            atomCandles.push({
                price: atomCandle,
                time: message.time
            })

            btcCandles.push({
                price: btcCandle,
                time: message.time
            })

        candle = []

        console.log('SOCKET.JS FUNCTIONS')
        // console.log(JSON.stringify(atomCandles[atomCandles.length-1]) + ' ATOM CANDLES')
        // console.log(JSON.stringify(btcCandles[btcCandles.length-1]) + ' BTC CANDLES')
    }

    candle.push({
        num: +parseFloat(num),//+parseInt(num),
        token: message.product_id
    })

    endState = time

}})

module.exports = {
    atomCandles,
    btcCandles
}