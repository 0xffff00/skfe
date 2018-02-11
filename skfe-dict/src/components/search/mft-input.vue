<template>
    <div>
        <Select v-model="value" filterable remote :remote-method="refreshSelect"
                :style="{width:'15em'}" size="small" :placeholder="placeholder"
                :loading="loading">
            <Option v-for="(opt, k) in opts" :value="opt" :key="k">{{opt}}</Option>
        </Select>
    </div>
</template>
<script>
  export default {
    data: () => ({
      loading: false,
      opts: []
    }),
    props: {
      placeholder: {type: String},
      value: {type: String, default: ''},
      dictApi: {type: Object},
      otherMft: {type: Array}
    },
    created () {
    },
    methods: {
      refreshSelect (q) {
        const vm = this
        if (q !== '') {
          vm.loading = true
          const mft = [{o: 'K', v: q}, ...vm.otherMft]
          vm.dictApi.searchMft(mft)(resp2 => {
            if (resp2.ok) {
              vm.opts = resp2.data
              vm.loading = false
            }
          })
        } else {
          vm.opts = []
        }
      }
    }
  }
</script>
<style scoped lang="less">
</style>