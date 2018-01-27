<template>
    <div class="album-v3">
        <div class="album-v3-body" :style="{filter:ui.viewingOne?'blur(5px)':null}">
            <div class="criteria-pane">
                <p>
                    拍摄时间范围：
                    <DatePicker size="small" type="date" placeholder="拍摄日期(min)"
                                v-model="criteria.dateMin"></DatePicker>
                    至
                    <DatePicker size="small" type="date" placeholder="拍摄日期(max)"
                                v-model="criteria.dateMax"></DatePicker>
                </p>
                <p>
                    <Input size="small" v-model="criteria.fuzzy" placeholder="综合搜索" :style="{width:'15em'}"></Input>
                </p>
                <p>
                    排序依据:
                    <Select size="small" v-model="criteria.sortKey" :style="{width:'10em'}">
                        <Option value="hash">文件HASH</Option>
                        <Option value="exifDateTime">拍摄日期</Option>
                    </Select>
                    <Switch size1="small" v-model="criteria.sortAsc">
                        <span slot="open">增</span>
                        <span slot="close">减</span>
                    </Switch>
                </p>

                <p>分组显示：
                    <Switch size1="small" v-model="criteria.grouped">
                    </Switch>
                </p>
                <p :style="{width:'200px', display:'inline-block'}">
                    <Slider v-model="ui.thumbHeight" show-input :step="10" :min="80" :max="200"
                    ></Slider>
                </p>
                <Button @click="loadImages()">搜索</Button>
            </div>
            <div class="result-pane">
                <Page size="small" show-total show-elevator show-sizer
                      :current.sync="criteria.page" :total="result.total"
                      :page-size="criteria.limit" :page-size-opts="[50,100,200,400]"
                      @on-page-size-change="loadImages()" @on-change="loadImages()"></Page>
                <div class="gallery">

                    <div v-for="img in imageInfos" class="img-hull" :style="{height:`${ui.thumbHeight}px`}">
                        <div class="img-cap"><b>{{DT.toYMD(img.exifDateTime)}}</b></div>
                        <div class="img-mask">
                            <div class="info">
                                HASH值：{{describeHash(img.hash)}}<br>
                                拍摄时间：{{DT.toYMD(img.exifDateTime)}} <br>
                                相机：{{img.exifMake}} {{img.exifModel}}<br>
                                尺寸：{{describeImageSize(img.width, img.height)}}<br>
                                文件：{{img.type}}格式， {{describeFileSize(img.fileSize)}}<br>
                            </div>
                        </div>
                        <a @click="viewOne(img)">
                            <img :src="getImgUri(img.hash)"/>
                        </a>
                    </div>
                </div>
            </div>


        </div>
        <div class="full-screen-viewer1"
             :style="{display: ui.viewingOne?'block':'none'}">
            <Button @click="ui.viewingOne=false">Close</Button>
            <img :src="viewer.imgSrc"/>
        </div>

    </div>
</template>
<script>
  import { TimeGrid, MsgBox } from 'skfe-ui'
  import HerdApi from '../apis/HerdApi'
  import moment from 'moment'

  const DT = {
    toY (exifDateTime = '') {
      return exifDateTime.slice(0, 4)
    },
    toM (exifDateTime = '') {
      return exifDateTime.slice(5, 7)
    },
    toD (exifDateTime = '') {
      return exifDateTime.slice(8, 10)
    },
    toYM (exifDateTime = '') {
      return exifDateTime.slice(0, 7)
    },
    toYMD (exifDateTime = '') {
      return exifDateTime.slice(0, 10)
    }
  }
  const describeImageSize = function (imageHeight, imageWidth) {
    let mp = imageHeight * imageWidth / 1024 / 1024
    return imageWidth + 'x' + imageHeight + ', ' + mp.toPrecision(2) + 'MP'
  }
  const describeFileSize = function (byteLength) {
    let KB = byteLength / 1024
    let MB = KB / 1024
    let GB = MB / 1024
    if (GB > 1) return GB.toPrecision(3) + 'GB'
    if (MB > 1) return MB.toPrecision(3) + 'MB'
    if (KB > 1) return KB.toPrecision(3) + 'KB'
    return byteLength + 'KB'
  }

  export default {
    data: () => ({
      // like [{hash,width,exifDateTime,fileSize..}..], ordered by exifDateTime asc
      imageInfos: [],
      result: {
        total: 0
      },
      criteria: {
        dateMin: null, // a JS Date
        dateMax: null, // a JS Date
        fuzzy: null, // fuzzy query test
        sortKey: 'exifDateTime',
        sortAsc: true,
        page: 1,
        limit: 200,
        grouped: true // switch to group or not
      },
      ui: {
        thumbHeight: 200,
        viewingOne: false
      },
      viewer: {
        imgSrc: '',
        img: {}
      },
      DT: DT
    }),
    computed: {},
    created () {
      this.criteria.dateMin = moment().subtract('year', 4).toDate()
      this.criteria.dateMax = moment().toDate()
      this.loadImages()
    },
    watch: {
      'ui.viewingOne': function (v) {
        document.getElementsByTagName('body')[0].style.overflow = v ? 'hidden' : null
      }
    },

    methods: {
      getImgUri: HerdApi.res.tn('h500q5'),
      loadImages () {
        const vm = this
        const c = vm.criteria
        let params = {
          p: c.page,
          l: c.limit,
          o: (c.sortAsc ? '' : '-') + c.sortKey,
          // fuzzy: c.fuzzy,
          exifDateTime_GE: moment(c.dateMin).startOf('day').format(),
          exifDateTime_LE: moment(c.dateMax).endOf('day').format()
        }
        HerdApi.imageInfos.gettingSome(params)(resp2 => {
          if (!resp2.ok) {
            MsgBox.open(self, '加载图片')(resp2)
            return
          }

          vm.result.total = resp2.totalCount
          vm.imageInfos = resp2.data
          let imageInfosToPut = resp2.data
          if (!vm.imageInfos || !vm.imageInfos.length) {
            self.$Notice.warning({title: '没有图片了'})
          }
        })
      },
      viewOne (img) {
        console.log(img)
        this.ui.viewingOne = true
      },
      describeImageSize: describeImageSize,
      describeFileSize: describeFileSize,
      describeExifDateTime: edt => edt,
      describeHash: hash => hash.slice(0, 10)
    }
  }
</script>
<style scoped lang="less">
    .criteria-pane {
        p {
            display: inline;
            min-width: 16em;
            margin: 3px 6px;
        }
    }

    .gallery {
        .img-cate-big {
            display: block;
        }
        .img-cate-mid {
            h4 {
                font-size: 12px;
                color: rgba(51, 51, 51, 0.66);
                margin: 4px;
            }
            display: inline-block;
        }
        .img-hull {
            height: 200px;
            margin: 0 3px;
            overflow: hidden;
            resize: both;
            display: inline-block;
            img {
                display: inline;
                height: 100%;
                object-fit: contain;
            }

            .img-cap {
                position: absolute;
                width: 150px;
                height: 15px;
                text-align: right;
                color: yellow;

                :before {
                    opacity: 0.8;
                    background-color: #000;
                }
                :after {
                    filter: blur(8px) brightness(110%);
                }

                b {

                }
            }
            .img-mask {
                z-index: 1;
                width: 50px;
                height: 50px;
                position: absolute;
                color: transparent;

                background: linear-gradient(135deg, #4c4750, transparent, transparent);
                border: red 1px;
                display: none;
            }

            .img-mask:HOVER {
                width: 150px;
                height: 180px;
                background: rgba(0, 0, 0, 0.6);
                border-bottom-right-radius: 3px;
                /*border: rgba(0, 0, 0, 0.3) 3px solid;*/
                -webkit-filter: blur(0px) brightness(1.2) contrast(0.3);
                color: #fdffea;
                cursor: default;
                .info {
                    display: inline-block;
                    width: 150px;
                    height: 151px;
                }
            }

            .img-mask {
                .opt {
                    float: left;
                }
                .info {
                    display: none;
                    /*width: 50px;*/
                    /*height: 50px;*/
                }
            }
        }
        .img-hull:HOVER {
            .img-mask {
                display: inline-block;
            }
        }
    }

    .full-screen-viewer1 {
        position: fixed;
        background: rgba(21, 23, 20, .9);
        top: 0;
        left: 0;
        z-index: 1500;
        width: 100%;
        height: 100%;
    }


</style>