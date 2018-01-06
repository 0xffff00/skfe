<template>
    <div>
        <TableMan :data="data" :ui.sync="ui" :model="model"
                  :querier="querier">
            <div slot="criteria-pane">
                <Button @click="batchSync.startHeartbeatTick++">查看当前任务</Button>
            </div>
        </TableMan>
        <AsyncProgressBox name="同步媒体库" :apis="batchSync.apis"
        :params="batchSync.params"
        :start-tick="batchSync.startTick"
        :start-heartbeat-tick="batchSync.startHeartbeatTick">
        </AsyncProgressBox>
    </div>
</template>
<script>
  import herdApi from '../apis/herd-api'
  import Dates from '../utils/Dates'
  import TextUtils from '../utils/Texts'
  import Arrays from '../utils/Arrays'
  import { AsyncProgressBox, TableMan } from 'skfe-ui'

  export default {
    components: {TableMan, AsyncProgressBox},
    data () {
      return {
        batchSync: {
          startTick: 0,
          startHeartbeatTick: 0,
          params: null,
          apis: herdApi.jobs.batchSync

        },
        data: {
          result: {
            items: [],
            totalCount: 0
          },
          editor: {
            item: {},
            itemOld: null,
            itemDefault: {}
          },
          deleter: {
            item: null,
            items: []
          }
        },
        querier: {
          orderBy: null,
          pageNum: 1,
          pageSize: 10,
          criteria: []
        },
        model: {
          api: herdApi.mediaRepos,
          name: '仓库',
          columnDefault: {
            required: false,
            editable: true,
            sortable: true,
            type: 'string'
          },
          columns: [
            {
              key: 'name',
              title: '名称',
              sortable: true
            },
            {
              key: 'path',
              title: '绝对路径',
              sortable: true
            },
            {
              key: 'state',
              title: '状态',
              sk2template: 'state'
            },
            {
              key: 'fileCnt',
              title: '文件数',
              sortable: false,
              editable: false
            },
            {
              key: 'imgCnt',
              title: '图像数',
              sortable: false,
              editable: false
            },
            {
              title: '操作',
              key: 'action',
              sk2template: 'action',
              sk2actions: [
                'edit',
                'delete',
                {actionName: '同步', actionFunc: this.startBatchSyncByRepo},
                {actionName: '清空', actionFunc: this.truncateRepo}
              ]
            }
          ]
        },
        ui: {
          loadTick: 0,
          saving: false,
          loading: false,
          editing: false,
          editorLabelWidth: '140px',
          editorTitle: '',
          deleteConfirming: false
        }

      }
    },
    computed: {},
    methods: {
      startBatchSyncByRepo (repo) {
        let self = this
        self.batchSync.params = {repoName: repo.name}
        self.batchSync.startTick++
      },
      truncateRepo (repo) {
        const self = this
        herdApi.jobs.mediaRepos.truncate({repoName: repo.name})(resp2 => {
          console.log(resp2)
          if (resp2.ok) {
            self.$Notice.success({title: `清空${repo.name}成功`, message: `删除${resp2.data}条记录`})
          } else {
            self.msgBox.show(resp2)
          }
        })
      }
    }
  }
</script>
<style scoped>

</style>
