const WebSocket = require('ws')
const {sortBTC, sortATOM, reduceToCandle} = require('./utils')

let candle = []
let btcCandles = []
let atomCandles = []
let start = 0
let minute = 0

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
    let intervalLength = 7
 
if(message.type == 'subscriptions'){
    console.log('Feed is live')
}

if(message.type == 'ticker'){
    let time = message.time.slice(14, 16)

    if(time % 7 == 0){

        let BTC = sortBTC(candle)
        let atom = sortATOM(candle)

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

        console.log(JSON.stringify(atomCandles[atomCandles.length-1]) + ' ATOM CANDLES')
        console.log(JSON.stringify(btcCandles[btcCandles.length-1]) + ' BTC CANDLES')
    }

    candle.push({
        num: +parseInt(num),
        token: message.product_id
    })

}})

module.exports = {
    atomCandles,
    btcCandles
}