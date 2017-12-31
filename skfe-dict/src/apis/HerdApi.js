import config from '../libs/config'
import {RestApi} from 'skfe-ui'

const CTX = config.herdApiUrl

const getUrlByHash = function (hash, cacheCategory) {
  return CTX + '/file/' + hash + '.jpg?cache=' + cacheCategory
}

const mediaRepos = RestApi.of(CTX + '/media-repos/', '{name}')
const mediaFiles = RestApi.of(CTX + '/media-files/', '{path}')
const imageInfos = RestApi.of(CTX + '/image-infos/', '{hash}')

// const listRepos = ajaxList(CTX + '/repos')
// const listMedias = ajaxList(CTX + '/medias')
// const listImageMedias = ajaxList(CTX + '/image-infos')
imageInfos.countByYear = RestApi.of(CTX + '/image-infos/countByYear').httpGet(null)
imageInfos.countByMonth = RestApi.of(CTX + '/image-infos/countByMonth').httpGet(null)
imageInfos.countByDate = RestApi.of(CTX + '/image-infos/countByDate').httpGet(null)

const jobs = {
  batchSync: {
    start: params => RestApi.of(CTX + '/jobs/batch-sync', '?repoName={repoName}').httpPut(params, null),
    status: RestApi.of(CTX + '/jobs/batch-sync/status').httpGet(null),
    statusAll: RestApi.of(CTX + '/jobs/batch-sync/status/all').httpGet(null)
  },
  thumbnail: {
    start: params => RestApi.of(CTX + '/jobs/batch-sync', '?repoName={repoName}').httpGet(params),
    status: RestApi.of(CTX + '/jobs/image/thumbnails/status').httpGet(null)
  },
  mediaRepos: {
    truncate: params => RestApi.of(CTX + '/jobs/media-repos', '?repoName={repoName}').httpDelete(params)
  }
}

export default {
  getUrlByHash,
  mediaFiles,
  imageInfos,
  mediaRepos,
  jobs
}
