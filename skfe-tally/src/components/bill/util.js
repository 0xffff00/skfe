import currency from 'currency.js'

const fmtDefault = x => x
const fmtCNY = (num) => {
  if (num === null || num === undefined) return null
  if (num === '') return ''
  return currency(num).format()
}
export { fmtCNY, fmtDefault }
