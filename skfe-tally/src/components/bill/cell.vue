<template>
    <div :class="{cell:true,editing:isEditing,active:isActive}"
         @click="click" @dblclick="dblclick">
        <div v-if="isActive && isEditing">
            <Select v-if="valHints" v-model="curr.val" filterable>
                <Option v-for="h in valHints" :value="h" :key="h">{{ h }}</Option>
            </Select>
            <input v-else v-model="curr.val" @blur="" v-focus2/>
        </div>

        <div v-else :class="valCssClass">{{valFmt(val)}}</div>

    </div>
</template>
<script>
  import currency from 'currency.js'

  export default {
    data: () => ({
      valFmt: x => x,
      valCssClass: null
    }),
    props: {
      name: {type: String},
      editable: {type: Boolean, default: true},
      val: {type: [String, Number]},
      i: {type: Number},
      j: {type: Number},
      // like {i:3,j:5}
      curr: {type: Object, default: {}},
      type: {type: String},
      valFormatter: {type: Function},
      valHints: {type: Array}
    },
    computed: {
      isActive () {
        return this.i === this.curr.i && this.j === this.curr.j
      },
      isEditing () {
        return this.isActive && this.curr.editing
      }
    },
    created () {
      if (this.type === 'CNY') {
        this.valFmt = fmtCNY
        this.valCssClass = 'cny'
      }
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

  function fmtCNY (num) {
    if (!num) return null
    return currency(num).format()
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

    .cny {
        color: #222;
        text-align: right;
    }
</style>