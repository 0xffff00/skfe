<template>
    <div v-if="word" class="word-viewer">
        <slot name="header">
            <h1>{{word.text}}
                <Button v-if="editable && !editing" @click="editing=true" size="small">编辑</Button>
                <Button v-if="editable && editing" @click="editing=false" size="small">预览</Button>
            </h1>
        </slot>
        <h3>描述</h3>
        <div>
            <input v-if="editing" class="adder" @keyup.enter="putW" v-model="word.desc">
            <p v-else>{{word.desc}}</p>

        </div>

        <RelsBox title="别名" :amount="aliasRS0.length" :auto-hide="!editing">
            <Rels name="别名" :rs0="aliasRS0" :toE="'dst'" attr="ALIA" :editing="editing"
                  @jump="jump" @add="addBR" @remove="delBR"></Rels>
        </RelsBox>
        <RelsBox title="类型" :amount="definitionESA.length" :auto-hide="!editing">
            <Rels name="类型" :rs0="definitionRS0" :esa="definitionESA" attr="INST" :toE="'src'" :editing="editing"
                  @jump="jump" @add="addBR" @remove="delBR"></Rels>
        </RelsBox>
        <RelsBox title="实例" :amount="instanceESA.length" :auto-hide="!editing">
            <Rels name="实例" :rs0="instanceRS0" :esa="instanceESA" attr="INST" :toE="'dst'" :editing="editing"
                  @jump="jump" @add="addBR" @remove="delBR"></Rels>
        </RelsBox>
        <RelsBox title="超集" :amount="supersetESA.length" :auto-hide="!editing">
            <Rels name="超集" :rs0="supersetRS0" :esa="supersetESA" attr="SUBS" :toE="'src'" :editing="editing"
                  @jump="jump" @add="addBR" @remove="delBR"></Rels>
        </RelsBox>
        <RelsBox title="子集" :amount="subsetESA.length" :auto-hide="!editing">
            <Rels name="子集" :rs0="subsetRS0" :esa="subsetESA" attr="SUBS" :toE="'dst'" :editing="editing"
                  @jump="jump" @add="addBR" @remove="delBR"></Rels>
        </RelsBox>
        <RelsBox title="父话题" :amount="supertopicESA.length" :auto-hide="!editing">
            <Rels name="父话题" :rs0="subtopicRS0" :esa="supertopicESA" attr="SUBT" :toE="'src'" :editing="editing"
                  @jump="jump" @add="addBR" @remove="delBR"></Rels>
        </RelsBox>
        <RelsBox title="子话题" :amount="subtopicESA.length" :auto-hide="!editing">
            <Rels name="子话题" :rs0="subtopicRS0" :esa="subtopicESA" attr="SUBT" :toE="'dst'" :editing="editing"
                  @jump="jump" @add="addBR" @remove="delBR"></Rels>
        </RelsBox>
        <div class="x1-rels-box">
            <h3>属性({{word.attributeRS0.length}})</h3>
            <ul>
                <li v-for="(rels,attr) in attributeRMG">
                    <span class="attrName">{{attr}}</span> {{pred2str(rels[0].pred)}}
                    <Rels name="属性值" :rs0="rels" :toE="'dst'" :editing="editing"
                          @jump="jump" @add="addX1R" @remove="delX1R"></Rels>
                </li>
                <li v-if="editing">
                    <input class="adder" v-model="editor.x1Rel1.attr" placeholder="新属性名" style="width:10em;"
                           @keyup.enter="addX1R4Refe">
                    <select class="adder-pred">
                        <option v-for="(txt,val) in predMap" :value="val">{{txt}}</option>
                    </select>
                    <input class="adder" v-model="editor.x1Rel1.v" placeholder="属性值" style="width:20em;"
                           @keyup.enter="addX1R4Refe">
                </li>
            </ul>
        </div>
        <div class="x1-rels-box">
            <h3>引用({{word.referenceRS0.length}})</h3>
            <ul>
                <li v-for="(rels,attr) in referenceRMG">
                    <Rels name="引用方" :rs0="rels" :toE="'src'" :editing="editing"
                          @jump="jump" @add="addX1R" @remove="delX1R"></Rels>
                    的 {{attr}} {{pred2str(rels[0].pred)}} {{word.text}}
                </li>
                <li v-if="editing">
                    <input class="adder" v-model="editor.x1Rel2.v" placeholder="新引用方" style="width:20em;"
                           @keyup.enter="addX1R4Attr">的
                    <input class="adder" v-model="editor.x1Rel2.attr" placeholder="新属性名" style="width:10em;"
                           @keyup.enter="addX1R4Attr">是{{word.text}}
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
  import { sortBy, prop, groupBy, map, split, merge, reduce, max } from 'ramda'
  import WordUtils from '../../libs/word-utils'
  import Rels from './rels.vue'
  import RelsBox from './rels-box.vue'

  export default {
    name: 'editor',
    data: () => ({
      editing: true,
      editor: {
        x1Rel1: {pred: 'HAS'},
        x1Rel2: {pred: 'HAS'}
      }
    }),
    props: {
      editable: {type: Boolean, default: true},
      word: {type: Object, default: {}}
      // ui: {type: Object, default: {loadTick: 0}},
    },
    computed: {
      // ---------  7 RS0 ---------
      aliasRS0 () {
        return this.word.aliasRS0
      },
      subsetRS0 () {
        let self = this
        return self.word.subsetRSR.filter(r => r.src === self.word.text)
      },
      supersetRS0 () {
        let self = this
        return self.word.supersetRSR.filter(r => r.dst === self.word.text)
      },
      instanceRS0 () {
        return this.word.instanceRS0
      },
      definitionRS0 () {
        return this.word.definitionRS0
      },
      subtopicRS0 () {
        let self = this
        return self.word.subtopicRSR.filter(r => r.src === self.word.text)
      },
      supertopicRS0 () {
        let self = this
        return self.word.supertopicRSR.filter(r => r.dst === self.word.text)
      },

      // --------- 6 ESA ---------
      subsetESA () {
        return WordUtils.fetchESR(this.word.text, this.word.subsetRSR, true)
      },
      supersetESA () {
        return WordUtils.fetchESR(this.word.text, this.word.supersetRSR, false)
      },
      instanceESA () {
        return this.word.instanceESA
      },
      definitionESA () {
        return this.word.definitionESA
      },
      subtopicESA () {
        return WordUtils.fetchESR(this.word.text, this.word.subtopicRSR, true)
      },
      supertopicESA () {
        return WordUtils.fetchESR(this.word.text, this.word.supertopicRSR, false)
      },

      // ----- 2 RMG ------
      attributeRMG () {
        return map(sortBy(prop('no')))(
          groupBy(prop('attr'))(this.word.attributeRS0)
        )
      },
      referenceRMG () {
        return map(sortBy(prop('no')))(
          groupBy(prop('attr'))(this.word.referenceRS0)
        )
      },
      // ---- misc -----
      predMap: () => WordUtils.predMap
    },
    created () {
      if (!this.editable) {
        this.editing = false
      }
    },
    methods: {
      jump (e) {
        this.$emit('jump', e)
      },
      delBR (name, r) {
        this.$emit('delBR', name, r)
      },
      addBR (name, attr, toE, v) {
        let w = this.word.text
        let arr2 = split(/\s+/)(v).map(s => split('^')(s))
        // support batch add by a space delimited string
        let rels = (toE === 'dst')
          ? arr2.map(a => ({src: w, dst: a[0], attr, adv: a[1]}))
          : arr2.map(a => ({dst: w, src: a[0], attr, adv: a[1]}))
        rels.forEach(rel => this.$emit('addBR', name, rel))
      },
      addX1R (name, attr, toE, v, rs0) {
        let arr2 = split(/\s+/)(v.trim()).map(s => split('^')(s))
        console.log(rs0.map(r => r.no))
        let no = reduce(max, -Infinity, rs0.map(r => r.no)) + 1
        let rels = (toE === 'dst')
          ? arr2.map(a => merge(rs0[0])({dst: a[0], attrx: a[1], no: no++}))
          : arr2.map(a => merge(rs0[0])({src: a[0], attrx: a[1], no: no++}))
        rels.forEach(rel => this.$emit('addX1R', name, rel))
      },
      addX1R4Refe () {
        const r1 = this.editor.x1Rel1
        this.addX1R('属性', r1.attr, 'dst', r1.v, [{
          src: this.word.text,
          dst: this.word.text,
          pred: r1.pred,
          attr: r1.attr,
          no: -1
        }])
      },
      addX1R4Attr () {
        const r2 = this.editor.x1Rel2
        this.addX1R('引用方', r2.attr, 'src', r2.v, [{
          src: this.word.text,
          dst: this.word.text,
          pred: r2.pred,
          attr: r2.attr,
          no: -1
        }])
      },
      delX1R (name, rel) {
        this.$emit('delX1R', name, rel)
      },
      putW () {
        this.$emit('putW', this.word)
      },
      pred2str: (x) => WordUtils.predMap[x] || '='
    },
    components: {Rels, RelsBox}
  }
</script>
<style scoped lang="less">
    .word-viewer {
        padding: 5px;
    }

    input.adder {
        /*border-radius: 4px;*/
        border-width: 0;
        border-bottom: dashed 1px darkgreen;
        width: 7em;
        padding: 0 4px;
    }

    select.adder-pred {
        border-width: 0;
        border-bottom: dashed 1px darkgreen;
        vertical-align: bottom;
    }
</style>