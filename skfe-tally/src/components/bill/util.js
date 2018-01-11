import currency from 'currency.js'
import moment from 'moment'

const fmtDefault = x => x
const fmtCNY = (num) => {
  if (num === null || num === undefined) return null
  if (num === '') return ''
  return currency(num).format()
}
const defaultRow = {
  makeDate: null,
  desc: null,
  price: null,
  volume: null,
  amount: null,
  type: null
}

const today = () => moment().format('YYYY-MM-DD')

export { fmtCNY, fmtDefault, defaultRow, today }
