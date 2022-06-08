const socket = io()

const $price = document.querySelector('#price')
const $APIinfo = document.querySelector('#APIinfo')
const $clientInit = document.querySelector('#clientInit')
const $accounts = document.querySelector('#accounts')
const $buyForm = document.querySelector('#buyForm')
const $openOrders = document.querySelector('#openOrders')
const $filledOrders = document.querySelector('#filledOrders')

socket.on('price', (btcCandle, atomCandle) => {
    if(typeof btcCandle === 'string'){
        $price.textContent = btcCandle
    } else {
        const renderBtcPrice = btcCandle.price.toString()
        const renderAtomPrice = atomCandle.price.toString()
        $price.innerHTML = 'BTC PRICE: ' + renderBtcPrice.slice(0, renderBtcPrice.indexOf('.') + 3) + '<br>ATOM PRICE: ' + renderAtomPrice.slice(0, renderAtomPrice.indexOf('.') + 3)
    }
})

socket.on('accounts', (arr) => {
    $accounts.innerHTML = '<ul>' + arr.map(obj => `<li> ${obj.wallet}: ${obj.balance}</li>`).join(' ') + '</ul>'
})

socket.on('orderUpdates', (openOrders, filledOrders) => {

    if(filledOrders.length > 0){
    $filledOrders.innerHTML = filledOrders.map(obj => `<p> ${obj.product_id}- size: ${obj.size.slice(0, obj.size.indexOf('.') + 5)} value: $${obj.executed_value.slice(0, obj.executed_value.indexOf('.'))}</p>`).join(' ')
    } else { $filledOrders.innerHTML = 'No open positions...'}

    if(openOrders.length > 0){
        $openOrders.innerHTML = openOrders.map(obj => `<p>Position: ${obj.product_id}- size: ${obj.size.slice(0, obj.size.indexOf('.') + 5)} target price: $${obj.price.slice(0, obj.price.indexOf('.'))} </p>`).join(' ')
    } else { $openOrders.innerHTML = 'No open orders...'}
})

$APIinfo.addEventListener('submit', (e) => {
    e.preventDefault()

    const APIkey = e.target.elements.APIkey.value
    const APIsecret = e.target.elements.APIsecret.value
    const APIpass = e.target.elements.APIpass.value
    const APIURI = e.target.elements.APIURI.value
    const clientInitalizer = {
        APIkey,
        APIsecret,
        APIpass,
        APIURI
    }

    socket.emit('credentials', clientInitalizer, (error) => {
        if(error){
            return $clientInit.textContent = error
        }

        $clientInit.textContent = 'Coinbase client is ready. Send buy order to initalize trade functions.'
    })
})

$buyForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const price = e.target.elements.price.value
    const size = e.target.elements.size.value
    const product_id = e.target.elements.product.value
    const buyParams = {
        price,
        size,
        product_id
    }

    socket.emit('buy', buyParams, (string) => {
        if(string === 'Buy order unsuccessful.'){return alert(string)}

        $filledOrders.innerHTML = string
        $openOrders.innerHTML = string
    })
})