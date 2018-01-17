<template>
    <div>
        <table>
            <tr>
                <th>客户</th>
                <th>录入账单数</th>
                <th>录入交易笔数</th>
                <th>当前结欠</th>
            </tr>
            <tr v-for="cbb in countByBuyer">
                <td><a @click="showModal1(cbb.buyer)">{{cbb.buyer}}</a></td>
                <td>{{cbb.bill_cnt}}</td>
                <td>{{cbb.deal_cnt}}</td>
                <td>{{fmtCNY(cbb.latest_balance)}}</td>
            </tr>
        </table>
        <Modal v-model="modal1.visible" :title="modal1.buyer+'的所有账单'">
            <div v-for="bill in modal1.bills">
                <a :href="`/bills/${bill.id}/edit`" target="_blank">
                    {{bill.id}}({{bill.startDate}} 至 {{bill.endDate}})</a>
            </div>
            <div slot="footer">

            </div>
        </Modal>
    </div>
</template>
<script>
  import TallyApi from '../apis/TallyApi'
  import { fmtCNY } from '../components/bill/util'

  export default {
    data: () => ({
      countByBuyer: [],
      modal1: {
        buyer: null,
        visible: false,
        bills: []
      }
    }),
    created () {
      this.reload()
    },
    methods: {
      reload () {
        const vm = this
        TallyApi.deals.buyers3cnts(resp2 => {
          vm.countByBuyer = resp2.data
        })
      },
      showModal1 (buyer) {
        const vm = this
        TallyApi.bills.gettingSome({mainBuyer: buyer})(resp2 => {
          vm.modal1.bills = resp2.data
          vm.modal1.buyer = buyer
          vm.modal1.visible = true
        })
      },
      fmtCNY
    }
  }
</script>
<style scoped lang="less">
    table {
        text-align: right;
        border: solid 1px;
        border-spacing: 0;
        font-size: 14pt;
        border-collapse: collapse;
        width: 100%;
        th {
            border: solid 1px grey;
        }
        td {
            border: solid 1px grey;
        }

    }
</style>