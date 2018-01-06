<template>
    <div class="rels-box" :style="{display: autoHide && !amount ?'none':'block'}">
        <h3 v-if="title">{{title}}({{amount}})</h3>
        <slot>无</slot>
    </div>
</template>
<script>
  export default {
    props: {
      title: {type: String, default: null},
      amount: {type: Number, default: 0},
      autoHide: {type: Boolean, default: true}
    }
  }
</script>
<style scoped lang="less">
    .rels-box {

    }


</style>