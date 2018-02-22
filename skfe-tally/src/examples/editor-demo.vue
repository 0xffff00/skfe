<template>
    <div>

        <BillEditor :bill="bill">
        </BillEditor>

    </div>
</template>

<script>
  import BillEditor from '../components/deal/editor.vue'

  export default {
    components: {BillEditor},
    data: () => ({
      bill: {
        baseBalance: 320000,
        deals: [
          {makeDate: '2018-01-11', price: 23.5, volume: 400, amount: 9400, desc: 'xxx'},
          {makeDate: '2018-01-13', price: null, volume: null, amount: 23240, desc: '点点滴滴'},
          {makeDate: '2018-01-14', price: 25, volume: 800, amount: -20000, desc: 'x1'},
          {makeDate: '2018-02-03', price: null, volume: null, amount: 42000, lend: 0, desc: 'aaaa~~~'},
          {makeDate: '2018-04-21', price: 30, volume: 60, amount: -1800, desc: '猜猜猜'},
          {makeDate: '2018-04-22', price: 23.8, volume: 100, amount: 2000, desc: 'ae'},
          {makeDate: '2018-05-01', price: null, volume: null, amount: -6005, desc: '呃呃呃'}
        ]
      }

    }),
    created () {
      for (let i = 0; i < 100; i++) {
        this.deals.push({amount: Math.random() * 60000 - 20000})
      }
    }
  }
</script>
<style scoped>
</style>
