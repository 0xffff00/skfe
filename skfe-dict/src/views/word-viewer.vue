<template>
    <div class="word-viewer">
        <h1>{{word.text}}

        </h1>
        <h3>描述</h3>
        <div>
            {{word.desc}}
        </div>

        <RelsBox title="别名" :theESA="aliasES0" :theES0="aliasES0" @jump="jump"></RelsBox>
        <RelsBox title="超类" :theESA="definitionESA" :theES0="definitionES0" @jump="jump"></RelsBox>
        <RelsBox title="实例" :theESA="instanceESA" :theES0="instanceES0" @jump="jump"></RelsBox>
        <RelsBox title="子集" :theESA="subsetESA" :theES0="subsetES0" @jump="jump"></RelsBox>
        <RelsBox title="超集" :theESA="supersetESA" :theES0="supersetES0" @jump="jump"></RelsBox>
        <RelsBox title="子话题" :theESA="subtopicESA" :theES0="subtopicES0" @jump="jump"></RelsBox>
        <RelsBox title="父话题" :theESA="supertopicESA" :theES0="supertopicES0" @jump="jump"></RelsBox>

        <div class="x1-rels-box">
            <h3>属性({{word.attributeRS0.length}})</h3>
            <ul>
                <li v-for="(rels,attr) in attributeRMG">
                    <span class="attrName">{{attr}}</span> {{pred2str(rels[0].pred)}}
                    <X1Rels :theRS0="rels" @jump="jump" :toE="'dst'"></X1Rels>
                </li>
            </ul>
        </div>
        <div class="x1-rels-box">
            <h3>引用({{word.referenceRS0.length}})</h3>
            <ul>
                <li v-for="(rels,attr) in referenceRMG">
                    <X1Rels :theRS0="rels" @jump="jump" :toE="'src'"></X1Rels>
                    的 {{attr}} {{pred2str(rels[0].pred)}} {{word.text}}
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
  import WordUtils from './word-utils'
  import RelsBox from './word-viewer-rels-box.vue'
  import X1Rels from './word-viewer-rels-x1.vue'

  const R = require('ramda')

  export default {
    name: 'word-viewer',
    data: () => ({}),
    props: {
      word: {type: Object}
      // ui: {type: Object, default: {loadTick: 0}},
    },
    computed: {
      // --------- 7 ES0 ---------
      aliasES0 () {
        return this.aliasRS0.map(r => r.dst)
      },
      subsetES0 () {
        return this.subsetRS0.map(r => r.dst)
      },
      supersetES0 () {
        return this.supersetRS0.map(r => r.src)
      },
      instanceES0 () {
        return this.instanceRS0.map(r => r.dst)
      },
      definitionES0 () {
        return this.definitionRS0.map(r => r.src)
      },
      subtopicES0 () {
        return this.subtopicRS0.map(r => r.dst)
      },
      supertopicES0 () {
        return this.supertopicRS0.map(r => r.src)
      },
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
        return R.map(R.sortBy(R.prop('no')))(
          R.groupBy(R.prop('attr'))(this.word.attributeRS0)
        )
      },
      referenceRMG () {
        return R.map(R.sortBy(R.prop('no')))(
          R.groupBy(R.prop('attr'))(this.word.referenceRS0)
        )
      }
    },
    created () {

    },
    methods: {
      jump (e) {
        console.log('jump:', e)
      },
      pred2str: (x) => WordUtils.predMap[x] || '='
    },
    components: {RelsBox, X1Rels}
  }
</script>
<style scoped lang="less">



</style>