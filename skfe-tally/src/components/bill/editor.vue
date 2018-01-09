<template>
    <div>
        <table>
            <thead>
            <tr>
                <th>#</th>
                <th>日期</th>
                <th>账务摘要</th>
                <th>单价(CNY/KG)</th>
                <th>重量(KG)</th>
                <th>借方(CNY)</th>
                <th>贷方(CNY)</th>
                <th>余额(CNY)</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(row,i) in rows">
                <td>{{i}}</td>
                <td v-for="(c,j) in colDefs">
                    <Cell :name="c.name" :type="c.type" :val="valOfColDefs[j]"
                          :i="i" :j="j" :curr="curr" :rows="rows"
                          @jumpToCell="jumpToCell" :width="c.width" :editable="c.editable"></Cell>
                </td>
            </tr>
            </tbody>
            <tfoot>
            <tr>
                <th></th>
                <th>{{rowTotal.makeDate}}</th>
                <th>{{rowTotal.desc}}</th>
                <th></th>
                <th>{{rowTotal.volume}}</th>
                <th class="cny">{{rowTotal.borrow}}</th>
                <th class="cny">{{rowTotal.lend}}</th>
                <th class="cny">{{rowTotal.balance}}</th>
            </tr>
            </tfoot>
        </table>
    </div>
</template>
<script>
  import moment from 'moment'
  import Cell from './cell.vue'
  import { fmtCNY, fmtDefault } from './util'

  export default {
    components: {Cell},
    data: () => ({
      rows: [],
      curr: {i: null, j: null, editing: false},
      colDefs: [
        {name: 'makeDate', type: 'date', width: 8},
        {name: 'desc', type: 'date', width: 15},
        {name: 'price', type: 'CNY', width: 8},
        {name: 'volume', type: 'num', width: 6},
        {name: 'borrow', type: 'CNY', width: 8},
        {name: 'lend', type: 'CNY', width: 8},
        {name: 'balance', type: 'CNY', width: 8, editable: false}
      ],
      descHints: ['304', '201', '202', '收到汇款', '开票']
    }),
    props: {
      baseBalance: {type: Number, default: 0},
      // like [{date:'2018-01-11',desc:'',price:23.5,weight:400,amount:9400}..]
      deals: {type: Array, default: []}
    },
    computed: {
      valOfColDefs () {
        return [null, null, null, null, null, null,
          (rs, i) => this.balances[i]
        ]
      },
      lends () {
        return this.rows.map(row => row.amount).map(x => x < 0 ? -x : null)
      },
      borrows () {
        return this.rows.map(row => row.amount).map(x => x > 0 ? x : null)
      },
      balances () {
        const ds = this.rows
        let last = (ds[0].lend || 0) - (ds[0].borrow || 0)
        let res = [last]
        for (let i = 1; i < ds.length; i++) {
          last = last + (ds[i].lend || 0) - (ds[i].borrow || 0)
          res.push(last)
        }
        return res
      },

      rowTotal () {
        let res = this.rows.reduce((s, a) => ({
          volume: (s.volume || 0) + (a.volume || 0),
          borrow: (s.borrow || 0) + (a.borrow || 0),
          lend: s.lend + (a.lend || 0)
        }))
        return {
          makeDate: moment().format('YYYY-MM-DD'),
          desc: '总计',
          borrow: fmtCNY(res.borrow),
          lend: fmtCNY(res.lend),
          balance: fmtCNY((res.lend || 0) - (res.borrow || 0))
        }
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
        let row0 = {desc: '上次结欠', lend: this.baseBalance}
        let arr = this.deals.map(d => ({
          makeDate: d.makeDate,
          desc: d.desc,
          price: d.price,
          volume: d.volume,
          borrow: d.amount < 0 ? -d.amount : null,
          lend: d.amount > 0 ? d.amount : null
        }))
        this.rows = [row0, ...arr]
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
        if (!this.colDefs[j].editable === false) editing = false
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
        const colName = this.colDefs[this.curr.j].name
        if (colName === 'makeDate') {
          this.curr.val = guessDate(this.curr.val)
        }
        // auto calc lend=pricexvolume
        if (colName === 'price' || colName === 'volume') {
          let row = this.rows[this.curr.i]
          if (row.price && row.volume) {
            row.lend = row.price * row.volume
          }
        }
        // this.curr.editing = false
        // console.log(this.curr)
        this.setVal(this.curr.i, this.curr.j, this.curr.val)
      },
      onKeyPress (evt) {
        const k = evt.code
        console.log(evt)
        let i = this.curr.i
        let j = this.curr.j
        if (i === null) return
        switch (k) {
          case 'ArrowDown':
            evt.preventDefault()
            this.jumpToCell(i + 1, j)
            break
          case 'ArrowUp':
            this.jumpToCell(i - 1, j)
            break
          case 'ArrowLeft':
            if (!this.curr.editing || evt.altKey) this.jumpToCell(i, j - 1)
            break
          case 'ArrowRight':
            if (!this.curr.editing || evt.altKey) this.jumpToCell(i, j + 1)
            break
          case 'Enter':
          case 'NumpadEnter':
            if (this.curr.editing) {
              // this.jumpToCell(i, j)
              this.curr.editing = false
              this.finishEditCell()
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
        tfoot {
            border-top: double;
        }
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
        .cny {
            text-align: right;
        }
    }
</style>