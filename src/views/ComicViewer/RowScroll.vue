<template>
  <div class="display-card row-scroll-view">
    <div class="img-track" ref="imgTrack">
      <ul class="img-container">
        <li v-for="(item, index) in pictureListDocsList" :key="item._id" :id="`pic${index + 1}`" class="img-group">
          <div class="img-layer" v-show="pictureLoadingStateMap[item._id]">
            <img
              v-if="!isUseLazyLoad || pictureLazyLoadHappenedMap[item._id]"
              :src="$utils.formatImgUrl(item.media.fileServer, item.media.path)"
              :_id="item._id"
              @load="
                pictureLoadingStateMap[item._id] = true;
                pictureConnerReversedColorMap[item._id] = $utils.getImgReverseColor($event.target)
              "
              @error="pictureLoadingErrorMap[item._id] = true"
              @wheel="imgWheel"
            >
          </div>
          <div class="page-tip" v-if="pictureLoadingStateMap[item._id]"
            :style="{
              color: pictureConnerReversedColorMap[item._id] || 'unset'
            }"
          >{{ index + 1 }}</div>
          <div
            class="img-placeholder" :class="{ 'load-error': pictureLoadingErrorMap[item._id] }"
            v-show="!pictureLoadingStateMap[item._id]"
          >
            <span class="page">{{ index + 1 }}</span>
          </div>
        </li>
        <div class="tip-layer-row-for-not-empty" v-if="pictureListDocsList.length !== 0"
          :class="{ loading: isUpdating }"
          @click="isAll && hasNextEpisodes ? nextEpisodes() : (isAll && backToDetail());(!isUpdating && !isAll && updateNewPicturePage())"
        >
          <span v-if="!isUpdating && !isAll">点击加载更多</span>
          <span v-if="isAll && hasNextEpisodes">看到底了 下一章节</span>
          <span v-else-if="isAll">看到底了 回到目录</span>
          <span v-if="isUpdating">正在加载</span>
        </div>
        <div class="tip-layer-row-for-empty" v-if="pictureListDocsList.length === 0">
          <common-tip-block v-if="isUpdating" :waiting="true">正在加载</common-tip-block>
        </div>
        <div ref="bottomAnchor"></div>
      </ul>
    </div>
    <div class="tool-bar" v-if="pictureListDocsList.length !== 0">
      <div class="tool-btn" @click="backToDetail()">
        <font-awesome-icon icon="paperclip" />
      </div>
      <div class="tool-btn" @click="scrollToTop()">
        <font-awesome-icon icon="arrow-left" />
      </div>
      <div class="pic-link-btn" v-for="num in pictureListDocsList.length" :key="num"
        :num="num" :length="unhoverPicLinkBtnLength"
        @mouseover="picLinkBtnActiveNum = num" @mouseout="picLinkBtnActiveNum = NaN"
        :style="{ width: unhoverPicLinkBtnLength }"
        @click="scrollToPic(num)"
      ></div>
      <div class="tool-btn" @click="scrollToBottom()">
        <font-awesome-icon icon="arrow-right" />
      </div>
      <div class="advanced-tool-btn" @click="toggleAutoFlip()" :class="{ actived: isAutoFlip }">
        自动翻页
        <input type="number" @click.stop v-if="isAutoFlip" @change="updateAutoFlipMs" v-model="autoFlipS">
        <span v-if="isAutoFlip">秒</span>
      </div>
      <div class="tool-btn" @click="$emit('show-sub-view-setting')">
        <font-awesome-icon icon="gear" />
      </div>
    </div>
  </div>
</template>

<script>
import CommonTipBlock from '../../components/CommonTipBlock'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faGear, faArrowLeft, faArrowRight, faPaperclip } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { mapState } from 'vuex'

library.add(faGear, faArrowLeft, faArrowRight, faPaperclip)

export default {
  name: 'RowScroll',
  components: {
    CommonTipBlock,
    FontAwesomeIcon
  },
  data () {
    return {
      pictureListDocsList: [],
      pictureLoadingStateMap: {},
      pictureConnerReversedColorMap: {},
      pictureLoadingErrorMap: {},
      pictureLazyLoadHappenedMap: {},
      pictureCurrentInSightList: [0],
      hasNextEpisodes: false,
      nextPage: 1,
      isAll: false,
      isUpdating: false,
      picLinkBtnActiveNum: NaN,
      imgScale: {},
      isAutoFlip: false,
      autoFlipS: this.$store.state.storage.imgViewerSettings.autoFlipMs / 1000,
      autoFlipTimer: '',
      isPreventFilping: true
    }
  },
  computed: {
    ...mapState({
      isUseLazyLoad: state => !!state.storage.imgViewerSettings.lazyLoad,
      isAutoUpdatePage: state => !!state.storage.imgViewerSettings.autoUpdatePage,
      shortcuts: state => ({
        comicViewerRowNext: state.storage.shortcuts.comicViewerRowNext,
        comicViewerRowLast: state.storage.shortcuts.comicViewerRowLast
      })
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
      try {
        const pictureObjectResults = await this.$api.picture({
          diversionUrl: this.diversionUrl,
          token: this.token,
          comicId: this.comicId,
          epsOrder: this.epsOrder,
          page: this.nextPage
        })
        this.isPreventFilping = false
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
      } catch (err) {
        if (!this.pictureListDocsList.length) {
          this.isPreventFilping = true
          this.$compHelper.breakdown.call(this)
        }
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
      if (this.isPreventFilping) { return }
      console.log(num)
      if (num === 1) {
        this.$refs.imgTrack.scrollTo(0, 0)
      } else {
        const offsetDistanceFromTrack = document.querySelector(`#pic${num}`).offsetLeft - this.$refs.imgTrack.offsetLeft
        this.$refs.imgTrack.scrollTo(offsetDistanceFromTrack, 0)
      }
      // document.querySelector(`#pic${num}`).scrollIntoView()
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
        const clientWidth = this.$refs.imgTrack.offsetLeft + this.$refs.imgTrack.clientWidth - 10
        const isInView = bound.left <= clientWidth && bound.right >= this.$refs.imgTrack.offsetLeft + 10
        if (isInView) {
          if (hasTrue === false) {
            this.pictureCurrentInSightIndex = index
            this.pictureLazyLoadHappenedMap[this.pictureListDocsList[Math.max(0, index - 3)]._id] = true
            this.pictureLazyLoadHappenedMap[this.pictureListDocsList[Math.max(0, index - 2)]._id] = true
            this.pictureLazyLoadHappenedMap[this.pictureListDocsList[Math.max(0, index - 1)]._id] = true
          }
          hasTrue = true
          pictureExactInSight.push(index)
          this.pictureLazyLoadHappenedMap[this.pictureListDocsList[index]._id] = true
        } else if (hasTrue === true) {
          this.pictureLazyLoadHappenedMap[this.pictureListDocsList[Math.min(imgGroups.length - 1, index + 0)]._id] = true
          this.pictureLazyLoadHappenedMap[this.pictureListDocsList[Math.min(imgGroups.length - 1, index + 1)]._id] = true
          this.pictureLazyLoadHappenedMap[this.pictureListDocsList[Math.min(imgGroups.length - 1, index + 2)]._id] = true
          break
        }
      }
      this.pictureCurrentInSightList = [...pictureExactInSight]
      console.log(pictureExactInSight)
      // resolve the auto-update for new picture page
      if (pictureExactInSight.includes(imgGroups.length - 1) && this.isAutoUpdatePage && !this.isAll) {
        // within the last picture, then auto-update it
        this.updateNewPicturePage()
      }
    },
    /**
     * @param {'nextPic'|'lastPage'} command command string
     */
    async keyboardFliping (command, e) {
      e.preventDefault()
      this.flipNear(command)
    },
    async flipNear (command) {
      let nextPicIndex = NaN
      const currentPictureIndex = Math.min(...this.pictureCurrentInSightList)
      if (command === 'lastPic') {
        nextPicIndex = Math.max(0, -1 + currentPictureIndex)
      } else if (command === 'nextPic') {
        nextPicIndex = Math.min(this.pictureListDocsList.length - 1, 1 + currentPictureIndex)
      }
      this.scrollToPic(nextPicIndex + 1)
    },
    async toggleAutoFlip () {
      this.isAutoFlip = !this.isAutoFlip
      if (this.isAutoFlip) {
        this.useNewAutoFlip(this.autoFlipS)
      } else {
        clearInterval(this.autoFlipTimer)
      }
    },
    async updateAutoFlipMs () {
      if (!!this.isAutoFlip === false) { return }
      this.autoFlipS = Math.max(0.2, Math.abs(this.autoFlipS))
      this.$store.commit('storage/setImgViewerSettings', { autoFlipMs: this.autoFlipS * 1000 })
      this.useNewAutoFlip(this.autoFlipS)
    },
    async useNewAutoFlip (s) {
      clearInterval(this.autoFlipTimer)
      this.autoFlipTimer = setInterval(() => {
        this.flipNear('nextPic')
      }, s * 1000)
    }
  },
  watch: {
    epsOrder (nextValue) {
      if (!nextValue) { return }
      // init $data.
      Object.assign(this.$data, this.$options.data.call(this))
      this.updateNewPicturePage()
      this.judgeHasNextEpisodes()
      this.scrollToTop(0, 0)
    }
  },
  created () {
    this.updateNewPicturePage()
    this.recordRecentComic()
    this.judgeHasNextEpisodes()
  },
  mounted () {
    this.$refs.imgTrack.addEventListener('scroll', this.imgScrollListener)
    // listener for keyboard fliping picture
    this.$mousetrap.bind(this.shortcuts.comicViewerRowLast, (e) => this.keyboardFliping('lastPic', e))
    this.$mousetrap.bind(this.shortcuts.comicViewerRowNext, (e) => this.keyboardFliping('nextPic', e))
  },
  beforeUnmount () {
    clearInterval(this.autoFlipTimer)
    this.$refs.imgTrack.removeEventListener('scroll', this.imgScrollListener)
    // listener for keyboard fliping picture
    this.$mousetrap.unbind(this.shortcuts.comicViewerRowLast)
    this.$mousetrap.unbind(this.shortcuts.comicViewerRowNext)
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/themes/config';
@import '~@/assets/themes/@{theme-name}/theme';

.display-card.row-scroll-view {
  width: 100%;
  height: 76vh;
  @media (min-height: 676px) {
    height: 80vh;
  }
  .img-track {
    display: -webkit-box;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -webkit-box-align: center;
    overflow-x: scroll;
    overflow-y: hidden;
    ul.img-container {
      display: flex;
      flex-direction: row;
      padding: 0;
      margin: 0;
      min-width: 100%;
      height: 76vh;
      @media (min-height: 676px) {
        height: 80vh;
      }
      li.img-group {
        display: flex;
        position: relative;
        padding-right: 4px;
        .img-layer {
          overflow: scroll;
          img {
            height: 76vh;
            @media (min-height: 676px) {
              height: 80vh;
            }
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
          justify-content: center;
          height: 76vh;
          @media (min-height: 676px) {
            height: 80vh;
          }
          width: 60vh;
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
        }
      }
      .tip-layer-row-for-not-empty {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 76vh;
        @media (min-height: 676px) {
          height: 80vh;
        }
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
        align-items: center;
        margin-top: 10px;
        width: 100%;
      }
    }
  }
  .tool-bar {
    display: flex;
    align-items: center;
    flex-direction: row;
    position: fixed;
    width: 550px;
    left: calc(50% - $width / 2);
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
      &:nth-last-child(3) {
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
    .advanced-tool-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: fit-content;
      // width: 190px;
      height: 40px;
      border-radius: 40px;
      background: @background-btn-default;
      margin-left: 5px;
      margin-right: 5px;
      padding: 0 20px;
      cursor: pointer;
      user-select: none;
      transition: .1s;
      &.actived {
        background: lighten(@background-btn-highlight, 15%);
      }
      input {
        display: inline-block;
        padding: 0;
        width: 4em;
        font-family: inherit;
        border: none;
        border-bottom: 1px solid @color-line-default-sub;
        box-sizing: content-box;
        background-color: transparent;
        outline: none;
        text-align: center;
        transition: .2s;
        &::-webkit-inner-spin-button {
          -webkit-appearance: none;
        }
        &::-webkit-outer-spin-button {
          -webkit-appearance: none;
        }
      }
    }
  }
}
</style>
