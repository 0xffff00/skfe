<template>
    <TableMan :data="data" :ui.sync="ui" :model="model" :querier="querier">

    </TableMan>

</template>
<script>
  import { TableMan } from 'skfe-ui'
  import TallyApi from '../apis/TallyApi'

  export default {
    components: {TableMan},
    data: () => ({
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
        api: TallyApi.bills,
        name: '账单',
        columnDefault: {
          required: false,
          editable: true,
          sortable: true,
          type: 'string'
        },
        columns: [
          {
            key: 'id',
            title: '#',
            required: true,
            sortable: true
          },
          {
            key: 'startDate',
            title: '开始日期'
          },
          {
            key: 'endDate',
            title: '结束日期'
          },
          {
            key: 'mainBuyer',
            title: '买家'
          },
          {
            key: 'mainSeller',
            title: '卖家'
          },
          {
            key: 'baseBalance',
            title: '初始余额'
          },
          {
            key: 'finalBalance',
            title: '结束余额'
          },
          {
            title: '操作',
            key: 'action',
            'sk-template': 'action',
            sk2template: 'action',
            sk2actions: ['edit', 'delete']
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
    })
  }
</script>