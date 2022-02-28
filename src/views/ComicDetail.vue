<template>
  <div class="detail-container">
    <div class="info-card" v-if="!isRequestingDetail">
      <div class="img-div">
        <img :src="$utils.formatImgUrl(thumb.fileServer, thumb.path)" alt="加载失败"
          @click.stop="$utils.viewLargeImage($utils.formatImgUrl(thumb.fileServer, thumb.path))"
        >
        <!--<img src="@/assets/img/black.jpeg" alt="加载失败">-->
      </div>
      <div class="content-div">
        <h2 class="title">
          {{ comicDetailObject.title }}
          <sup class="comic-finished-sup-tag">{{ comicDetailObject.finished ? '（完）' : '（未完）' }}</sup>
        </h2>
        <router-link custom v-slot="{ navigate }"
          :to="{ name: 'Search', query: { kw: comicDetailObject.author || '未知' } }">
          <div>
            作者：
            <div class="line-link" @click="navigate">{{ comicDetailObject.author || '未知' }}</div>
          </div>
        </router-link>
        <router-link custom v-slot="{ navigate }"
          :to="{ name: 'Search', query: { kw: comicDetailObject.chineseTeam || '未知' } }">
          <div>
            汉化：
            <div class="line-link" @click="navigate"> {{ comicDetailObject.chineseTeam || '未知' }}</div>
          </div>
        </router-link>
        <div>指名：{{ comicDetailObject.viewsCount }}次</div>
        <div>分类：{{ comicDetailObject.categories.reduce((s, c) => `${s}、${c}`) }}</div>
      </div>
    </div>
    <div class="detail-card" v-if="!isRequestingDetail">
      <div class="tag-wrap">
        <router-link :to="{ name: 'SearchTag', query: { t: tagName } }" custom v-slot="{ navigate }"
          v-for="tagName in comicDetailObject.tags" :key="tagName">
          <tag-item @click="navigate">{{ tagName }}</tag-item>
        </router-link>
      </div>
      <div class="description">
        <span v-if="isDescriptionPreview">
          {{ comicDetailObject.description.slice(0, 30) }}...
        </span>
        <span v-else>
          {{ comicDetailObject.description }}
        </span>
        <u class="toggle-btn" @click.stop="toggleDescriptionPreview()" v-if="isDescriptionShouldPreview">
          <font-awesome-icon icon="angle-down" v-if="isDescriptionPreview" />
          <font-awesome-icon icon="angle-up" v-else />
        </u>
      </div>
      <div class="func-bar">
        <div class="func-btn" id="favouriteBtn" :class="{ active: isFavourite, loading: isRequestingFavourite }" @click.stop="toggleFavourite()">
          <font-awesome-icon icon="bookmark" />收藏
        </div>
        <div class="func-btn" id="likeBtn" :class="{ active: isLiked, loading: isRequestingLike }" @click.stop="toggleLike()">
          <font-awesome-icon icon="heart" />点赞
          <div class="func-btn-badge">{{ comicDetailObject.likesCount }}</div>
        </div>
        <router-link :to="`/comments/${comicId}`" custom v-slot="{ navigate }">
          <div class="func-btn" @click="navigate">
            <font-awesome-icon icon="comment-dots" />评论
            <div class="func-btn-badge">{{ comicDetailObject.commentsCount }}</div>
          </div>
        </router-link>
        <div class="func-btn" @click.stop="toggleDownload()">
          <font-awesome-icon icon="download" />下载
        </div>
        <div class="func-btn" @click.stop="togglePack()" v-if="episodesDownloadedList.length">
          <font-awesome-icon icon="file-zipper" />打包
        </div>
      </div>
    </div>
    <div class="episodes-card" v-if="!isRequestingDetail && !isChoosingDownLoad && !isChoosingPackZip">
      <h2>章节列表</h2>
      <div class="episodes-list">
        <router-link :to="{ name:'ComicViewer', params: { comicId, order: item.order } }" custom v-slot="{ navigate }"  v-for="item in episodesList" :key="item.order" >
          <div class="episodes-item" @click="navigate">{{ item.title }}</div>
        </router-link>
      </div>
      <div class="state-line">
        <common-tip-block v-if="isRequestingEpisodes" :waiting="true">加载中...</common-tip-block>
        <common-tip-block v-if="!isEpisodesListEnd & !isRequestingEpisodes"
          :clickable="true" @click="getEpisodesList()"
        >
          加载更多
        </common-tip-block>
      </div>
    </div>
    <!--
    <div class="download-episodes-area" v-if="!isRequestingDetail && isChoosingDownLoad">
      <div class="tip">请选择要下载的章节</div>
      <div class="tip sub">（由于官方接口的问题，不能保证下载的成功与完整）</div>
      <div class="download-episodes-list">
        <div class="download-episodes-item" v-for="item in episodesList" :key="item.order"
          :class="{
            chosen: episodesDownloadChosenList.includes(String(item.order)) &&
              !episodesDownloadedList.includes(String(item.order)),
            downloaded: episodesDownloadedList.includes(String(item.order))
          }"
          @click.stop="toggleDownloadChosenList(item.order)">{{ item.title }}</div>
      </div>
      <div class="btn-div">
        <div class="btn" @click.stop="toggleDownload()">取消</div>
        <div class="btn" @click.stop="download()"
          :class="{
            disable: !episodesDownloadChosenList.length
          }">下载</div>
      </div>
    </div>
    <div class="pack-episodes-area" v-if="!isRequestingDetail && isChoosingPackZip">
      <div class="tip">请选择要打包的章节</div>
      <div class="tip sub">（仅支持已下载的章节）</div>
      <div class="tip sub" v-if="!episodesDownloadedList.length">（当前没有已下载的章节供打包）</div>
      <div class="pack-episodes-list" v-if="episodesDownloadedList.length">
        <div class="pack-episodes-item" v-for="item in episodesList" :key="item.order"
          :class="{
            disable: !episodesDownloadedList.includes(String(item.order))
          }"
          @click.stop="packZip(item.order)">{{ item.title }}</div>
      </div>
      <div class="btn-div">
        <div class="btn" @click.stop="togglePack()">取消</div>
      </div>
    </div>
    <div class="action-area" v-if="!isRequestingDetail">
      <div class="action-btn" v-if="comicDetailObject.author">
        <label>收藏作者</label>
      </div>
      <div class="action-btn" v-if="comicDetailObject.chineseTeam">
        <label>收藏汉化组</label>
      </div>
    </div>
    -->
  </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import { faHeart, faEye, faCommentDots, faBookmark, faDownload, faFileZipper, faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import TagItem from '../components/TagItem'
import CommonTipBlock from '../components/CommonTipBlock'

library.add(faHeart, faEye, faCommentDots, faBookmark, faDownload, faFileZipper, faAngleDown, faAngleUp)

export default {
  name: 'ComicDetail',
  components: {
    FontAwesomeIcon,
    TagItem,
    CommonTipBlock
  },
  data () {
    return {
      comicDetailObject: {},
      episodesList: [],
      nextEpisodesPage: 1,
      episodesDownloadChosenList: [],
      episodesDownloadedList: [],
      episodesPackChosenList: [],
      favouriteAuthorList: [],
      favouriteChineseList: [],
      isFavourite: false,
      isLiked: false,
      isRequestingDetail: true,
      isRequestingEpisodes: true,
      isRequestingFavourite: false,
      isRequestingLike: false,
      isChoosingDownLoad: false,
      isChoosingPackZip: false,
      isDescriptionPreview: false,
      isEpisodesListEnd: false
    }
  },
  computed: {
    thumb () {
      return this.comicDetailObject.thumb || {}
    },
    comicId () {
      return this.$route.params.comicId
    },
    isDescriptionShouldPreview () {
      return this.comicDetailObject.description
        ? this.comicDetailObject.description.length > 30
        : false
    }
  },
  methods: {
    getComicDetail: async function () {
      // change state.
      this.isRequestingDetail = true
      // call api.
      const comicDetailObject = await this.$api.info({
        diversionUrl: this.diversionUrl, token: this.token, comicId: this.comicId
      })
      this.comicDetailObject = comicDetailObject
      this.isFavourite = this.comicDetailObject.isFavourite
      this.isLiked = this.comicDetailObject.isLiked
      this.isDescriptionPreview = String(this.comicDetailObject.description).length > 30
      console.log('comicDetailObject', comicDetailObject)
      // change state.
      this.isRequestingDetail = false
    },
    getEpisodesList: async function () {
      this.isRequestingEpisodes = true
      const episodesObject = await this.$api.episodes({
        diversionUrl: this.diversionUrl, token: this.token, comicId: this.comicId, page: this.nextEpisodesPage
      })
      this.episodesList.push(...(episodesObject.docs || []))
      this.isEpisodesListEnd = episodesObject.page === episodesObject.pages
      this.nextEpisodesPage += !this.isEpisodesListEnd
      console.log(this.episodesList)
      this.isRequestingEpisodes = false
    },
    toggleFavourite: async function () {
      if (this.isRequestingFavourite) { return }
      // change state.
      this.isRequestingFavourite = true
      // call api.
      const favouriteAction = await this.$api.favourite({
        diversionUrl: this.diversionUrl, token: this.token, comicId: this.comicId
      })
      this.isFavourite = favouriteAction === 'favourite'
      // change state.
      this.isRequestingFavourite = false
    },
    toggleLike: async function () {
      if (this.isRequestingLike) { return }
      // change state.
      this.isRequestingLike = true
      // call api.
      const likeAction = await this.$api.like({
        diversionUrl: this.diversionUrl, token: this.token, comicId: this.comicId
      })
      this.isLiked = likeAction === 'like'
      this.comicDetailObject.likesCount = this.comicDetailObject.likesCount + (likeAction === 'like' ? 1 : -1)
      // change state.
      this.isRequestingLike = false
    },
    toggleDownload: async function () {
      this.isChoosingPackZip && await this.togglePack()
      this.$set(this, 'isChoosingDownLoad', !this.isChoosingDownLoad)
    },
    toggleDownloadChosenList: async function (orderNum) {
      const order = String(orderNum)
      if (this.episodesDownloadedList.includes(String(order))) { return }
      const chosenSet = new Set(this.episodesDownloadChosenList)
      chosenSet.has(order)
        ? chosenSet.delete(order)
        : chosenSet.add(order)
      this.$set(this, 'episodesDownloadChosenList', Array.from(chosenSet))
    },
    togglePack: async function () {
      this.isChoosingDownLoad && await this.toggleDownload()
      this.$set(this, 'isChoosingPackZip', !this.isChoosingPackZip)
    },
    download: async function () {
      this.toggleDownload()
      this.episodesDownloadChosenList.forEach(episodesOrder => {
        this.$api.download(this.token, this.comicId, episodesOrder)
          .then(downloadRes => {
            console.log('download', episodesOrder, downloadRes)
            this.getDownloadedList()
          })
      })
    },
    packZip: async function (episodesOrder) {
      if (episodesOrder === undefined) { return }
      const downloadZipUrl = await this.$api.downloadZipUrl(this.comicId, episodesOrder)
      const downloadZipWindow = window.open(downloadZipUrl)
      downloadZipWindow.document.title = '漫画下载'
    },
    getDownloadedList: async function () {
      const downloadInfo = await this.$api.downloadInfo()
      console.log(downloadInfo)
      const episodesDownloadedList = downloadInfo[this.comicId] || []
      this.$set(this, 'episodesDownloadedList', [...episodesDownloadedList])
    },
    toggleDescriptionPreview: async function () {
      this.isDescriptionPreview = !this.isDescriptionPreview
    },
    toggleFavouriteAuthor: async function () {
      const authorName = this.comicDetailObject.author
      if (!authorName) { return }
      const state = await this.$api.favouriteAuthor(authorName)
      console.log(state)
      await this.getFavouriteAuthorList()
    },
    getFavouriteAuthorList: async function () {
      const list = await this.$api.favouriteAuthorList()
      this.$set(this, 'favouriteAuthorList', list)
    },
    toggleFavouriteChinese: async function () {
      const chineseName = this.comicDetailObject.chineseTeam
      if (!chineseName) { return }
      const state = await this.$api.favouriteChinese(chineseName)
      console.log(state)
      await this.getFavouriteChineseList()
    },
    getFavouriteChineseList: async function () {
      const list = await this.$api.favouriteChineseList()
      this.$set(this, 'favouriteChineseList', list)
    }
  },
  created () {
    this.getComicDetail()
    this.getEpisodesList()
    // this.getFavouriteAuthorList()
    // this.getFavouriteChineseList()
    // this.getDownloadedList()
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/themes/config';
@import '~@/assets/themes/@{theme-name}/theme';
.detail-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  .info-card {
    display: flex;
    flex-direction: row;
    width: 100%;
    .img-div {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      width: 140px;
      height: 180px;
      overflow: hidden;
      cursor: pointer;
      img {
        width: 100%;
        max-height: 180px;
        border: none;
      }
    }
    .content-div {
      display: flex;
      flex: 1;
      flex-direction: column;
      align-items: flex-start;
      padding: 0 16px;
      height: 100%;
      line-height: 25px;
      .title {
        margin: 15px 0;
        .comic-finished-sup-tag {
          font-size: .7em;
          color: @color-font-theme;
        }
      }
      .line-link {
        display: inline;
        cursor: pointer;
        transition: .2s;
        color: @color-font-default-sub;
        &:hover {
          color: @color-font-default-highlight;
          text-decoration: underline;
        }
      }
    }
  }
  .detail-card {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    .tag-wrap {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
      padding-right: 2em;
      position: relative;
      margin: 4px;
    }
    .description {
      color: @color-font-default-sub;
      padding-right: 2em;
      position: relative;
    }

    .toggle-btn { /* btn that toggle all description or tags */
      display: inline-block;
      position: absolute;
      right: 0;
      bottom: 0;
      cursor: pointer;
      transition: .2s;
      &:hover {
        color: @color-font-default-highlight;
      }
    }
    .func-bar {
      display: flex;
      flex-direction: row;
      margin: 10px 0;
      .func-btn {
        padding: 8px 16px;
        border-radius: .75em;
        background: @background-btn-default;
        color: lighten(@color-font-default, 10%);
        transition: .2s;
        position: relative;
        box-sizing: border-box;
        cursor: pointer;
        &:not(:nth-child(1)) {
          margin-left: 4px;
        }
        &.active {
          &#favouriteBtn {
            color: @color-active-highlight-1;
            background-color: fade(@color-active-highlight-1, 15%);
          }
          &#likeBtn {
            color: @color-active-highlight-2;
            background-color: fade(@color-active-highlight-2, 15%);
          }
        }
        &.loading {
          cursor: wait;
        }
        &:hover {
          transform: translateY(-2px);
        }
        .func-btn-badge {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 1.5em;
          padding: 0 .5em;
          position: absolute;
          top: -.6em;
          right: -1em;
          font-size: .8em;
          color: @color-font-default; /* for the possible color change in toggle-btn */
          border-radius: .75em;
          background: lighten(@background-btn-highlight, 10%);
        }
      }
    }
  }

  .episodes-card {
    display: flex;
    flex-direction: column;
    width: 100%;
    box-shadow: 0 0 4px 0 @color-shadow;
    border-radius: .75em;
    margin-top: 10px;
    padding: 0 14px 14px 14px;
    .episodes-list {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      margin-top: -10px;
      ::selection {
        text-decoration: none;
      }
      .episodes-item {
        // border: 1px solid @color-line-default;
        background: lighten(@background-btn-default, 29%);
        padding: 6px 10px;
        margin: 2px;
        font-size: 14px;
        transition: .2s;
        cursor: pointer;
        &:nth-last-child(1) {
          margin-right: 0;
        }
        &:hover {
          transform: scale(110%)
        }
      }
    }
    .state-line {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      width: 100%;
      margin-top: 10px;
      .loading-state {
        padding: 8px 16px;
        border-radius: .75em;
        background: @background-btn-default;
      }
      .load-btn {
        padding: 8px 16px;
        border-radius: .75em;
        background: @background-btn-default;
        cursor: pointer;
        transition: .2s;
        &:hover {
          transform: scale(110%);
        }
      }
    }
  }
}
</style>
