<template>
    <div class="rels-box" :style="{display: autoHide && !theRS0.length ?'none':'inline'}">
        <h3 v-if="title">{{title}}</h3>
        <span class="es es0" v-for="r in theRS0">
            <i>,</i>
            <a @click="jump(fnToE(r))">{{fnToE(r)}}</a>
            <sup>{{toX(r)}}</sup>
        </span>
    </div>
</template>
<script>
  export default {
    computed: {
      fnToE () {
        if (typeof this.toE === 'function') {
          return this.toE
        }
        return r => r[this.toE]
      }
    },
    props: {
      title: {type: String, default: null},
      theRS0: {type: Array, default: []},
      toE: {type: [String, Function]},
      toX: {type: Function, default: r => r.attrx},
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
            sup {
                color: #8fbbe6;
                font-size: 9pt;

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