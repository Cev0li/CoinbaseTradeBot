
const sortByTicker = (arr, tickerString) => {
  return arr.filter((object) => object.token == tickerString)
}

const reduceToCandle = (arr) => {
  return arr.reduce((prev, current) => (prev + current.num), 0)/arr.length
}

//arr cbAccounts
const accountUpdate = (arr, cbClient) => {
  cbClient.getAccounts(async (e, d) => {

    if(e){
         return callback('Client not initalized, check API entries.')
    } 

    let data = await JSON.parse(d.body)

    for(let i = 0; i < data.length - 1; i++){
        if(data[i].balance > .0001){
            arr.push({
                id: data[i].id,
                wallet: data[i].currency,
                balance: data[i].balance
            })
        }
    }
  })

  return arr
}

//arr1 orderIds; arr2 orders; arr3 fills
const sortOrders = (arr1, arr2, arr3, cbClient) => {
  if(arr1.length > 0){
  arr1.forEach((id, i) => 
    cbClient.getOrder(id, async(e, r) => {
      if(e){return}

      const order = await JSON.parse(r.body)

      if(order.side == 'buy' && order.status == 'open'){
        arr2.push(order)
        return arr1.splice(i, 1)
      }
    
      if(order.side == 'buy' && order.status == 'done'){
        arr3.push(order)
        return arr1.splice(i, 1)
      }
    }
  ))}
}

//arr1 orders; arr2 fills
const ordersToFills = (arr1, arr2, cbClient) => {
  if(arr1.length > 0){
    arr1.forEach((order, i) => {
      cbClient.getOrder(order.id, async(e, r) => {
        if(e){return}

        const order = await JSON.parse(r.body)

        if(order.status == 'done'){
          arr2.push(order)
          return arr1.splice(i, 1)
        }
      })
    })
  }
}

module.exports = {
  sortByTicker,
  reduceToCandle,
  accountUpdate,
  sortOrders,
  ordersToFills
}
