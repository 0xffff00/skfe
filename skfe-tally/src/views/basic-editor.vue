<template>
    <div>
        <Button @click="save">保存</Button>
        <Editor :bill.sync="bill"></Editor>
    </div>
</template>

<script>
  import { merge, clone } from 'ramda'
  import Editor from '../components/bill/editor.vue'
  import TallyApi from '../apis/TallyApi'
  import { defaultRow, today } from '../components/bill/util'

  export default {
    components: {Editor},
    data: () => ({
      bill: {},
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
      this.reload()
    },
    methods: {
      reload () {
        const self = this
        if (this.billId) {
          TallyApi.bills.getting({id: this.billId})(resp2 => {
            self.bill = resp2.data
          })
        } else {
          const row0 = merge(defaultRow, {desc: '上次结欠', type: 'KEY'})
          self.bill = {
            endDate: today(),
            deals: [row0, clone(defaultRow)]
          }
        }
      },
      save () {
        const self = this
      }
    }
  }
</script>
<style scoped>
</style>
