import config from '../conf'
import { RestApi } from 'skfe-ui'

const CTX = config.tallyApiUrl || ''
const deals = RestApi.of(CTX + '/deals/', '{id}')
deals.batchSave = (queries, data) => RestApi.of(CTX + '/deals/batch' + RestApi.toQVarStr(queries)).putting(null, data)

deals.getBalance = queries => RestApi.of(CTX + '/deals/balance' + RestApi.toQVarStr(queries)).getting(null)
deals.allBuyers = RestApi.of(CTX + '/deals/buyers').getting(null)
deals.buyers3cnts = RestApi.of(CTX + '/deals/buyers/3cnts').getting(null)

export default {deals}
