import moment from 'moment'
import { merge, clone } from 'ramda'

const fmtDefault = x => x
const fmtCNY = (num) => {
  if (num === null || num === undefined) return ''
  if (typeof num !== 'number') return num
  let lt0 = num < 0
  let s = String(Math.abs(num).toFixed(2))
  let xDot = s.lastIndexOf('.')
  let n = s.length
  let res = ''
  for (let i = 0; i < xDot - 1; i++) {
    res += s[i]
    if ((xDot - i) % 3 === 1) res += ','
  }
  for (let i = xDot - 1; i < n; i++) res += s[i]
  res = (lt0 ? '-' : '') + res
  return res
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
  mainBuyer: '',
  startDate: null,
  endDate: null,
  baseBalance: 0,
  finalBalance: 0,
  memo: null,
  deals: [clone(defaultKeyRow), clone(defaultRow)]
}
const today = () => moment().format('YYYY-MM-DD')

export { fmtCNY, fmtDefault, defaultRow, defaultKeyRow, defaultCurr, defaultBill, today }
