<template>
    <div>
        <h1>iView Select2: mentioned</h1>
        <Select v-model="select1.val" filterable remote :remote-method="refreshSelect1"
                :style="{width:'10em'}"
                :loading="select1.loading">
            <Option v-for="(opt, k) in select1.opts" :value="opt" :key="k">{{opt}}</Option>
        </Select>
        <h1>iView Select2: mft（instOf 高校）</h1>
        <Select v-model="select2.val" filterable remote :remote-method="refreshSelect2"
                :style="{width:'10em'}" size="small"
                :loading="select2.loading">
            <Option v-for="(opt, k) in select2.opts" :value="opt" :key="k">{{opt}}</Option>
        </Select>
        <h1>MftInput Wrapped:（instOf 高校）</h1>
        <MftInput v-model="com3.val" placeholder="高校" :dictApi="com3.dictApi" :otherMft="com3.otherMft"></MftInput>
    </div>
</template>
<script>
  import dictApi from '../apis/DictApi'
  import MftInput from '../components/search/mft-input.vue'

  export default {
    components: {MftInput},
    data: () => ({
      select1: {
        val: '',
        loading: false,
        opts: []
      },
      select2: {
        val: '',
        loading: false,
        opts: []
      },
      com3: {
        val: '',
        otherMft: [{f: 'instOf', v: '高校'}],
        dictApi: dictApi
      }
    }),
    created () {
    },
    methods: {
      refreshSelect1 (q) {
        const vm = this
        if (q !== '') {
          vm.select1.loading = true
          dictApi.searchMentioned({text_K: q})(resp2 => {
            if (resp2.ok) {
              vm.select1.opts = resp2.data
              vm.select1.loading = false
            }
          })
        } else {
          vm.select1.opts = []
        }
      },
      refreshSelect2 (q) {
        const vm = this
        if (q !== '') {
          vm.select2.loading = true
          const mft = [{o: 'K', v: q}, {f: 'instOf', v: '高校'}]
          dictApi.searchMft(mft)(resp2 => {
            if (resp2.ok) {
              vm.select2.opts = resp2.data
              vm.select2.loading = false
            }
          })
        } else {
          vm.select2.opts = []
        }
      }
    }
  }
</script>
<style scoped lang="less">

    span {
        margin: 2px 4px;
    }
</style>