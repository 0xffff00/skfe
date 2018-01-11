<template>
    <div>
        <div>
            <label>客户名：</label>
            <Input size="small"></Input>
            <label>开始日期：</label>
            <DatePicker size="small" type="date" placeholder="开始日期" v-model="bill.startDate"></DatePicker>
            <label>结束日期：</label>
            <DatePicker size="small" type="date" placeholder="结束日期" v-model="bill.endDate"></DatePicker>
        </div>
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
            <tr v-for="(deal,i) in bill.deals">
                <td>{{i}}</td>
                <td v-for="(c,j) in colDefs">
                    <Cell :name="c.name" :type="c.type" :val="valOfColDefs[j]"
                          :i="i" :j="j" :curr="curr" :row="deal"
                          @jumpToCell="jumpToCell" :width="c.width" :editable="c.editable"></Cell>
                </td>
                <td>
                    <a @click="insertRow(i)">add</a>
                    <a @click="deleteRow(i)">del</a>
                </td>
            </tr>
            </tbody>
            <tfoot>
            <tr>
                <th></th>
                <th>{{endDateOfRowZ}}</th>
                <th>{{rowZ.desc}}</th>
                <th></th>
                <th>{{rowZ.volume}}</th>
                <th class="cny">{{rowZ.borrow}}</th>
                <th class="cny">{{rowZ.lend}}</th>
                <th class="cny">{{rowZ.balance}}</th>
            </tr>
            </tfoot>
        </table>
    </div>
</template>
<script>
  import { merge, clone } from 'ramda'
  import moment from 'moment'
  import Cell from './cell.vue'
  import { fmtCNY, fmtDefault, defaultRow, today } from './util'

  export default {
    components: {Cell},
    data: () => ({
      curr: {i: null, j: null, editing: false, focus2: true},
      row0: defaultRow,
      colDefs: [
        {name: 'makeDate', type: 'date', width: 8},
        {name: 'desc', type: 'txt', width: 15},
        {name: 'price', type: 'CNY', width: 8},
        {name: 'volume', type: 'num', width: 6},
        {name: 'borrow', type: 'CNY', width: 8},
        {name: 'lend', type: 'CNY', width: 8},
        {name: 'balance', type: 'CNY', width: 8, editable: false}
      ],
      descHints: ['304', '201', '202', '收到汇款', '开票']
    }),
    props: {
      bill: {type: Object, default: {}}
    },
    computed: {
      valOfColDefs () {
        return [null, null, null, null,
          (row, i) => row.amount < 0 ? -row.amount : null,
          (row, i) => row.amount > 0 ? row.amount : null,
          (row, i) => this.balances[i]
        ]
      },
      balances () {
        const arr = this.bill.deals.map(d => d.amount || 0)
        let last = arr[0]
        let res = [last]
        for (let i = 1; i < arr.length; i++) {
          last += arr[i]
          res.push(last)
        }
        return res
      },
      endDateOfRowZ () {
        return moment(this.bill.endDate).format('YYYY-MM-DD')
      },
      rowZ () {
        if (!this.bill.deals.length) return {}
        let res = this.bill.deals
          .map(d => ({volume: d.volume || 0, amount: d.amount || 0}))
          .reduce((s, a) => ({
            volume: s.volume + a.volume,
            borrow: s.amount < 0 ? -s.amount : 0,
            lend: s.amount > 0 ? s.amount : 0
          }), 0)
        return {
          makeDate: this.bill.endDate,
          desc: '总计',
          borrow: fmtCNY(res.borrow),
          lend: fmtCNY(res.lend),
          balance: fmtCNY(res.lend - res.borrow)
        }
      }
    },
    mounted () {
      const self = this
      window.addEventListener('keyup', evt => {
        self.onKeyPress(evt)
      })
    },
    methods: {
      isLegal (i, j) {
        return i !== null && i >= 0 && i < this.bill.deals.length && j >= 0 && j < this.colDefs.length
      },
      getVal (i, j) {
        let t = this.colDefs[j].type
        let n = this.colDefs[j].name
        let v = null
        if (n === 'borrow') {
          v = -this.bill.deals[i]['amount']
        } else if (n === 'lend') {
          v = this.bill.deals[i]['amount']
        } else {
          v = this.bill.deals[i][n]
        }
        return v
      },
      setVal (i, j, val) {
        let t = this.colDefs[j].type
        let n = this.colDefs[j].name
        let v = val
        if (v !== '' && v !== null && v !== undefined) {
          if (t === 'CNY' || t === 'num') {
            v = parseFloat(val)
          }
        }
        if (n === 'borrow') {
          this.bill.deals[i]['amount'] = -v
          return
        }
        if (n === 'lend') {
          this.bill.deals[i]['amount'] = v
          return
        }
        this.bill.deals[i][n] = v
      },
      jumpToCell (i, j, editing) {
        if (i === this.bill.deals.length) {
          this.insertRow(i - 1)
        }
        if (!this.isLegal(i, j)) return
        if (this.curr.i === i && this.curr.j === j) {
          if (editing === false) editing = null
        }
        this.finishEditCurrCell()
        this.curr.i = i
        this.curr.j = j
        this.curr.val = this.getVal(i, j)
        if (editing === true) {
          this.curr.editing = true
          this.curr.focus2 = true
        }
        if (editing === false) this.curr.editing = false
      },
      finishEditCurrCell () {
        if (!this.isLegal(this.curr.i, this.curr.j)) return
        if (this.colDefs[this.curr.j].editable === false) return
        if (!this.curr.editing) return
        this.curr.editing = false
        const colName = this.colDefs[this.curr.j].name
        if (colName === 'makeDate') {
          this.curr.val = guessDate(this.curr.val)
        }
        this.setVal(this.curr.i, this.curr.j, this.curr.val)
        // auto calc lend = price x volume
        if (colName === 'price' || colName === 'volume') {
          let row = this.bill.deals[this.curr.i]
          if (row.price && row.volume) {
            row.amount = row.price * row.volume
          }
        }
      },
      startEditCurrCell () {
        if (!this.isLegal(this.curr.i, this.curr.j)) return
        if (this.colDefs[this.curr.j].editable === false) return
        if (this.curr.editing) return
        this.curr.editing = true
      },
      insertRow (i) {
        this.bill.deals.splice(i + 1, 0, clone(defaultRow))
      },
      deleteRow (i) {
        this.bill.deals.splice(i, 1)
      },
      onKeyPress (evt) {
        const k = evt.key
        console.log(evt)
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
            if (!this.curr.editing || evt.altKey) this.jumpToCell(i, j - 1)
            break
          case 'ArrowRight':
            if (!this.curr.editing || evt.altKey) this.jumpToCell(i, j + 1)
            break
          case 'Enter':
            if (this.curr.editing) {
              this.finishEditCurrCell()
            } else {
              this.startEditCurrCell()
              this.curr.focus2 = true
            }
            break
          case 'Tab':
            this.jumpToCell(i, j + 1)
            break
          case 'Escape':
            this.finishEditCurrCell()
            break
          case 'F2':
            this.startEditCurrCell()
            break
          case 'Delete':
            if (!this.curr.editing) {
              this.setVal(i, j, null)
              this.jumpToCell(i, j)
            }
            break
          default:
            if (k === '.' || k === '-' ||
              (k.length === 1 && k >= '0' && k <= '9') ||
              (k.length === 1 && k >= 'a' && k <= 'z') ||
              (k.length === 1 && k >= 'A' && k <= 'Z')) {
              if (!this.curr.editing) {
                this.curr.editing = true
                this.curr.focus2 = false
                this.curr.val = k
              }
            }
        }
      },
      onChangeStartDate (v) {
        this.bill.startDate = v
      },
      onChangeEndDate (v) {
        this.bill.endDate = v
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