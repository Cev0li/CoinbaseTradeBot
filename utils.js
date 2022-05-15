

const sortBTC = (arr) => {
  return arr.filter((object) => object.token == 'BTC-USD')
} 

const sortATOM = (arr) => {
  return arr.filter((object) => object.token == 'ATOM-USD')
}

const reduceToCandle = (arr) => {
  return arr.reduce((prev, current) => (prev + current.num), 0)/arr.length
}


module.exports = {
  sortBTC,
  sortATOM,
  reduceToCandle
}
