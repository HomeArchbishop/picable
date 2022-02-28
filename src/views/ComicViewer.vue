<template>
  <div class="comic-viewer-container">
    <div class="display-card">
      <div class="img-container">
        <img v-for="item in pictureListDocsList" :key="item._id"
          :src="$utils.formatImgUrl(item.media.fileServer, item.media.path)"
          v-show="pictureLoadingStateMap[item._id] === true"
          @load="pictureLoadingStateMap[item._id] = true"
        >
        <div v-for="(item, index) in pictureListDocsList" :key="'placeholder' + item._id"
          class="img-placeholder"
          v-show="pictureLoadingStateMap[item._id] === false"
        >{{ index + 1 }}</div>
        <div v-for="index in 8" :key="'empty-placeholder' + index"
          class="img-placeholder"
          v-show="pictureListDocsList.length === 0"
        >{{ index }}</div>
      </div>
      <div class="tip-layer">
        <common-tip-block v-if="!isUpdating && !isAll" :clickable="true" @click="updateNewPicturePage()">
          加载更多
        </common-tip-block>
        <!--
        <common-tip-block v-if="isAll && episodesList.length" :clickable="true">
          看到底了 下一章节
        </common-tip-block>
        -->
        <common-tip-block v-else-if="isAll" :clickable="true" @click="backToDetail()">
          看到底了 回到目录
        </common-tip-block>
        <common-tip-block v-if="isUpdating" :waiting="true">正在加载</common-tip-block>
      </div>
      <div class="space-placeholder" v-if="pictureListDocsList.length === 0"></div>
    </div>
  </div>
</template>

<script>
import CommonTipBlock from '../components/CommonTipBlock'

export default {
  name: 'ComicViewer',
  components: {
    CommonTipBlock
  },
  data () {
    return {
      pictureListDocsList: [],
      pictureLoadingStateMap: {},
      episodesList: [],
      episodesTitle: '加载中...',
      nextPage: 1,
      isAll: false,
      isUpdating: false
    }
  },
  computed: {
    currentEpisodeIndex () {
      return this.episodesList.findIndex((item = {}) =>
        `${item.order}` === `${this.comicOrder}`) || 0
    },
    comicId () {
      return this.$route.params.comicId
    },
    epsOrder () {
      return this.$route.params.order
    }
  },
  methods: {
    updateNewPicturePage: async function () {
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
      this.episodesTitle = pictureObjectResults.ep.title
      this.pictureLoadingStateMap = pictureObjectResults.pages.docs.reduce((p, c) => {
        p[c._id] = false
        return p
      }, {})
      if (pictureObjectResults.pages.page === pictureObjectResults.pages.pages) {
        this.isAll = true
      } else {
        this.nextPage += 1
      }
      // change states.
      this.isUpdating = false
    },
    updateRecentStorage () {
      // TODO update recent comic storage in vuex
    },
    getEpisodesList: async function () {
      // TODO fit it to multi-pages later. Maybe share the same logic with download
    },
    nextEpisodes: async function () {
      // TODO to be finished after `getEpisodesList()` is done
    },
    backToDetail: async function () {
      this.$router.push({ name: 'ComicDetail', params: { comicId: this.comicId } })
    },
    nextAction: async function () {
      if (!this.isUpdating && !this.isAll) {
        this.updateNewPicturePage()
      } else if (this.isAll && this.episodesList.length) {
        if (this.episodesList.length && this.currentEpisodeIndex) {
          this.nextEpisodes()
        } else {
          this.backToDetail()
        }
      }
    },
    scrollToTop: async function () {
      // TODO to be finished
      // const container = this.$refs.container
      // container.scrollTo(0, 0)
    },
    scrollToBottom: async function () {
      // TODO to be finished
      // const container = this.$refs.container
      // container.scrollTo(0, container.scrollHeight)
    }
  },
  created () {
    this.updateRecentStorage()
    this.updateNewPicturePage()
    this.getEpisodesList()
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
      width: 100%;
      img {
        width: 100%;
      }
      .img-placeholder {
        text-align: center;
        width: 100%;
        padding: 160px 0;
        background: #535353;
        border-bottom: 1px solid darken(#535353, 10%);
        color: rgb(183, 188, 192);
        font-size: 14em;
        user-select: none;
      }
    }
    .tip-layer {
      display: flex;
      flex-direction: row;
      justify-content: center;
      margin-top: 10px;
    }
    .space-placeholder {
      height: 100000px;
    }
  }
}
</style>
