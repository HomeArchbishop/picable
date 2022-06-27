<template>
  <div class="comic-viewer-container">
    <div class="display-card" :class="{
      'column-view': viewDirection === 'column',
      'row-view': viewDirection === 'row'
    }">
      <ul class="img-container">
        <li v-for="(item, index) in pictureListDocsList" :key="item._id" :id="`pic${index + 1}`" class="img-group">
          <div class="img-layer">
            <img
              v-if="!isUseLazyLoad || pictureLazyLoadHappenedMap[item._id]"
              v-show="pictureLoadingStateMap[item._id]"
              :src="$utils.formatImgUrl(item.media.fileServer, item.media.path)"
              :_id="item._id"
              @load="pictureLoadingStateMap[item._id] = true"
              @error="pictureLoadingErrorMap[item._id] = true"
              @wheel="imgWheel"
            >
          </div>
          <div class="page-tip" v-if="pictureLoadingStateMap[item._id]">{{ index + 1 }}</div>
          <div
            class="img-placeholder" :class="{ 'load-error': pictureLoadingErrorMap[item._id] }"
            v-show="!pictureLoadingStateMap[item._id]"
          >
            <span class="page">{{ index + 1 }}</span>
          </div>
        </li>
        <div class="tip-layer-row-for-not-empty" v-if="viewDirection === 'row' && pictureListDocsList.length !== 0"
          :class="{ loading: isUpdating }"
          @click="isAll && hasNextEpisodes ? nextEpisodes() : (isAll && backToDetail());(!isUpdating && !isAll && updateNewPicturePage())"
        >
          <span v-if="!isUpdating && !isAll">点击加载更多</span>
          <span v-if="isAll && hasNextEpisodes">看到底了 下一章节</span>
          <span v-else-if="isAll">看到底了 回到目录</span>
          <span v-if="isUpdating">正在加载</span>
        </div>
        <div class="tip-layer-row-for-empty" v-if="viewDirection === 'row' && pictureListDocsList.length === 0">
          <common-tip-block v-if="isUpdating" :waiting="true">正在加载</common-tip-block>
        </div>
        <div ref="bottomAnchor" v-if="viewDirection === 'row'"></div>
      </ul>
      <div class="tip-layer-column" v-if="viewDirection === 'column'">
        <common-tip-block v-if="!isUpdating && !isAll" :clickable="true" @click="updateNewPicturePage()">
          加载更多
        </common-tip-block>
        <common-tip-block v-if="isAll && hasNextEpisodes" :clickable="true" @click="nextEpisodes()">
          看到底了 下一章节
        </common-tip-block>
        <common-tip-block v-else-if="isAll" :clickable="true" @click="backToDetail()">
          看到底了 回到目录
        </common-tip-block>
        <common-tip-block v-if="isUpdating" :waiting="true">正在加载</common-tip-block>
      </div>
      <div ref="bottomAnchor" v-if="viewDirection === 'column'"></div>
      <div class="tool-bar" v-if="pictureListDocsList.length !== 0">
        <div class="tool-btn" @click="backToDetail()">
          <font-awesome-icon icon="paperclip" />
        </div>
        <div class="tool-btn" @click="scrollToTop()">
          <font-awesome-icon :icon="`${viewDirection === 'column' ? 'arrow-up' : 'arrow-left'}`" />
        </div>
        <div class="pic-link-btn" v-for="num in pictureListDocsList.length" :key="num"
          :num="num" :length="unhoverPicLinkBtnLength"
          @mouseover="picLinkBtnActiveNum = num" @mouseout="picLinkBtnActiveNum = NaN"
          :style="
            `${viewDirection === 'column' ? 'height' : 'width'}:${unhoverPicLinkBtnLength}`
          "
          @click="scrollToPic(num)"
        ></div>
        <div class="tool-btn" @click="scrollToBottom()">
          <font-awesome-icon :icon="`${viewDirection === 'column' ? 'arrow-down' : 'arrow-right'}`" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CommonTipBlock from '../components/CommonTipBlock'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowDown, faArrowUp, faArrowLeft, faArrowRight, faPaperclip } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { mapState } from 'vuex'

library.add(faArrowDown, faArrowUp, faArrowLeft, faArrowRight, faPaperclip)

export default {
  name: 'ComicViewer',
  components: {
    CommonTipBlock,
    FontAwesomeIcon
  },
  data () {
    return {
      pictureListDocsList: [],
      pictureLoadingStateMap: {},
      pictureLoadingErrorMap: {},
      pictureLazyLoadHappenedMap: {},
      pictureCurrentInSightIndexList: [],
      hasNextEpisodes: false,
      nextPage: 1,
      isAll: false,
      isUpdating: false,
      picLinkBtnActiveNum: NaN,
      imgScale: {}
    }
  },
  computed: {
    ...mapState({
      viewDirection: state => state.storage.imgViewerSettings.direction || 'column',
      isUseLazyLoad: state => !!state.storage.imgViewerSettings.lazyLoad,
      isAutoUpdatePage: state => !!state.storage.imgViewerSettings.autoUpdatePage
    }),
    comicId () {
      return this.$route.params.comicId
    },
    epsOrder () {
      return this.$route.params.order
    },
    unhoverPicLinkBtnLength () {
      return (300 - 80 - 20) / this.pictureListDocsList.length + 'px'
    }
  },
  methods: {
    async updateNewPicturePage () {
      if (this.isUpdating) { return }
      // change states.
      this.isUpdating = true
      // call api to update
      const pictureObjectResults = await this.$api.picture({
        diversionUrl: this.diversionUrl,
        token: this.token,
        comicId: this.comicId,
        epsOrder: this.epsOrder,
        page: this.nextPage
      })
      console.log(pictureObjectResults)
      this.pictureListDocsList.push(...pictureObjectResults.pages.docs)
      this.pictureLoadingStateMap = {
        ...this.pictureLoadingStateMap,
        ...pictureObjectResults.pages.docs.reduce((p, c) => {
          p[c._id] = false
          return p
        }, {})
      }
      this.pictureLazyLoadHappenedMap = {
        ...this.pictureLazyLoadHappenedMap,
        ...pictureObjectResults.pages.docs.slice(0, 3).reduce((p, c) => {
          p[c._id] = true
          return p
        }, {})
      }
      if (pictureObjectResults.pages.page === pictureObjectResults.pages.pages) {
        this.isAll = true
      } else {
        this.nextPage += 1
      }
      // change states.
      this.isUpdating = false
    },
    async judgeHasNextEpisodes () {
      let episodesObject
      let page = 1
      while (!episodesObject || episodesObject.page < episodesObject.pages) {
        episodesObject = await this.$api.episodes({
          diversionUrl: this.diversionUrl, token: this.token, comicId: this.comicId, page
        })
        console.log(episodesObject)
        for (const { order } of (episodesObject.docs || [])) {
          if (order === +this.epsOrder + 1) {
            this.hasNextEpisodes = true
            console.log(this.hasNextEpisodes)
            return
          }
        }
        page++
      }
      this.hasNextEpisodes = false
    },
    async nextEpisodes () {
      this.$router.push({ name: 'ComicViewer', params: { comicId: this.comicId, order: +this.epsOrder + 1 } })
    },
    async backToDetail () {
      this.$router.push({ name: 'ComicDetail', params: { comicId: this.comicId } })
    },
    async scrollToTop () {
      // TODO to be finished
      this.scrollToPic(1)
    },
    async scrollToBottom () {
      // TODO to be finished
      this.$refs.bottomAnchor.scrollIntoView()
    },
    async scrollToPic (num) {
      if (this.viewDirection === 'column' && num === 1) {
        scrollTo(0, 0)
      } else {
        document.querySelector(`#pic${num}`).scrollIntoView()
      }
      // scrollTo(0, document.querySelector(`#pic${num}`).offsetTop)
    },
    async recordRecentComic () {
      const currentRecentComicIdList = await window.electronAPI.existRuntimeFile({ file: './recentComicIdList.json' })
        ? JSON.parse(await window.electronAPI.readRuntimeFile({ file: './recentComicIdList.json' })).reverse()
        : []
      const recentComicIdSet = new Set(currentRecentComicIdList)
      recentComicIdSet.delete(this.comicId)
      recentComicIdSet.add(this.comicId)
      const recentComicIdList = Array.from(recentComicIdSet).reverse()
      window.electronAPI.writeRuntimeFile({ file: './recentComicIdList.json', content: JSON.stringify(recentComicIdList) })
    },
    async imgWheel (e) {
      if (!e.ctrlKey) { return } // stand for scroll, not scale
      const dom = e.path[0]
      const layerDom = e.path[1]
      const lastScale = this.imgScale[dom._id] || 1
      const nextScale = Math.max(lastScale - e.deltaY * 0.05, 1)
      this.imgScale[dom._id] = nextScale
      dom.style.transform = (`
        scale(${nextScale})
        translateX(${dom.width / nextScale / 2 * (nextScale - 1)}px)
        translateY(${dom.height / nextScale / 2 * (nextScale - 1)}px)
      `)
      // console.log(dom.width / nextScale / 2 * (nextScale - 1))
      layerDom.scrollTo(e.layerX - e.offsetX, e.layerY - e.offsetY)
    },
    async imgScrollListener () {
      const imgGroups = Array.from(document.querySelectorAll('.img-group'))
      const pictureExactInSight = []
      let hasTrue = false
      // map the array and resolve the lazy-load
      for (const _index in imgGroups) {
        const index = +_index
        const el = imgGroups[index]
        const bound = el.getBoundingClientRect()
        const clientHeight = window.innerHeight
        const clientWidth = window.innerWidth
        const isInView = this.viewDirection === 'column' ? bound.top <= clientHeight && bound.bottom >= 0 : bound.left <= clientWidth && bound.right >= 0
        if (isInView) {
          if (hasTrue === false) {
            this.pictureCurrentInSightIndex = index
            this.pictureLazyLoadHappenedMap[this.pictureListDocsList[Math.max(0, index - 2)]._id] = true
            this.pictureLazyLoadHappenedMap[this.pictureListDocsList[Math.max(0, index - 1)]._id] = true
          }
          hasTrue = true
          pictureExactInSight.push(index)
          this.pictureLazyLoadHappenedMap[this.pictureListDocsList[index]._id] = true
        } else if (hasTrue === true) {
          this.pictureLazyLoadHappenedMap[this.pictureListDocsList[Math.min(imgGroups.length - 1, index + 1)]._id] = true
          this.pictureLazyLoadHappenedMap[this.pictureListDocsList[Math.min(imgGroups.length - 1, index + 2)]._id] = true
          break
        }
      }
      this.pictureCurrentInSightIndexList = [...pictureExactInSight]
      // resolve the auto-update for new picture page
      if (pictureExactInSight.includes(imgGroups.length - 1) && this.isAutoUpdatePage && !this.isAll) {
        // within the last picture, then auto-update it
        this.updateNewPicturePage()
      }
    }
  },
  watch: {
    epsOrder (nextValue) {
      if (!nextValue) { return }
      // init $data.
      Object.assign(this.$data, this.$options.data())
      this.updateNewPicturePage()
      this.judgeHasNextEpisodes()
      scrollTo(0, 0)
    }
  },
  created () {
    this.updateNewPicturePage()
    this.recordRecentComic()
    this.judgeHasNextEpisodes()
  },
  mounted () {
    if (this.viewDirection === 'column') {
      window.document.addEventListener('scroll', this.imgScrollListener)
    } else {
      window.document.querySelector('.img-container').addEventListener('scroll', this.imgScrollListener)
    }
  },
  unmounted () {
    if (this.viewDirection === 'column') {
      window.document.removeEventListener('scroll', this.imgScrollListener)
    } else {
      window.document.querySelector('.img-container').removeEventListener('scroll', this.imgScrollListener)
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/themes/config';
@import '~@/assets/themes/@{theme-name}/theme';

.comic-viewer-container {
  .display-card.column-view {
    width: 100%;
    ul.img-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      padding: 0;
      margin: 0;
      li.img-group {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        max-width: 80vh;
        position: relative;
        .img-layer {
          overflow: scroll;
          img {
            width: 100%;
          }
          &::-webkit-scrollbar {
            display: none;
          }
        }
        .img-layer:not(:hover) + .page-tip {
          opacity: 0;
        }
        .page-tip {
          position: absolute;
          right: calc(100% + 4px);
          bottom: 10px;
          font-size: 2em;
          color: @color-font-default-sub;
          transition: .2s;
          user-select: none;
          cursor: default;
        }
        .img-placeholder {
          display: block;
          text-align: center;
          width: 100%;
          padding: 160px 0;
          background: #535353;
          border-bottom: 1px solid darken(#535353, 10%);
          color: rgb(183, 188, 192);
          font-size: 14em;
          user-select: none;
          &.load-error span {
            // text-decoration: line-through;
            // text-decoration-color: fade(@color-font-default-highlight, 80%);
            position: relative;
            &::after {
              content: '+';
              color: fade(@color-font-default-highlight, 80%);
              position: absolute;
              transform: rotateZ(45deg);
              bottom: .7em;
              left: 100%;
              font-size: 4 / 14em;
            }
          }
          span {
            width: 100%;
          }
        }
      }
    }
    .tip-layer-column {
      display: flex;
      flex-direction: row;
      justify-content: center;
      margin-top: 10px;
    }
    .tool-bar {
      display: flex;
      align-items: center;
      flex-direction: column;
      position: fixed;
      height: 350px;
      right: 20px;
      top: 200px;
      .pic-link-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        background: @background-btn-default;
        width: 8px;
        color: lighten(@color-font-default-sub, 70%);
        cursor: pointer;
        transition: .15s;
        position: relative;
        &:nth-child(3) {
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
        }
        &:nth-last-child(2) {
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
        }
        &:hover {
          background-color: darken(@background-btn-default, 40%);
          &::before {
            display: block;
            background: lighten(@background-btn-highlight, 15%);
            position: absolute;
            top: calc(50% - .5em - 4px);
            right: 10px;
            border-radius: .75em;
            padding: 4px 8px;
            content: attr(num);
          }
        }
      }
      .tool-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 40px;
        height: 40px;
        border-radius: 40px;
        background: @background-btn-default;
        margin-top: 5px;
        margin-bottom: 5px;
        cursor: pointer;
      }
    }
  }
  .display-card.row-view {
    width: 100%;
    ul.img-container {
      display: -webkit-box;
      -webkit-box-orient: horizontal;
      -webkit-box-direction: normal;
      -webkit-box-align: center;
      overflow-x: scroll;
      overflow-y: hidden;
      padding: 0;
      margin: 0;
      li.img-group {
        display: flex;
        height: 100%;
        position: relative;
        padding-right: 4px;
        .img-layer {
          overflow: scroll;
          img {
            max-width: 100%;
            max-height: 80vh;
          }
          &::-webkit-scrollbar {
            display: none;
          }
        }
        .img-layer:not(:hover) + .page-tip {
          opacity: 0;
        }
        .page-tip {
          position: absolute;
          left: 4px;
          bottom: 6px;
          font-size: 2em;
          color: @color-font-default-sub;
          transition: .2s;
          user-select: none;
          cursor: default;
        }
        .img-placeholder {
          display: flex;
          flex-direction: row;
          align-items: center;
          height: 80vh;
          width: 70vw;
          background: #535353;
          border-bottom: 1px solid darken(#535353, 10%);
          color: rgb(183, 188, 192);
          font-size: 14em;
          user-select: none;
          &.load-error span {
            // text-decoration: line-through;
            // text-decoration-color: fade(@color-font-default-highlight, 80%);
            position: relative;
            &::after {
              content: '+';
              color: fade(@color-font-default-highlight, 80%);
              position: absolute;
              transform: rotateZ(45deg);
              bottom: .7em;
              left: 100%;
              font-size: 4 / 14em;
            }
          }
          span {
            text-align: center;
            width: 100%;
          }
        }
      }
      .tip-layer-row-for-not-empty {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 80vh;
        width: 2em;
        background: #535353;
        border-bottom: 1px solid darken(#535353, 10%);
        color: rgb(183, 188, 192);
        font-size: 2em;
        user-select: none;
        cursor: pointer;
        &.loading {
          cursor: wait;
        }
        span {
          display: inline-flex;
          flex-direction: row;
          align-items: center;
          writing-mode: vertical-lr;
          text-align: center;
          width: 100%;
        }
      }
      .tip-layer-row-for-empty {
        display: flex;
        flex-direction: row;
        justify-content: center;
        margin-top: 10px;
        width: 100%;
      }
    }
    .tool-bar {
      display: flex;
      align-items: center;
      flex-direction: row;
      position: fixed;
      width: 350px;
      left: calc(50% - 350px / 2);
      bottom: 20px;
      .pic-link-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        background: @background-btn-default;
        height: 8px;
        color: lighten(@color-font-default-sub, 70%);
        cursor: pointer;
        transition: .15s;
        position: relative;
        &:nth-child(3) {
          border-top-left-radius: 8px;
          border-bottom-left-radius: 8px;
        }
        &:nth-last-child(2) {
          border-bottom-right-radius: 8px;
          border-top-right-radius: 8px;
        }
        &:hover {
          background-color: darken(@background-btn-default, 40%);
          &::before {
            display: block;
            background: lighten(@background-btn-highlight, 15%);
            position: absolute;
            left: calc(50% - .5em - 4px);
            bottom: 10px;
            border-radius: .75em;
            padding: 4px 8px;
            content: attr(num);
          }
        }
      }
      .tool-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 40px;
        height: 40px;
        border-radius: 40px;
        background: @background-btn-default;
        margin-left: 5px;
        margin-right: 5px;
        cursor: pointer;
      }
    }
  }
}
</style>
