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
  buyer: null,
  seller: null,
  sn: null,
  date: null,
  desc: null,
  price: null,
  volume: null,
  unit: 'KG',
  amount: null,
  type: null
}
const defaultKeyRow = merge(defaultRow, {desc: '上次欠款余额', type: 'KEY', unit: null})
const defaultCurr = {i: null, j: null, editing: false, focus2: true}

const today = () => moment().format('YYYY-MM-DD')

const FIRST_DAY_OF_2000 = moment('2000-01-01')
// differ days since 2000-1-1
const toD2000 = dateStr => moment(dateStr).diff(FIRST_DAY_OF_2000, 'days')

const isoDate2cn = s => moment(s).format('YYYY年MM月DD日')

export { fmtCNY, fmtDefault, defaultRow, defaultKeyRow, defaultCurr, today, isoDate2cn, toD2000 }
