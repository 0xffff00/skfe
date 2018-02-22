<template>
    <div>
        <div class="bill-head">
            <BuyerSelect v-model="buyer" :allBuyers="allBuyers"></BuyerSelect>

            <DatePicker size="small" type="date" placeholder="开始日期" :value="startDate"
                        @on-change="onChangeStartDate"></DatePicker>
            至
            <DatePicker size="small" type="date" placeholder="结束日期" :value="endDate"
                        @on-change="onChangeEndDate"></DatePicker>

        </div>
        <div class="bill-main">
            <Editor :deals="deals" :allBuyers="allBuyers" :startDate="startDate" :endDate="endDate">
            </Editor>
        </div>
    </div>

</template>

<script>
  import CONFIG from '../conf'
  import { merge, clone } from 'ramda'
  import Editor from '../components/deal/editor.vue'
  import TallyApi from '../apis/TallyApi'
  import { defaultRow, today, isoDate2cn } from '../components/deal/util'
  import { MsgBox } from 'skfe-ui'

  export default {
    components: {Editor},
    data: () => ({
      buyer: null,
      startDate: null,
      endDate: today(),
      deals: [],
      allBuyers: []
    }),
    computed: {
      sellerInfo () {
        return CONFIG.sellerInfo
      }
    },
    props: {},
    watch: {},
    created () {
      const vm = this
      let params = this.$route.params
      this.billId = parseInt(params.billId)

      TallyApi.deals.allBuyers(resp2 => {
        if (resp2.data) {
          let arr = resp2.data
          for (let i = 0; i < arr.length; i++) {
            let pys = arr[i].pinyin.split(',')
            arr[i].py2 = pys.join('')
            arr[i].py1 = pys.map(s => s[0]).join('')
          }
          vm.allBuyers = arr
        }
      })
    },
    methods: {
      isoDate2cn: isoDate2cn,
      reload () {
        const self = this
        if (this.billId) {
          TallyApi.bills.getting({id: this.billId})(resp2 => {
            self.bill = resp2.data
          })
        } else {
          self.endDate = today()
        }
      },
      onChangeStartDate (v) {
        this.startDate = v
      },
      onChangeEndDate (v) {
        this.endDate = v
      }
    }
  }
</script>
<style scoped lang="less">
    .bill-head {

        h1 {
            text-align: center;
        }
        h2 {
            text-align: center;
        }
        p {
            margin: 4px;
        }
        p.mailTo {
            font-size: 120%;
            /*font-weight: bold;*/
        }
        .date {
            font-weight: bold;
        }

    }

    .bill-foot {
        page-break-inside: avoid;
        p {
            margin: 4px 0;
        }
        table.sign {
            border-spacing: 0;
            border-collapse: collapse;
            td {
                min-width: 350px;
                border: dashed 1px grey;
                vertical-align: top;
                height: 120px;
                padding: 4px;
                font-size: 9pt;
                position: relative;
                .qz {
                    font-size: 14pt;
                    color: rgba(0, 0, 0, .4);
                    position: absolute;
                    right: 10px;
                    bottom: 4px;
                    text-align: right;
                }
            }
        }
    }

    .bill-main {
    }

    .opt-pane {
        position: fixed;
        right: 8px;
        top: 8px;
    }

</style>
