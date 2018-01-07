<template>
    <div>
        {{JSON.stringify(curr)}}
        <table>
            <tr>
                <th class="date">日期</th>
                <th class="desc">账务摘要</th>
                <th class="cny">单价(CNY/KG)</th>
                <th class="weight">重量(KG)</th>
                <th class="cny">借方(CNY)</th>
                <th class="cny">贷方(CNY)</th>
                <th class="cny">余额(CNY)</th>
            </tr>

            <tr v-for="(row,i) in rows">
                <td class="date">
                    <Cell name="date" :val="row.date" :i="i" :j="0" :curr="curr" @jumpToCell="jumpToCell"></Cell>
                </td>
                <td class="desc">
                    <Cell name="desc" :val="row.desc" :i="i" :j="1" :curr="curr"
                          @jumpToCell="jumpToCell"></Cell>
                </td>
                <td class="cny">
                    <Cell name="price" type="CNY" :val="row.price" :i="i" :j="2" :curr="curr"
                          @jumpToCell="jumpToCell"></Cell>
                </td>
                <td class="weight">
                    <Cell name="weight" :val="row.weight" :i="i" :j="3" :curr="curr"
                          @jumpToCell="jumpToCell"></Cell>
                </td>
                <td class="cny">
                    <Cell name="borrow" type="CNY" :val="row.borrow" :i="i" :j="4" :curr="curr"
                          @jumpToCell="jumpToCell"></Cell>
                </td>
                <td class="cny">
                    <Cell name="lend" type="CNY" :val="row.lend" :i="i" :j="5" :curr="curr"
                          @jumpToCell="jumpToCell"></Cell>
                </td>
                <td class="cny">
                    <Cell name="balance" type="CNY" :val="balances[i]" :i="i" :j="6" :curr="curr"
                          @jumpToCell="jumpToCell" :editable="false"></Cell>
                </td>

            </tr>

        </table>
    </div>
</template>
<script>
  import moment from 'moment'
  import Cell from './cell.vue'

  export default {
    components: {Cell},
    data: () => ({
      rows: [],
      curr: {i: null, j: null, editing: false},
      inputText: {
        visible: 'block',
        value: null
      },
      colDefs: [
        {name: 'date', editable: true, type: 'date'},
        {name: 'desc', editable: true, type: 'date'},
        {name: 'price', editable: true, type: 'cny'},
        {name: 'weight', editable: true, type: 'weight'},
        {name: 'borrow', editable: true, type: 'cny'},
        {name: 'lend', editable: true, type: 'cny'},
        {name: 'balance', editable: false, type: 'cny'}
      ],
      descHints: ['304', '201', '202', '收到汇款', '开票']
    }),
    props: {
      // like [{date:'2018-01-11',desc:'',price:23.5,weight:400,borrow:0,lend:9400}..]
      lastBalance: {type: Number, default: 0},
      deals: {type: Array, default: []}
    },
    computed: {
      balances () {
        const ds = this.rows
        const N = this.toNum
        let last = N(ds[0].lend) - N(ds[0].borrow)
        let res = [last]
        for (let i = 1; i < ds.length; i++) {
          last = last + N(ds[i].lend) - N(ds[i].borrow)
          res.push(last)
        }
        return res
      }
    },
    created () {
      const self = this
      window.addEventListener('keyup', evt => {
        self.onKeyPress(evt)
      })
      this.reload()
    },
    methods: {
      reload () {
        let row0 = {desc: '上次结欠', lend: this.lastBalance}
        this.rows = [row0, ...this.deals]
      },
      isLegal (i, j) {
        return i >= 0 && i < this.rows.length && j >= 0 && j < this.colDefs.length
      },
      getVal (i, j) {
        return this.rows[i][this.colDefs[j].name]
      },
      setVal (i, j, val) {
        // TODO guess date
        this.rows[i][this.colDefs[j].name] = val
      },
      jumpToCell (i, j, editing) {
        if (this.curr.i === i && this.curr.j === j) {
          if (editing === false) editing = null
        }
        this.finishEditCell()
        if (!this.isLegal(i, j)) return
        this.curr.i = i
        this.curr.j = j
        this.curr.val = this.getVal(i, j)
        if (editing === true) this.curr.editing = true
        if (editing === false) this.curr.editing = false
      },
      finishEditCell () {
        if (this.curr.i === null) return
        // this.curr.editing = false
        // console.log(this.curr)
        this.setVal(this.curr.i, this.curr.j, this.curr.val)
      },
      toNum (obj) {
        let res = parseFloat(obj)
        return isNaN(res) ? 0 : res
      },
      onKeyPress (keyboardEvent) {
        const k = keyboardEvent.code
        // console.log(keyboardEvent)
        let i = this.curr.i
        let j = this.curr.j
        if (i === null) return
        switch (k) {
          case 'ArrowDown':
            this.jumpToCell(i + 1, j)
            break
          case 'ArrowUp':
            this.jumpToCell(i - 1, j)
            break
          case 'ArrowLeft':
            if (!this.curr.editing) this.jumpToCell(i, j - 1)
            break
          case 'ArrowRight':
            if (!this.curr.editing) this.jumpToCell(i, j + 1)
            break
          case 'Enter':
            if (this.curr.editing) {
              this.jumpToCell(i, j)
              this.curr.editing = false
            } else this.curr.editing = true
            break
          case 'Tab':
            this.jumpToCell(i, j + 1)
            break
          case 'Escape':
            this.curr.editing = false
            break
          case 'F2':
            this.curr.editing = true
            break
          default:
        }
      }
    }
  }

  function guessDate (v) {
    if (!v) return null
    v = v.trim()
    let m1 = v.match(/^(\d+)[/-](\d+)$/)
    if (m1) {
      let M = +m1[1] - 1
      let d = +m1[2]
      return moment({M, d}).format('YYYY-MM-DD')
    }
    let m2 = v.match(/^(\d+)[/-](\d+)[/-](\d+)$/)
    if (m2) {
      let y = +m2[1]
      let M = +m2[2] - 1
      let d = +m2[3]
      if (y < 100) y += 2000
      return moment({y, M, d}).format('YYYY-MM-DD')
    }
    return null
  }
</script>
<style scoped lang="less">
    table {
        font-size: 10pt;
        border: solid 1px;
        border-spacing: 0;
        border-collapse: collapse;

        th {
            border: solid 1px grey;
        }
        td {
            border: solid 1px grey;
        }
        td.editing {
            border: solid 2px black;
        }
        .date {
            width: 10em;
        }
        .desc {
            width: 15em;
        }
        .cny {
            width: 6em;
        }
        .weight {
            width: 6em;
        }

        td.weight {
            text-align: right;
        }
    }
</style>