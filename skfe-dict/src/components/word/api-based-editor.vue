<template>
    <Editor :word="word" :editable="editable"
            @addBR="addBR" @delBR="delBR" @addX1R="addX1R" @delX1R="delX1R"
            @jump="jump" @putW="putW"></Editor>
</template>
<script>
  import Editor from './editor.vue'
  import { MsgBox } from 'skfe-ui'

  export default {
    components: {Editor},
    data: () => ({
      word: null,
      editable: true
    }),
    props: {
      text: {type: String},
      // like {words,basicRelations,x1Relations}
      dictApi: {type: Object}

    },
    methods: {
      jump (e) {
        this.$emit('jump', e)
      },
      addBR (name, rel) {
        this.dictApi.basicRelations.posting(rel)(this.notify('新增' + name))
      },
      delBR (name, rel) {
        this.dictApi.basicRelations.deleting(rel)(this.notify('移除' + name))
      },
      addX1R (name, rel) {
        this.dictApi.x1Relations.posting(rel)(this.notify('新增' + name))
      },
      delX1R (name, rel) {
        this.dictApi.x1Relations.deleting(rel)(this.notify('移除' + name))
      },
      putW (word) {
        this.dictApi.words.putting({text: this.text}, word)(this.notify('更新词汇'))
      },
      reload () {
        const self = this
        const text = self.text
        console.log(self.text)
        if (!text) {
          self.$Message.error({content: 'Nothing to reload'})
          return
        }
        self.dictApi.words.getting({text})(resp2 => {
          if (!resp2.ok) {
            MsgBox.open(self, '加载')
            return
          }
          // self.$Message.success({content: '加载成功'})
          self.word = resp2.data
        })
      },
      // notify after action, reload if OK
      notify (actionName) {
        const self = this
        return resp2 => {
          MsgBox.open(self, actionName)(resp2)
          if (resp2.ok) self.reload()
        }
      }
    },
    created () {
      this.reload()
    },
    watch: {
      text () {
        this.reload()
      }
    }
  }
</script>
<style scoped lang="less">

</style>