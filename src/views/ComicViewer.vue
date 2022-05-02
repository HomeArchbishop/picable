<template>
  <div class="comic-viewer-container">
    <div class="display-card">
      <div class="img-container">
        <div v-for="(item, index) in pictureListDocsList" :key="item._id" :id="`pic${index + 1}`" class="img-group">
          <div class="img-layer">
            <img
              :src="$utils.formatImgUrl(item.media.fileServer, item.media.path)"
              v-show="pictureLoadingStateMap[item._id]"
              :_id="item._id"
              @load="pictureLoadingStateMap[item._id] = true"
              @error="pictureLoadingErrorMap[item._id] = true"
              @wheel="imgWheel"
            >
          </div>
          <div
            class="page-tip"
            v-if="pictureLoadingStateMap[item._id]"
          >{{ index + 1 }}</div>
          <div
            class="img-placeholder"
            :class="{ 'load-error': pictureLoadingErrorMap[item._id] }"
            v-show="!pictureLoadingStateMap[item._id]"
          >
            <span class="page">{{ index + 1 }}</span>
            <!-- <span class="error-tip">x</span> -->
          </div>
        </div>
      </div>
      <div class="tip-layer">
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
      <div ref="bottomAnchor"></div>
      <div class="tool-bar" v-if="pictureListDocsList.length !== 0">
        <div class="tool-btn" @click="backToDetail()">
          <font-awesome-icon icon="paperclip" />
        </div>
        <div class="tool-btn" @click="scrollToTop()">
          <font-awesome-icon icon="arrow-up" />
        </div>
        <div class="pic-link-btn" v-for="num in pictureListDocsList.length" :key="num"
          :num="num" :length="unhoverPicLinkBtnLength"
          @mouseover="picLinkBtnActiveNum = num" @mouseout="picLinkBtnActiveNum = NaN"
          :style="{ height: unhoverPicLinkBtnLength }"
          @click="scrollToPic(num)"
        ></div>
        <div class="tool-btn" @click="scrollToBottom()">
          <font-awesome-icon icon="arrow-down" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CommonTipBlock from '../components/CommonTipBlock'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowDown, faArrowUp, faPaperclip } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faArrowDown, faArrowUp, faPaperclip)

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
      hasNextEpisodes: false,
      nextPage: 1,
      isAll: false,
      isUpdating: false,
      picLinkBtnActiveNum: NaN,
      imgScale: {}
    }
  },
  computed: {
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
      scrollTo(0, 0)
      // const scrollInterval = setInterval(() => {
      //   const speed = window.scrollY / 6
      //   const formerScrollY = window.scrollY
      //   scrollTo(0, formerScrollY - speed)
      //   if (window.scrollY > formerScrollY - speed - 10) {
      //     clearInterval(scrollInterval)
      //   }
      // }, 10)
    },
    async scrollToBottom () {
      // TODO to be finished
      scrollTo(0, this.$refs.bottomAnchor.offsetTop)
      // const scrollInterval = setInterval(() => {
      //   const speed = (this.$refs.bottomAnchor.offsetTop - window.scrollY) / 6
      //   const formerScrollY = window.scrollY
      //   scrollTo(0, formerScrollY + speed)
      //   if (window.scrollY < formerScrollY + speed - 10) {
      //     clearInterval(scrollInterval)
      //   }
      // }, 10)
    },
    async scrollToPic (num) {
      if (num === 1) {
        scrollTo(0, 0)
      } else {
        scrollTo(0, document.querySelector(`#pic${num}`).offsetTop)
      }
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
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/themes/config';
@import '~@/assets/themes/@{theme-name}/theme';

.comic-viewer-container {
  .display-card {
    width: 100%;
    .img-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      .img-group {
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
          &.load-error .page {
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
          .page {
            width: 100%;
          }
        }
      }
    }
    .tip-layer {
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
}
</style>
