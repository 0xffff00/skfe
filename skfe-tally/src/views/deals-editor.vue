<template>
    <div>
        <div class="opt-pane">
            <Button type="primary" @click="saveMe">保存</Button>
            <Button type="warning" @click="printMe">打印</Button>
        </div>
        <div class="bill-head">
            {{buyer}}

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
  import BuyerSelect from '../components/buyer-select.vue'
  import Editor from '../components/deal/editor.vue'
  import TallyApi from '../apis/TallyApi'
  import { defaultRow, today, toD2000 } from '../components/deal/util'
  import { MsgBox } from 'skfe-ui'

  export default {
    components: {Editor, BuyerSelect},
    data: () => ({
      buyer: null,
      startDate: null,
      endDate: today(),
      deals: [defaultRow],
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
      reloadMe () {
        const vm = this
        const params = {buyer: vm.buyer, date_GE: vm.startDate, date_LE: vm.endDate}
        TallyApi.deals.gettingSome(params)(resp2 => {
          vm.deals = resp2.data
        })
      },
      saveMe () {
        const vm = this
        if (!vm.buyer) {
          vm.$Message.error('客户名不能为空')
          return
        }
        if (!vm.startDate) {
          vm.$Message.error('开始日期不能为空')
          return
        }
        let params = {dateMin: vm.startDate, dateMax: vm.endDate, buyer: vm.buyer}
        // generate id for deals: id=daysSince1970(date)+'001'
        let date0 = vm.startDate
        let x = 0 // index of same date0
        for (let i = 0; i < vm.deals.length; i++) {
          let d = vm.deals[i]
          d.buyer = vm.buyer
          let date1 = vm.date || date0
          if (date1 === date0) x++
          else date0 = date1
          vm.id = toD2000(date1) * 1000 + x
        }
        vm.deals.forEach(d => {
          d.buyer = vm.buyer

          d.id = d.date
        })
        TallyApi.deals.batchPut(params, vm.deals)(resp2 => {
          MsgBox.open(self, '保存账单')(resp2)
          vm.reloadMe()
        })
      },
      printMe () {
        let p = this.$route.path
        window.history.pushState(null, null, 'xxxx')
        this.saveMe()
        window.print()
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
        /*position: fixed;*/
        right: 8px;
        top: 8px;
    }

</style>
