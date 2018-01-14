import config from '../libs/config'
import { RestApi } from 'skfe-ui'

const CTX = config.tallyApiUrl || ''
const bills = RestApi.of(CTX + '/bills/', '{id}')
const deals = RestApi.of(CTX + '/deals/', '{id}')
deals.allBuyers = RestApi.of(CTX + '/deals/buyers').getting(null)
deals.buyers3cnts = RestApi.of(CTX + '/deals/buyers/3cnts').getting(null)

export default {bills, deals}
