import currency from 'currency.js'
import moment from 'moment'
import { merge, clone } from 'ramda'

const fmtDefault = x => x
const fmtCNY = (num) => {
  if (num === null || num === undefined) return null
  if (num === '') return ''
  return currency(num).format()
}
const defaultRow = {
  date: null,
  desc: null,
  price: null,
  volume: null,
  amount: null,
  type: null
}
const defaultKeyRow = merge(defaultRow, {desc: '上次结欠', type: 'KEY'})
const defaultCurr = {i: null, j: null, editing: false, focus2: true}
const defaultBill = {
  id: null,
  mainSeller: 'DDSSP',
  mainBuyer: null,
  startDate: null,
  endDate: null,
  baseBalance: 0,
  finalBalance: 0,
  memo: null,
  deals: [clone(defaultKeyRow), clone(defaultRow)]
}
const today = () => moment().format('YYYY-MM-DD')

export { fmtCNY, fmtDefault, defaultRow, defaultKeyRow, defaultCurr, defaultBill, today }
