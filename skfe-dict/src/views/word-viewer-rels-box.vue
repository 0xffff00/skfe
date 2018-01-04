<template>
    <div class="rels-box" :style="{display: autoHide && !theESA.length ?'none':'block'}">
        <h3 v-if="title">{{title}}({{theESA.length}})</h3>
        <span class="es es0" v-for="e in theES0" :key="e"><i>,</i><a @click="jump(e)">{{e}}</a></span>
        <span class="es es8" v-for="e in theES8" :key="e"><i>,</i><a @click="jump(e)">{{e}}</a></span>
    </div>
</template>
<script>
  const R = require('ramda')
  export default {
    computed: {
      // ES8=ESA-ES0
      theES8 () {
        return R.difference(this.theESA, this.theES0)
      }
    },
    props: {
      title: {type: String, default: null},
      theESA: {type: Array, default: []},
      theES0: {type: Array, default: []},
      autoHide: {type: Boolean, default: true}
    },
    methods: {
      jump (e) {
        this.$emit('jump', e)
      }
    }
  }
</script>
<style scoped lang="less">
    .rels-box {
        span.es {

            i {
                display: none;
                margin-right: 0.6em;
            }
        }
        span.es + span.es > i {
            display: inline;
        }
        span.es8 {
            a {
                font-weight: normal;
            }
        }
        span.es0 {
            a {
                font-weight: bold;
            }
        }
    }


</style>