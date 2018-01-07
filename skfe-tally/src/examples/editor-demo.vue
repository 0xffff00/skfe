<template>
    <div>

        <BillEditor :lastBalance="lastBalance" :deals="deals">
        </BillEditor>

    </div>
</template>

<script>
  import BillEditor from '../components/bill/editor.vue'

  export default {
    components: {BillEditor},
    data: () => ({
      lastBalance: 320000,
      deals: [
        {date: '2018-01-11', price: 23.5, weight: 400, borrow: 0, lend: 9400, desc: 'xxx'},
        {date: '2018-01-13', price: null, weight: null, borrow: 0, lend: 23240, desc: '点点滴滴'},
        {date: '2018-01-14', price: 25, weight: 800, borrow: 0, lend: 20000, desc: 'x1'},
        {date: '2018-02-03', price: null, weight: null, borrow: 42000, lend: 0, desc: 'aaaa~~~'},
        {date: '2018-04-21', price: 30, weight: 60, borrow: 0, lend: 1800, desc: '猜猜猜'},
        {date: '2018-04-22', price: 23.8, weight: 100, borrow: 2000, lend: 2380, desc: 'ae'},
        {date: '2018-05-01', price: null, weight: null, borrow: 6000, lend: 13100, desc: '呃呃呃'}
      ]
    }),
    created () {

    }
  }
</script>
<style scoped>
</style>
