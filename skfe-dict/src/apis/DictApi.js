import config from '../conf'
import { RestApi } from 'skfe-ui'

const CTX = config.dictApiUrl || ''
const words = RestApi.of(CTX + '/words/', '{text}')
const basicRelations = RestApi.of(CTX + '/relations/basic/', 'src={src};attr={attr};no={no}')
const x1Relations = RestApi.of(CTX + '/relations/x1/', 'src={src};attr={attr};no={no}')
x1Relations.batchCreate = params => new RestApi(CTX + '/relations/x1/?batch=true').posting(params)
const searchMft1 = mft => RestApi.of(CTX + '/search/mft/').gettingSome({q: JSON.stringify(mft)})
const searchMft = mft => RestApi.of(CTX + '/search/mft').posting(mft)
const searchMentioned = params => RestApi.of(CTX + '/search/mentioned/').gettingSome(params)

export default {
  words,
  basicRelations,
  x1Relations,
  searchMft,
  searchMentioned
}
