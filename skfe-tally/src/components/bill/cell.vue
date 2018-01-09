<template>
    <div :class="{cell:true,editing:isEditing,active:isActive}"
         @click="click" @dblclick="dblclick" :style="{width:`${width}em`}">
        <div v-if="isActive && isEditing">
            <Select v-if="valHints" v-model="curr.val" filterable>
                <Option v-for="h in valHints" :value="h" :key="h">{{ h }}</Option>
            </Select>
            <input v-else v-model="curr.val" @blur="" :class="valCssClass" v-focus2/>
        </div>

        <div v-else :class="valCssClass">{{valFmt(finalVal)}}</div>

    </div>
</template>
<script>
  import { type } from 'ramda'
  import { fmtCNY, fmtDefault } from './util'

  export default {
    data: () => ({}),
    props: {
      name: {type: String},
      editable: {type: Boolean, default: true},
      val: {type: [String, Number, Function], default: null},
      i: {type: Number},
      j: {type: Number},
      width: {type: Number},
      // like {i:3,j:5}
      curr: {type: Object, default: {}},
      rows: {type: Array, default: []},
      type: {type: String},
      valFormatter: {type: Function, default: fmtDefault},
      valHints: {type: Array}
    },
    computed: {
      isActive () {
        return this.i === this.curr.i && this.j === this.curr.j
      },
      isEditing () {
        return this.isActive && this.curr.editing
      },
      finalVal () {
        if (this.val === null) {
          return this.rows[this.i][this.name]
        }
        if (type(this.val) === 'String') {
          return this.rows[this.i][this.val]
        }
        if (type(this.val) === 'Function') {
          return this.val(this.rows, this.i)
        }
        return null
      },
      valFmt () {
        if (this.type === 'CNY') return fmtCNY
        return this.valFormatter
      },
      valCssClass () {
        if (this.type === 'CNY') return 'cny'
        if (this.type === 'num') return 'num'
        return 'txt'
      }
    },
    created () {
    },
    methods: {
      click () {
        this.$emit('jumpToCell', this.i, this.j, false)
      },
      dblclick () {
        if (this.editable) {
          this.$emit('jumpToCell', this.i, this.j, true)
        }
      }
    },
    directives: {
      focus: {
        inserted: function (el) {
          el.focus()
        }
      },
      focus2: { // focus after select all text
        inserted: function (el) {
          el.select()
          el.focus()
        }
      }
    }
  }


</script>
<style scoped lang="less">
    .cell {
        border-width: 0;
        min-height: 20px;
    }

    .cell.active {
        border: solid 1px #01112f;
        background: rgba(174, 223, 172, .5);
    }

    .cell.editing {
        border: dashed 1px #01112f;
    }

    input {
        border-width: 0;
        width: 100%;
        background: rgba(220, 164, 182, 0.5);
    }

    .txt {

    }

    .num {
        text-align: right;
    }

    .cny {
        color: #222;
        text-align: right;
    }
</style>