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
            <div class="line-btn" v-if="comicDetailObject.author && comicDetailObject.author !== '未知'" @click="toggleFavouriteAuthor()"
              :class="{ active: favouriteAuthorList.includes(comicDetailObject.author) }"
            >
              {{ favouriteAuthorList.includes(comicDetailObject.author) ? '已收藏' : '收藏' }}
            </div>
          </div>
        </router-link>
        <router-link custom v-slot="{ navigate }"
          :to="{ name: 'Search', query: { kw: comicDetailObject.chineseTeam || '未知' } }">
          <div>
            汉化：
            <div class="line-link" @click="navigate"> {{ comicDetailObject.chineseTeam || '未知' }}</div>
            <div class="line-btn" v-if="comicDetailObject.chineseTeam && comicDetailObject.chineseTeam !== '未知'" @click="toggleFavouriteChinese()"
              :class="{ active: favouriteChineseList.includes(comicDetailObject.chineseTeam) }"
            >
              {{ favouriteChineseList.includes(comicDetailObject.chineseTeam) ? '已收藏' : '收藏' }}
            </div>
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
        <router-link :to="{ name: 'ComicComments', params: { comicId } }" custom v-slot="{ navigate }">
          <div class="func-btn" @click="navigate">
            <font-awesome-icon icon="comment-dots" />评论
            <div class="func-btn-badge">{{ comicDetailObject.commentsCount }}</div>
          </div>
        </router-link>
        <div class="func-btn" id="downloadBtn" :class="{ active: isChoosingDownLoad }" @click.stop="toggleDownload()">
          <font-awesome-icon icon="download" />下载
        </div>
      </div>
    </div>
    <div class="episodes-card" v-if="!isRequestingDetail && !isChoosingDownLoad">
      <h2>章节列表</h2>
      <div class="episodes-list">
        <router-link :to="{ name: 'ComicViewer', params: { comicId, order: item.order } }" custom v-slot="{ navigate }"  v-for="item in episodesList" :key="item.order" >
          <div class="episodes-item" @click="navigate">{{ item.title }}</div>
        </router-link>
      </div>
      <div class="state-line">
        <common-tip-block v-if="isRequestingEpisodes" :waiting="true">加载中...</common-tip-block>
        <common-tip-block v-if="!isEpisodesListEnd & !isRequestingEpisodes"
          :clickable="true" @click="getEpisodesList()"
        >
          {{ episodesList.length ? '加载更多' : '重新加载' }}
        </common-tip-block>
      </div>
    </div>
    <div class="episodes-card" v-if="!isRequestingDetail && isChoosingDownLoad">
      <h2>请选择要下载的章节</h2>
      <div class="episodes-list">
        <div class="episodes-item"
          :class="{
            chosen: episodesDownloadChosenList.includes('' + item.order),
            disabled: episodesDownloadedList.includes('' + item.order)
          }"
          @click="toggleDownloadChosenList(item.order)" v-for="item in episodesList" :key="item.order"
        >
          {{ item.title }}
        </div>
      </div>
      <div class="state-line">
         <small class="tip-small">（由于官方接口的问题，不能保证下载成功，请谨慎下载）</small>
        <common-tip-block v-if="isRequestingEpisodes" :waiting="true">加载中...</common-tip-block>
        <common-tip-block v-if="!isEpisodesListEnd & !isRequestingEpisodes"
          :clickable="true" @click="getEpisodesList()"
        >
          加载更多
        </common-tip-block>
        <common-tip-block v-if="episodesDownloadChosenList.length" :clickable="true" @click="download()">
          开始下载
        </common-tip-block>
      </div>
    </div>
    <div class="recommend-card"
      v-if="
        (
          (!isRecommendComicListRequestError && recommendComicList.length) ||
          isRecommendComicListRequestError
        ) && !isRequestingDetail
      "
    >
      <h2>看了這本子的人也在看</h2>
      <div class="comic-list" v-if="!isRecommendComicListRequestError">
        <item-small v-for="item in recommendComicList" :key="item._id" :item="item"
          :link="{ name: 'ComicDetail', params: { comicId: item._id } }"
        />
      </div>
      <div class="state-line" v-if="isRecommendComicListRequestError">
        <common-tip-block :clickable="true" @click="getRecommendComic()">
          重新加载
        </common-tip-block>
      </div>
    </div>
  </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import { faHeart, faEye, faCommentDots, faBookmark, faDownload, faFileZipper, faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import TagItem from '../components/TagItem'
import CommonTipBlock from '../components/CommonTipBlock'
import ItemSmall from '../components/ItemSmall.vue'

library.add(faHeart, faEye, faCommentDots, faBookmark, faDownload, faFileZipper, faAngleDown, faAngleUp)

export default {
  name: 'ComicDetail',
  components: {
    FontAwesomeIcon,
    TagItem,
    ItemSmall,
    CommonTipBlock
  },
  data () {
    return {
      comicDetailObject: {},
      episodesList: [],
      nextEpisodesPage: 1,
      episodesDownloadChosenList: [],
      episodesDownloadedList: [],
      favouriteAuthorList: [],
      favouriteChineseList: [],
      recommendComicList: [],
      isRecommendComicListRequestError: false,
      isFavourite: false,
      isLiked: false,
      isRequestingDetail: true,
      isRequestingEpisodes: true,
      isRequestingFavourite: false,
      isRequestingLike: false,
      isChoosingDownLoad: false,
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
    async getComicDetail () {
      // change state.
      this.isRequestingDetail = true
      // call api.
      try {
        const comicDetailObject = await this.$api.info({
          diversionUrl: this.diversionUrl, token: this.token, comicId: this.comicId
        })
        this.comicDetailObject = comicDetailObject
        this.isFavourite = this.comicDetailObject.isFavourite
        this.isLiked = this.comicDetailObject.isLiked
        this.isDescriptionPreview = String(this.comicDetailObject.description).length > 30
        console.log('comicDetailObject', comicDetailObject)
      } catch (err) {
        this.$compHelper.breakdown.call(this)
      }
      // change state.
      this.isRequestingDetail = false
    },
    async getEpisodesList () {
      this.isRequestingEpisodes = true
      try {
        const episodesObject = await this.$api.episodes({
          diversionUrl: this.diversionUrl, token: this.token, comicId: this.comicId, page: this.nextEpisodesPage
        })
        this.episodesList.push(...(episodesObject.docs || []))
        this.isEpisodesListEnd = episodesObject.page === episodesObject.pages
        this.nextEpisodesPage += !this.isEpisodesListEnd
        console.log(episodesObject)
      } catch (err) {}
      this.isRequestingEpisodes = false
    },
    async toggleFavourite () {
      if (this.isRequestingFavourite) { return }
      // change state.
      this.isRequestingFavourite = true
      // call api.
      const formerIsFavourite = this.isFavourite
      this.isFavourite = !formerIsFavourite
      try {
        const favouriteAction = await this.$api.favourite({
          diversionUrl: this.diversionUrl, token: this.token, comicId: this.comicId
        })
        this.isFavourite = favouriteAction === 'favourite'
        this.$store.commit('runtime/setIsFavouriteChanged', { nextIsFavouriteChanged: true })
      } catch (err) {
        this.isFavourite = formerIsFavourite
      }
      // change state.
      this.isRequestingFavourite = false
    },
    async toggleLike () {
      if (this.isRequestingLike) { return }
      // change state.
      this.isRequestingLike = true
      // call api.
      const formerIsLiked = this.isLiked
      const formerLikesCount = this.comicDetailObject.likesCount
      this.isLiked = !formerIsLiked
      this.comicDetailObject.likesCount = formerLikesCount + (formerIsLiked ? -1 : 1)
      try {
        const likeAction = await this.$api.like({
          diversionUrl: this.diversionUrl, token: this.token, comicId: this.comicId
        })
        this.isLiked = likeAction === 'like'
        this.comicDetailObject.likesCount = formerLikesCount + (likeAction === 'like' ? 1 : -1)
      } catch (err) {
        this.isLiked = formerIsLiked
        this.comicDetailObject.likesCount = formerLikesCount
      }
      // change state.
      this.isRequestingLike = false
    },
    async getRecommendComic () {
      try {
        this.recommendComicList = (await this.$api.recommend({
          diversionUrl: this.diversionUrl, token: this.token, comicId: this.comicId
        })).comics
        this.isRecommendComicListRequestError = false
      } catch (err) {
        this.isRecommendComicListRequestError = true
      }
    },
    async toggleDownload () {
      this.isChoosingDownLoad = !this.isChoosingDownLoad
    },
    async toggleDownloadChosenList (orderNum) {
      const order = String(orderNum)
      if (this.episodesDownloadedList.includes(order)) { return }
      const chosenSet = new Set(this.episodesDownloadChosenList)
      chosenSet.has(order)
        ? chosenSet.delete(order)
        : chosenSet.add(order)
      this.episodesDownloadChosenList = Array.from(chosenSet)
    },
    async download () {
      // this.$swal.modal.fire('下载功能暂未公测哦，请静候更新')
      this.$swal.modal.fire({
        title: '正在获取信息',
        showCancelButton: false,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        willOpen: () => {
          this.$swal.modal.showLoading()
          this.$swal.modal.clickConfirm()
        },
        preConfirm: () => {
          return this.getComicAllDownloadInfo(this.episodesDownloadChosenList)
        }
      }).then((result) => {
        const comicAllDownloadInfo = result.value
        this.toggleDownload()
        console.log(comicAllDownloadInfo)
        comicAllDownloadInfo.forEach(comicDownloadInfo => {
          this.$api.downloadComic({ comicDownloadInfo: JSON.stringify(comicDownloadInfo) })
        })
        this.episodesDownloadedList.push(...this.episodesDownloadChosenList)
        this.episodesDownloadChosenList = []
      }).catch(() => {
        this.$swal.toast.error.fire('下载失败，请重试')
      })
    },
    async getComicAllDownloadInfo (episodesOrderList) {
      const comicAllDownloadInfo = []
      const comicDetail = {
        ...this.comicDetailObject,
        title: this.comicDetailObject.title,
        _id: this.comicDetailObject._id,
        author: this.comicDetailObject.author,
        chineseTeam: this.comicDetailObject.chineseTeam
      }
      try {
        for (const episodesOrder of episodesOrderList) {
          const pictureInfoList = []
          const firstPageInfo = await this.$api.picture({
            diversionUrl: this.diversionUrl, token: this.token, comicId: this.comicId, epsOrder: episodesOrder, page: 1
          })
          pictureInfoList.push(...firstPageInfo.pages.docs)
          const totalPages = firstPageInfo.pages.pages
          for (let page = 2; page <= totalPages; page++) {
            const pageInfo = await this.$api.picture({
              diversionUrl: this.diversionUrl, token: this.token, comicId: this.comicId, epsOrder: episodesOrder, page
            })
            pictureInfoList.push(...pageInfo.pages.docs)
          }
          const episodesTitle = this.episodesList.find(e => +e.order === +episodesOrder).title || ''
          comicAllDownloadInfo.push({
            // DOCS: the `comicDetail` used in the backend is documented here
            comicDetail: { ...comicDetail, episodesOrder, episodesTitle },
            pictureInfoList
          })
        }
      } catch (err) {
        return Promise.reject(new Error('failed to get info'))
      }
      return comicAllDownloadInfo
    },
    async getDownloadedList () {
      this.episodesDownloadedList = (await this.$api.downloadTree())[this.comicId]?.map(i => '' + i) || []
      console.log('this.episodesDownloadedList', this.episodesDownloadedList)
    },
    async toggleDescriptionPreview () {
      this.isDescriptionPreview = !this.isDescriptionPreview
    },
    async toggleFavouriteAuthor () {
      try {
        await this.$api.favouriteAuthor(this.comicDetailObject.author)
        this.getFavouriteAuthorList()
      } catch (err) {}
    },
    async getFavouriteAuthorList () {
      try {
        this.favouriteAuthorList = await this.$api.favouriteAuthorList()
      } catch (err) {}
    },
    async toggleFavouriteChinese () {
      try {
        await this.$api.favouriteChinese(this.comicDetailObject.chineseTeam)
        this.getFavouriteChineseList()
      } catch (err) {}
    },
    async getFavouriteChineseList () {
      try {
        this.favouriteChineseList = await this.$api.favouriteChineseList()
      } catch (err) {}
    }
  },
  watch: {
    comicId (nextValue) {
      if (!nextValue) { return }
      // init $data.
      Object.assign(this.$data, this.$options.data.call(this))
      this.getComicDetail()
      this.getEpisodesList()
      this.getFavouriteAuthorList()
      this.getFavouriteChineseList()
      this.getRecommendComic()
      this.getDownloadedList()
    }
  },
  created () {
    this.getComicDetail()
    this.getEpisodesList()
    this.getFavouriteAuthorList()
    this.getFavouriteChineseList()
    this.getRecommendComic()
    this.getDownloadedList()
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
      .line-btn {
        display: inline-flex;
        background: @background-btn-default;
        border-radius: .75em;
        margin: 2px;
        margin-left: 10px;
        padding: 4px 9px;
        font-size: 14px;
        line-height: 1em;
        cursor: pointer;
        transition: .2s;
        font-weight: 300;
        &:nth-last-child(1) {
          margin-right: 0;
        }
        &.active {
          color: lighten(@color-font-default, 20%);
          background: lighten(@background-btn-highlight, 25%);
        }
        &:hover {
          transform: scale(110%);
          color: lighten(@color-font-default, 20%);
          background: lighten(@background-btn-highlight, 15%);
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
      font-weight: 300;
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
          &#downloadBtn {
            color: @color-active-highlight-7;
            background-color: fade(@color-active-highlight-7, 15%);
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
        &:not(.disabled):hover {
          transform: scale(110%)
        }
        &.chosen {
          background: lighten(@background-btn-highlight, 25%);
        }
        &.disabled {
          background: darken(@background-btn-default, 29%);
          cursor: not-allowed;
        }
      }
    }
    .state-line {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
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
    .tip-small {
      color: @color-font-default-sub;
    }
  }
  .recommend-card {
    display: flex;
    flex-direction: column;
    width: 100%;
    h2 {
      margin-bottom: 10px;
      margin-top: 60px;
    }
    .comic-list {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      margin-bottom: 20px;
    }
  }
}
</style>
