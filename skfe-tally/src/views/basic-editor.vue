<template>
    <div>
        <div class="opt-pane">
            <Button type="primary" @click="saveMe">保存</Button>
            <Button type="warning" @click="printMe">打印</Button>
        </div>
        <Editor :bill.sync="bill"></Editor>
    </div>
</template>

<script>
  import { merge, clone } from 'ramda'
  import Editor from '../components/bill/editor.vue'
  import TallyApi from '../apis/TallyApi'
  import { defaultRow, defaultBill, today } from '../components/bill/util'
  import { MsgBox } from 'skfe-ui'

  export default {
    components: {Editor},
    data: () => ({
      bill: clone(defaultBill),
      billId: null
    }),
    props: {},
    watch: {
      billId () {
        this.reload()
      },
      $route () {
        let params = this.$route.params
        this.billId = params.billId
      }
    },
    created () {
      let params = this.$route.params
      this.billId = parseInt(params.billId)
    },
    methods: {
      reload () {
        const self = this
        if (this.billId) {
          TallyApi.bills.getting({id: this.billId})(resp2 => {
            self.bill = resp2.data
          })
        } else {
          self.bill.endDate = today()
        }
      },
      saveMe () {
        const self = this
        // fill bill props
        self.bill.id = self.billId ? self.billId : Date.now()
        self.bill.baseBalance = self.bill.deals[0].amount
        self.bill.finalBalance = self.bill.deals.map(d => d.amount).reduce((s, a) => s + a, 0)
        TallyApi.bills.putting({id: self.bill.id}, self.bill)(resp2 => {
          MsgBox.open(self, '保存账单')(resp2)
          if (resp2.ok) {
            // self.billId = self.bill.id
            self.$router.push({name: 'BillEditor', params: {billId: self.bill.id}})
          }
        })
      },
      printMe () {
        window.print()
      }
    }
  }
</script>
<style lang="less">
    @media screen {
        .ivu-menu {
            display: block;
        }

        .opt-pane {
            display: block;
        }
    }

    @media print {
        .ivu-menu {
            display: none;
        }

        .opt-pane {
            display: none;
        }
    }
</style>
