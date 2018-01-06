<template>
    <ApiBasedEditor :text="text" :dictApi="dictApi" @jump="jump"></ApiBasedEditor>
</template>
<script>
  import dictApi from '../apis/DictApi'
  import ApiBasedEditor from '../components/word/api-based-editor.vue'

  export default {
    components: {ApiBasedEditor},
    data: () => ({
      dictApi: dictApi,
      text: null
    }),
    created () {
      let params = this.$route.params
      console.log('ccc')
      this.text = params.text
    },
    methods: {
      link (w) {
        return `../${w}/edit`
      },
      jump (e) {
        // console.log('j3', e, this.$route, this.$router)
        this.text = e
        this.$router.push(`../${e}/edit`)
      }
    }
  }
</script>