<template>
    <div>
        <table class="main">
            <thead>
            <tr>
                <th>#</th>
                <th>日期</th>
                <th>账务摘要</th>
                <th>单价</th>
                <th>数量</th>
                <th>单位</th>
                <th>借方(CNY)</th>
                <th>贷方(CNY)</th>
                <th>余额(CNY)</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(deal,i) in deals" :class="{keyRow : deal.type === 'KEY'}">
                <td :style="{textAlign: 'center'}">{{i}}</td>
                <td v-for="(c,j) in colDefs" :class="colDefs[j].css1">
                    <Cell :name="c.name" :type="c.type" :val="valOfColDefs[j]"
                          :i="i" :j="j" :curr="curr" :row="deal"
                          @jumpToCell="jumpToCell" :width="c.width" :editable="c.editable"></Cell>
                </td>
                <td class="opt">
                    <div>
                        <a @click="insertKeyRow(i)" title="插入基准行，紧随其后">
                            <Icon type="plus-circled" color="#225530"></Icon>
                        </a>
                        <a @click="insertPlainRow(i)" title="插入普通行，紧随其后">
                            <Icon type="plus-circled" color="green"></Icon>
                        </a>
                        <a @click="deleteRow(i)" title="删除此行">
                            <Icon type="minus-circled" color="red"></Icon>
                        </a>
                    </div>
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
                <th></th>
                <th class="cny">{{rowZ.borrow}}</th>
                <th class="cny">{{rowZ.lend}}</th>
                <th class="cny">{{rowZ.balance}}</th>
                <td class="opt"></td>
            </tr>
            </tfoot>
        </table>
    </div>
</template>
<script>
  import { merge, clone } from 'ramda'
  import moment from 'moment'
  import Cell from './cell.vue'
  import { fmtCNY, fmtDefault, defaultRow, defaultKeyRow, defaultCurr, today, isoDate2cn } from './util'

  export default {
    components: {Cell},
    data: () => ({
      // focus2:
      curr: clone(defaultCurr),
      colDefs: [
        {name: 'date', type: 'date', css1: 'date'},
        {name: 'desc', type: 'txt', css1: 'desc'},
        {name: 'price', type: 'CNY', css1: 'cny'},
        {name: 'volume', type: 'num', css1: 'volume'},
        {name: 'unit', type: 'txt', css1: 'unit'},
        {name: 'borrow', type: 'CNY', css1: 'cny'},
        {name: 'lend', type: 'CNY', css1: 'cny'},
        {name: 'balance', type: 'CNY', css1: 'cny', editable: false}
      ],
      descHints: ['304', '201', '202', '收到汇款', '开票'],
      opts: {
        buyers: []
      }
    }),
    props: {
      buyer: {type: String, default: null},
      deals: {type: Array, default: []},
      startDate: {type: String, default: null},
      endDate: {type: String, default: null},
      editable: {type: Boolean, default: true},
      initBalance: {type: Number, default: 0}
    },
    computed: {
      valOfColDefs () {
        return [null, null, null, null, null,
          (row, i) => row.amount < 0 && row.type !== 'KEY' ? -row.amount : null,
          (row, i) => row.amount > 0 && row.type !== 'KEY' ? row.amount : null,
          (row, i) => this.balances[i]
        ]
      },
      balances () {
        let last = this.initBalance
        let res = []
        for (let i = 0; i < this.deals.length; i++) {
          let v = this.deals[i].amount || 0
          if (this.deals[i].type === 'KEY') last = v
          else last += v
          res.push(last)
        }
        return res
      },
      endDateOfRowZ () {
        return moment(this.endDate).format('YYYY-MM-DD')
      },
      rowZ () {
        if (!this.deals || !this.deals.length) return {}
        let res = this.deals
          .map(d => ({volume: d.volume || 0, amount: d.amount || 0}))
          .map(d => ({
            volume: d.volume,
            borrow: d.amount < 0 ? -d.amount : 0,
            lend: d.amount > 0 ? d.amount : 0
          }))
          .reduce((s, a) => ({
            volume: s.volume + a.volume,
            borrow: s.borrow + a.borrow,
            lend: s.lend + a.lend
          }), {volume: 0, borrow: 0, lend: 0})
        return {
          date: this.endDate,
          desc: '总计',
          borrow: fmtCNY(res.borrow),
          lend: fmtCNY(res.lend),
          balance: fmtCNY(res.lend - res.borrow)
        }
      }
    },
    mounted () {
      const vm = this
      window.addEventListener('keyup', evt => {
        vm.onKeyPress(evt)
      })
    },
    methods: {
      isLegal (i, j) {
        return i !== null && i >= 0 && i < this.deals.length && j >= 0 && j < this.colDefs.length
      },
      getVal (i, j) {
        let t = this.colDefs[j].type
        let n = this.colDefs[j].name
        let v = null
        if (n === 'borrow') {
          v = -this.deals[i]['amount']
        } else if (n === 'lend') {
          v = this.deals[i]['amount']
        } else {
          v = this.deals[i][n]
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
          this.deals[i]['amount'] = -v
          return
        }
        if (n === 'lend') {
          this.deals[i]['amount'] = v
          return
        }
        this.deals[i][n] = v
      },
      jumpToCell (i, j, editing) {
        if (i === this.deals.length) {
          this.insertPlainRow(i - 1)
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
        if (colName === 'date') {
          this.curr.val = guessDate(this.curr.val)
        }
        this.setVal(this.curr.i, this.curr.j, this.curr.val)
        // auto calc lend = price x volume
        if (colName === 'price' || colName === 'volume') {
          let row = this.deals[this.curr.i]
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
      clearCurr () {
        this.finishEditCurrCell()
        this.curr = clone(defaultCurr)
      },
      insertKeyRow (i) {
        this.deals.splice(i + 1, 0, clone(defaultKeyRow))
      },
      insertPlainRow (i) {
        this.deals.splice(i + 1, 0, clone(defaultRow))
      },
      deleteRow (i) {
        this.deals.splice(i, 1)
      },
      /* onFilterBuyersHints (q) {
        const vm = this
        vm.opts.buyers = vm.allBuyers.filter(b => {
          if (!q) return true
          let k = q.toUpperCase()
          return b.hanzi.includes(k) || b.py1.includes(k) || b.py2.includes(k)
        })
      }, */
      onKeyPress (evt) {
        const k = evt.key
        // console.log(evt)
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
        this.startDate = v
      },
      onChangeEndDate (v) {
        this.endDate = v
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
    .head {
        display: inline-block;
        .bk {
            font-weight: bold;
        }
        .bv {
            span {
                padding: 0 5px;
                border-bottom: solid 1px black;
                min-width: 10em;
                display: inline-block;
            }
            margin-right: 1em;

        }
        margin: 15px 5px;
    }

    table.main {
        font-size: 10pt;
        border-spacing: 0;
        border-collapse: collapse;

        th {
            border: solid 1px black;
        }
        tr {

        }
        td {
            border: solid 1px black;
            border-bottom: none;
            /*border: solid 1px black;*/
        }
        td.opt {
            border-width: 0;
        }
        td.editing {
            border: solid 2px black;
        }
        .cny {
            text-align: right;
        }
        tfoot {
            display: table-row-group;
            th {
                border-top: double;
                min-height: 20px;
                padding: 0 2px;
            }
        }

    }

    @media screen {
        table.main {
            tr.keyRow {
                border-top: ridge 3px black;
            }
            td.opt {
                width: 45px;
                display: block;
            }
            td.date {
                width: 80px;
                text-align: center;
            }
            td.desc {
                min-width: 240px;
                max-width: 400px;
            }
            td.volume {
                width: 70px;
            }
            td.unit {
                max-width: 30px;
            }
            td.cny {
                width: 120px;
            }
        }
    }

    @media print {
        table.head-editor {
            display: none;
        }

        table.main {
            color: black;
            border-color: black;
            tr.keyRow {
                border-top: ridge 3px black;
            }
            td.opt {
                display: none;
            }
            td.date {
                width: 80px;
                text-align: center;
            }
            td.desc {
                max-width: 240px;
            }
            td.volume {
                max-width: 70px;
            }
            td.unit {
                max-width: 30px;
            }
            td.cny {
                min-width: 80px;
                max-width: 120px;
            }

        }
    }
</style>