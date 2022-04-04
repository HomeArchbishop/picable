<template>
  <div class="detail-container">
    <div class="game-card" v-if="!isRequestingDetail">
      <div class="img-div">
        <img :src="$utils.formatImgUrl(icon.fileServer, icon.path)" alt="加载失败"
          @click.stop="$utils.viewLargeImage($utils.formatImgUrl(icon.fileServer, icon.path))"
        >
      </div>
      <div class="content-div">
        <h2 class="title">
          {{ gameDetailObject.title }}
          <div class="star-icon" v-if="gameDetailObject.suggest"></div>
          <div class="adult-icon" v-if="gameDetailObject.adult"></div>
        </h2>
        <router-link custom v-slot="{ navigate }"
          :to="{ name: 'Search', query: { kw: gameDetailObject.publisher || '未知' } }">
          <div>
            作者：
            <div class="line-link" @click="navigate">{{ gameDetailObject.publisher || '未知' }}</div>
          </div>
        </router-link>
        <div>
          最近更新：{{ $utils.getDate(gameDetailObject.updated_at) }}
        </div>
      </div>
    </div>
    <div class="detail-card" v-if="!isRequestingDetail">
      <div class="description">
        <span v-if="isDescriptionPreview">
          {{ gameDetailObject.description.slice(0, 100) }}...
        </span>
        <span v-else>
          {{ gameDetailObject.description }}
        </span>
        <u class="toggle-btn" @click.stop="toggleDescriptionPreview()" v-if="isDescriptionShouldPreview">
          <font-awesome-icon icon="angle-down" v-if="isDescriptionPreview" />
          <font-awesome-icon icon="angle-up" v-else />
        </u>
      </div>
      <div class="func-bar">
        <div class="func-btn" id="likeBtn" :class="{ active: isLiked, loading: isRequestingLike }" @click.stop="toggleLike()">
          <font-awesome-icon icon="heart" />点赞
          <div class="func-btn-badge">{{ gameDetailObject.likesCount }}</div>
        </div>
        <router-link :to="{ name: 'GameComments', params: { gameId } }" custom v-slot="{ navigate }">
          <div class="func-btn" @click="navigate">
            <font-awesome-icon icon="comment-dots" />评论
            <div class="func-btn-badge">{{ gameDetailObject.commentsCount }}</div>
          </div>
        </router-link>
      </div>
    </div>
    <div class="screenshots-card" v-if="gameDetailObject.screenshots">
      <div class="title">游戏截图</div>
      <ul class="img-scroll-ul">
        <li class="img-item-li" v-for="item in gameDetailObject.screenshots" :key="item.path">
          <img :src="$utils.formatImgUrl(item.fileServer, item.path)" alt="加载失败">
        </li>
      </ul>
    </div>
    <div class="download-card" v-if="gameDetailObject.ios || gameDetailObject.android">
        <div class="title">下载链接</div>
      <div class="row" v-if="gameDetailObject.android">
        <img class="android" src="../assets/svg/android.svg"/>
        <router-link :to="{ name: 'Link', query: { link: gameDetailObject.androidLinks[0] } }" custom>
          <div class="link" @click="openPage(gameDetailObject.androidLinks[0])">下载（{{ gameDetailObject.androidSize }}MB）</div>
        </router-link>
      </div>
      <div class="row" v-if="gameDetailObject.ios">
        <img class="android" src="../assets/svg/ios.svg"/>
        <router-link :to="{ name: 'Link', query: { link: gameDetailObject.iosLinks[0] } }" custom>
          <div class="link" @click="openPage(gameDetailObject.androidLinks[0])">下载（{{ gameDetailObject.iosSize }}MB）</div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import { faHeart, faEye, faCommentDots, faBookmark, faDownload, faFileZipper, faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
// import { shell } from 'electron'

library.add(faHeart, faEye, faCommentDots, faBookmark, faDownload, faFileZipper, faAngleDown, faAngleUp)

export default {
  name: 'GameDetailView',
  components: {
    FontAwesomeIcon
  },
  data () {
    return {
      gameDetailObject: {},
      isLiked: false,
      isRequestingDetail: true,
      isRequestingLike: false,
      isDescriptionPreview: false
    }
  },
  computed: {
    icon () {
      return this.gameDetailObject.icon || {}
    },
    gameId () {
      return this.$route.params.gameId
    },
    isDescriptionShouldPreview () {
      return this.gameDetailObject.description
        ? this.gameDetailObject.description.length > 100
        : false
    }
  },
  methods: {
    async getGameDetail () {
      // change state.
      this.isRequestingDetail = true
      // call api.
      this.gameDetailObject = await this.$api.gameInfo({
        diversionUrl: this.diversionUrl, token: this.token, gameId: this.gameId
      })
      this.isLiked = this.gameDetailObject.isLiked
      this.isDescriptionPreview = String(this.gameDetailObject.description).length > 30
      console.log(this.gameDetailObject)
      // change state.
      this.isRequestingDetail = false
    },
    async toggleLike () {
      if (this.isRequestingLike) { return }
      // change state.
      this.isRequestingLike = true
      // call api.
      const likeAction = await this.$api.gameLike({
        diversionUrl: this.diversionUrl, token: this.token, gameId: this.gameId
      })
      console.log(likeAction)
      this.isLiked = likeAction === 'like'
      this.gameDetailObject.likesCount = this.gameDetailObject.likesCount + (likeAction === 'like' ? 1 : -1)
      // change state.
      this.isRequestingLike = false
    },
    async toggleDescriptionPreview () {
      this.isDescriptionPreview = !this.isDescriptionPreview
    },
    openPage (url) {
      window.open(url)
    }
  },
  created () {
    this.getGameDetail()
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
  .game-card {
    display: flex;
    flex-direction: row;
    width: 100%;
    .img-div {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      width: 140px;
      // height: 180px;
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
        .star-icon {
          display: inline-block;
          line-height: 25px;
          background: url('../assets/svg/star.svg') no-repeat;
          width: 1em;
          height: 1em;
          border-radius: 1em;
          border: 2px solid #f4ea2a; // the color is fixed according to svg
        }
        .adult-icon {
          display: inline-block;
          background: url('../assets/svg/adult.svg');
          background-color: fade(@color-font-default-highlight, 20%);
          width: 1em;
          height: 1em;
          border-radius: 1em;
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
  .screenshots-card{
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    padding: 20px;
    box-shadow: @shadow-card-default;
    border-radius: .75em;
    .title {
      display: flex;
      width: fit-content;
      min-width: 4em;
      font-size: 20px;
      font-weight: 900;
      margin-bottom: -4px;
      border-bottom: 3px solid @color-font-default-sub;
      &::before {
        content: '>';
        margin-right: 4px;
      }
    }
    .img-scroll-ul {
      display: -webkit-box;
      -webkit-box-orient: horizontal;
      -webkit-box-direction: normal;
      margin-top: 10px;
      padding: 0;
      overflow-x: scroll;
      overflow-y: hidden;
      .img-item-li {
        display: flex;
        width: 90%;
        box-sizing: content-box;
        img {
          width: 100%;
          background: @color-font-default-sub;
        }
      }
    }
  }
  .download-card {
    display: flex;
    flex-direction: column;
    margin-bottom: 100px;
    margin-top: 10px;
    padding: 20px;
    box-shadow: 0 0 10px 0 @color-font-default-sub;
    border-radius: .75em;
    .title {
      display: flex;
      width: fit-content;
      min-width: 4em;
      font-size: 20px;
      font-weight: 900;
      margin-bottom: -4px;
      border-bottom: 3px solid @color-font-default-sub;
      &::before {
        content: '>';
        margin-right: 4px;
      }
    }
    .row {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-top: 16px;
      img {
        width: 30px;
        height: 30px;
      }
      .link {
        cursor: pointer;
        color: @color-font-default-sub;
        margin-left: .6em;
        &:hover {
          text-decoration-line: underline;
        }
      }
    }
  }
}
</style>
