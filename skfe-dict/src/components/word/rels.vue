<template>
    <span class="b-rels">
        <span class="es es0" v-for="r in rs0">
            <span class="dlmt">,</span>
            <span>
                <a @click="jump(fnToE(r))">{{fnToE(r)}}</a>
                <sup>{{toX(r)}}</sup>
                <a v-if="editing" @click="remove(r)"><Icon color="red" type="close-circled"></Icon></a>
            </span>
        </span>
        <span class="es es8" v-for="e in es8" :key="e">
            <span class="dlmt">,</span>
            <a @click="jump(e)">{{e}}</a>
        </span>
        <span class="es" v-if="editing">
            <span class="dlmt">,</span>
            <input class="adder" :placeholder="'新'+name" title="新增" @keyup.enter="add">
        </span>
    </span>
</template>
<script>
  import { difference } from 'ramda'

  export default {
    computed: {
      fnToE () {
        if (typeof this.toE === 'function') {
          return this.toE
        }
        return r => r[this.toE]
      },
      es0 () {
        return this.rs0.map(this.fnToE)
      },
      // es8 = esa - es0
      es8 () {
        return difference(this.esa, this.es0)
      }
    },
    props: {
      name: {type: String, default: '条目'},
      attr: {type: String},
      esa: {type: Array, default: () => []},
      rs0: {type: Array, default: () => []},
      toE: {type: [String, Function], required: true},
      toX: {type: Function, default: r => r.attrx},
      editing: {type: Boolean, default: true}
    },
    methods: {
      jump (e) {
        this.$emit('jump', e)
      },
      remove (r) {
        this.$emit('remove', this.name, r)
      },
      add (evt) {
        this.$emit('add', this.name, this.attr, this.toE, evt.target.value, this.rs0)
      }
    }
  }
</script>
<style scoped lang="less">
    span.es {

        span.dlmt {
            display: none;
            margin-right: 0.2em;
        }
        input.adder {
            /*border-radius: 4px;*/
            border-width: 0;
            border-bottom: dashed 1px darkgreen;
            width: 7em;
            padding: 0 4px;
        }
        input.adder:FOCUS {
            border-width: 0;
        }
        sup {
            color: #a9c0f2;
        }
    }

    span.es + span.es > .dlmt {
        display: inline;
    }

    span.es.es8 {
        a {
            font-weight: normal;
        }
    }

    span.es.es0 {
        a {
            font-weight: bold;
        }
    }


</style>