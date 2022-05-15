
const sortByTicker = (arr, tickerString) => {
  return arr.filter((object) => object.token == tickerString)
}

const reduceToCandle = (arr) => {
  return arr.reduce((prev, current) => (prev + current.num), 0)/arr.length
}


module.exports = {
  sortByTicker,
  reduceToCandle
}
