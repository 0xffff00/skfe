<template>
    <div>
        <div class="opt-pane">
            <Button type="primary" @click="saveMe">保存</Button>
            <Button type="warning" @click="printMe">打印</Button>
        </div>
        <div class="editor-box">
            <Editor :bill.sync="bill" :allBuyers="allBuyers">
                <div slot="input-buyer">
                    <Button size="small" :style="{minWidth:'120px'}" @click="selectBuyerModal=true">
                        {{bill.mainBuyer}}
                    </Button>

                </div>
            </Editor>
        </div>
        <Modal title="请选择一个客户" v-model="selectBuyerModal" closable>
            <h4>输入新客户名：</h4>
            <Input v-model="bill.mainBuyer"></Input>
            <h4>或选择一个已存在的客户：</h4>
            <div>
                <Button size="small" v-for="b in allBuyers" @click="selectBuyer(b.hanzi)">{{b.hanzi}}</Button>
            </div>
        </Modal>
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
      billId: null,
      allBuyers: [],
      selectBuyerModal: false
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
          if (!vm.billId) vm.selectBuyerModal = true
        }
      })
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
      },
      selectBuyer (buyer) {
        const vm = this
        this.bill.mainBuyer = buyer
        TallyApi.bills.gettingSome({mainBuyer: buyer, o: '-id', l: 1})(resp2 => {
          if (resp2.data && resp2.data.length) {
            let lastBill = resp2.data[0]
            // vm.bill.baseBalance = lastBill.finalBalance
            vm.bill.deals[0].amount = lastBill.finalBalance
            vm.bill.startDate = lastBill.endDate
            vm.selectBuyerModal = false
          }
        })
      }
    }
  }
</script>
<style lang="less">
    .editor-box {
        margin-top: 40px;
    }

    .opt-pane {
        position: fixed;
        right: 8px;
        top: 8px;
    }

    /*@media screen {*/
    /*.ivu-menu {*/
    /*display: block;*/
    /*}*/
    /**/
    /*}*/

    @media print {
        .ivu-menu {
            display: none;
        }

        .opt-pane {
            display: none;
        }
    }
</style>
