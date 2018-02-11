<template>
    <div>
        <span v-for="w in words">
            <a :href="`/eg/words/${w}/edit`" target="_blank">{{w}}</a>
        </span>
    </div>
</template>
<script>
  import dictApi from '../apis/DictApi'

  export default {
    data: () => ({
      words: []
    }),
    created () {
      this.reload()
    },
    methods: {
      reload () {
        const vm = this
        dictApi.searchMentioned({})(resp2 => {
          if (resp2.ok) {
            vm.words = resp2.data
          }
        })
      }
    }
  }
</script>
<style scoped lang="less">

    span {
        margin: 2px 4px;
    }
</style>