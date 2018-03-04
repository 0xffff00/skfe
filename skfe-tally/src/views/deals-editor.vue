<template>
    <div>
        <div class="opt-pane">
            <Button type="primary" @click="saveMe">保存</Button>
            <Button type="warning" @click="printMe">打印</Button>
        </div>
        <div class="bill-head">
            <BuyerSelect v-model="buyer" :allBuyers="allBuyers" :selectTick="buyerSelectTick"></BuyerSelect>

            <DatePicker size="small" type="date" placeholder="开始日期" :value="startDate"
                        @on-change="resetStartDate"></DatePicker>
            至
            <DatePicker size="small" type="date" placeholder="结束日期" :value="endDate"
                        @on-change="resetEndDate"></DatePicker>

            <Button type="primary" @click="reloadMe">查询</Button>

        </div>
        <div class="bill-main">
            <Editor :deals="deals" :allBuyers="allBuyers" :startDate="startDate" :endDate="endDate"
                    :initBalance="initBalance">
            </Editor>
        </div>
    </div>

</template>

<script>
  import CONFIG from '../conf'
  import { merge, clone } from 'ramda'
  import moment from 'moment'
  import BuyerSelect from '../components/buyer-select.vue'
  import Editor from '../components/deal/editor.vue'
  import TallyApi from '../apis/TallyApi'
  import { defaultRow, today, toD2000 } from '../components/deal/util'
  import { MsgBox } from 'skfe-ui'

  export default {
    components: {Editor, BuyerSelect},
    data: () => ({
      buyer: null,
      seller: CONFIG.sellerInfo.id,
      startDate: null,
      endDate: null,
      deals: [defaultRow],
      initBalance: 0,
      allBuyers: [],
      buyerSelectTick: 0
    }),
    computed: {
      sellerInfo () {
        return CONFIG.sellerInfo
      }
    },
    props: {},
    watch: {
      buyer () {
        this.$router.push({params: {buyer: this.buyer}})
        this.reloadMe()
      },
      $route () {
        // this.buyer = this.$route.params.buyer
      }
    },
    created () {
      const vm = this
      let $rp = vm.$route.params
      vm.buyer = $rp.buyer
      vm.startDate = moment().date(1).format('YYYY-MM-DD')
      vm.endDate = moment().date(1).add(1, 'M').subtract(1, 'd').format('YYYY-MM-DD')
      TallyApi.deals.allBuyers(resp2 => {
        if (resp2.data) {
          let arr = resp2.data
          for (let i = 0; i < arr.length; i++) {
            let pys = arr[i].pinyin.split(',')
            arr[i].py2 = pys.join('')
            arr[i].py1 = pys.map(s => s[0]).join('')
          }
          vm.allBuyers = arr
          if (vm.buyer === 'NA') {
            vm.buyerSelectTick++
          }
        }
      })
      vm.reloadMe()
    },
    methods: {
      reloadMe () {
        const vm = this
        TallyApi.deals.getBalance({
          buyer: vm.buyer,
          seller: vm.seller,
          snMax: toD2000(vm.startDate) * 1000 - 1
        })(resp2 => {
          vm.initBalance = resp2.data
        })
        TallyApi.deals.gettingSome({
          buyer: vm.buyer,
          seller: vm.seller,
          sn_GE: toD2000(vm.startDate) * 1000,
          sn_LE: toD2000(vm.endDate) * 1000 + 999
        })(resp2 => {
          vm.deals = resp2.data
          if (!vm.deals.length) vm.deals = [defaultRow]
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
        if (!vm.endDate) {
          vm.$Message.error('结束日期不能为空')
          return
        }
        let params = {
          buyer: vm.buyer,
          seller: vm.seller,
          snMin: toD2000(vm.startDate) * 1000,
          snMax: toD2000(vm.endDate) * 1000 + 999
        }
        // generate id for deals: id=daysSince1970(date)+'001'
        let date0 = vm.startDate
        let x = 0 // index of same date0
        for (let i = 0; i < vm.deals.length; i++) {
          let d = vm.deals[i]
          d.buyer = vm.buyer
          d.seller = vm.seller
          let date1 = d.date || date0
          if (date1 === date0) x++
          else date0 = date1
          d.sn = toD2000(date1) * 1000 + x
        }
        TallyApi.deals.batchSave(params, vm.deals)(resp2 => {
          MsgBox.open(vm, '保存账单')(resp2)
          vm.reloadMe()
        })
      },
      printMe () {
        let p = this.$route.path
        window.history.pushState(null, null, 'xxxx')
        this.saveMe()
        window.print()
      },
      resetStartDate (v) {
        if (v) this.startDate = v
        this.reloadMe()
      },
      resetEndDate (v) {
        if (v) this.endDate = v
        this.reloadMe()
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
