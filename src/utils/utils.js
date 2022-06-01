
const sortByTicker = (arr, tickerString) => {
  return arr.filter((object) => object.token == tickerString)
}

const reduceToCandle = (arr) => {
  return arr.reduce((prev, current) => (prev + current.num), 0)/arr.length
}

//arr1 orderIds; arr2 CB response; arr3 orders
const sortOpenOrders = (arr1, arr2, arr3) => {
  for(let i = 0; i < arr1.length; i++){
    for(let j = 0; j < arr2.length; j++){
      if(arr1[i] == arr2[j].id){
      arr3.push(arr2[j])
      arr1.splice(i, 1)
      }
    }
  }
}

//arr1 orders; arr2 CB response; arr3 fills; arr4 orderIds
const sortFilledOrders = (arr1, arr2, arr3, arr4) => {
  for(let i = 0; i < arr1.length; i++){
    for(let j = 0; j < arr2.length; j++){
      if(arr2[j].order_id == arr1[i].id && arr2[j].side == 'buy'){ 
        arr3.push(arr2[j])
        return arr1.splice(i, 1)
      }
    }
  }
}

module.exports = {
  sortByTicker,
  reduceToCandle,
  sortOpenOrders,
  sortFilledOrders
}
