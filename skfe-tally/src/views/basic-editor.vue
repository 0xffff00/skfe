<template>
    <div>
        <Editor :id="bill.id"
                :startDate="bill.startDate"
                :endDate="bill.endDate"
                :mainSeller="bill.mainSeller"
                :mainBuyer="bill.mainBuyer"
                :memo="bill.memo"
                :baseBalance="bill.baseBalance"
                :deals="deals">
        </Editor>
    </div>
</template>

<script>
  import Editor from '../components/bill/editor.vue'
  import TallyApi from '../apis/TallyApi'

  export default {
    components: {Editor},
    data: () => ({
      bill: {},
      deals: [],
      billId: {type: Number, default: 0}
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
          TallyApi.deals.gettingSome({billId: this.billId})(resp2 => {
            self.deals = resp2.data
          })
        }
      }
    }
  }
</script>
<style scoped>
</style>
