<template>
    <div>
        <div class="opt-pane">
            <Button type="primary" @click="saveMe">保存</Button>
            <Button type="warning" @click="printMe">打印</Button>
        </div>
        <div class="bill-head">
            <h1>{{sellerInfo.name}} 货款对账单</h1>
            <!--<h2>货款对账单</h2>-->
            <div class="preview">
                <p class="mailTo">
                    致 <span class="bv">{{bill.mainBuyer}}</span>:
                </p>
                <p>&nbsp;&nbsp;&nbsp;&nbsp;据我方记录,与贵司发生于
                    <span class="date">{{isoDate2cn(bill.startDate)}}</span>至
                    <span class="date">{{isoDate2cn(bill.endDate)}}</span>
                    往来账款明细如下：
                </p>
            </div>
        </div>
        <div class="bill-main">
            <Editor :bill.sync="bill" :allBuyers="allBuyers">
                <div slot="input-buyer">
                    <p class="mailTo">
                        致
                        <Button size="small" :style="{minWidth:'120px'}" @click="selectBuyerModal=true">
                            {{bill.mainBuyer}}
                        </Button>
                        :
                    </p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;据我方记录,与贵司发生于
                        <DatePicker size="small" type="date" placeholder="开始日期" :value="bill.startDate"
                                    @on-change="onChangeStartDate"></DatePicker>
                        至
                        <DatePicker size="small" type="date" placeholder="结束日期" :value="bill.endDate"
                                    @on-change="onChangeEndDate"></DatePicker>
                        往来账款明细如下：
                    </p>
                </div>
            </Editor>
        </div>
        <div class="bill-foot">
            <p>&nbsp;&nbsp;&nbsp;&nbsp;请仔细核对上述账目明细。如无误，请在本函下端右方签字/签章回传。
                如有误，请注明差异金额及原因。望及时准确反馈，多谢合作！</p>
            <table class="sign">
                <tr>
                    <td>
                        <p>供货单位：{{sellerInfo.name}}</p>
                        <p>地址：{{sellerInfo.address}}</p>
                        <p>电话：{{sellerInfo.tel}}</p>
                        <p>传真：{{sellerInfo.fax}}</p>
                        <p class="qz">(签字/签章)</p>
                    </td>
                    <td>
                        <p>收货单位：</p>
                        <p class="qz">(签字/签章)</p>
                    </td>
                </tr>
            </table>

        </div>
        <Modal title="请选择一个客户" v-model="selectBuyerModal" closable>
            <h4>输入新客户名：</h4>
            <Input v-model="bill.mainBuyer"></Input>
            <h4>或选择一个已存在的客户：</h4>
            <div>
                <Button size="small" v-for="b in allBuyers" :key="b.hanzi" @click="selectBuyer(b.hanzi)">
                    {{b.hanzi}}
                </Button>
            </div>
        </Modal>
    </div>

</template>

<script>
  import CONFIG from '../conf'
  import { merge, clone } from 'ramda'
  import Editor from '../components/bill/editor.vue'
  import TallyApi from '../apis/TallyApi'
  import { defaultRow, defaultBill, today, isoDate2cn } from '../components/bill/util'
  import { MsgBox } from 'skfe-ui'

  export default {
    components: {Editor},
    data: () => ({
      bill: clone(defaultBill),
      billId: null,
      allBuyers: [],
      selectBuyerModal: false
    }),
    computed: {
      sellerInfo () {
        return CONFIG.sellerInfo
      }
    },
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
      isoDate2cn: isoDate2cn,
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
      },

      onChangeStartDate (v) {
        this.bill.startDate = v
      },
      onChangeEndDate (v) {
        this.bill.endDate = v
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

    /*@media screen {*/
    /*.ivu-menu {*/
    /*display: block;*/
    /*}*/
    /**/
    /*}*/
    @media screen {
        .preview {
            display: none;
        }
    }

    @media print {
        .preview {
            display: block;
        }

        .ivu-menu {
            display: none;
        }

        .opt-pane {
            display: none;
        }
    }
</style>
