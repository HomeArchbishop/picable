<template>
  <div class="comment-item" v-if="!item.hide">
    <div class="comment-main">
      <div class="top-tag" v-if="item.isTop">
        <div class="bg"></div>
        <div class="tag-word"><font-awesome-icon icon="star" /></div>
      </div>
      <div class="name-row">
        <div>
          <img :src="avatarImg" @click.prevent @click="$utils.viewLargeImage(avatarImg)">
        </div>
        <div class="info-bar">
          <div>
            <div class="name">
              {{ (item._user?.name.substr(0, 20) || '未知用户') + (item._user?.name.slice(20) ? '...' : '') }}
            </div>
            <div v-if="['m', 'f'].includes(item._user?.gender)">&emsp;</div>
            <font-awesome-icon :icon="{ m: 'mars', f: 'venus' }[item._user?.gender]"
              v-if="['m', 'f'].includes(item._user?.gender)" class="gender-badge"
            />
            <span v-if="item._user">&emsp;Lv{{ item._user?.level }} [{{ item._user?.title }}]</span>
          </div>
          <div>{{ createdTime }}</div>
        </div>
      </div>
      <div class="words-row">
        {{ item.content }}
      </div>
      <div class="detail-bar">
        <div class="count" :class="{ active: item.isLiked, loading: isAskLiked }" @click.stop="commentLike()">
          <font-awesome-icon icon="heart" />点赞{{ item.likesCount || 0 }}
        </div>
        <div class="count" :class="{ disable: !item.commentsCount }" @click.stop="toggleChildrenComments()">
          <font-awesome-icon icon="comment-dots" />评论{{ item.commentsCount || 0 }}
        </div>
      </div>
    </div>
    <div class="comment-children" v-if="isShowChildrenComment && (childrenCommentList.length || isRequestingChildrenComment)">
      <comment-card v-for="item in childrenCommentList" :key="item._id" :commentItem="item" />
      <div class="tip-layer">
        <common-tip-block v-if="isRequestingChildrenComment" :waiting="true">子评论加载中...</common-tip-block>
        <common-tip-block v-if="!isRequestingChildrenComment"
          :clickable="true" @click="toggleChildrenComments()"
        >
          收起
        </common-tip-block>
        <common-tip-block v-if="!isRequestingChildrenComment && !isChildrenCommentAll"
          :clickable="true" @click="updateChildrenComments()"
        >
          加载更多
        </common-tip-block>
      </div>
    </div>
  </div>

</template>

<script>
import CommentCard from './CommentCard'
import { black } from '../assets/img/black'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faMars, faVenus, faHeart, faCommentDots, faStar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import CommonTipBlock from '../components/CommonTipBlock'

library.add(faMars, faVenus, faHeart, faCommentDots, faStar)

export default {
  name: 'CommentCard',
  components: {
    CommentCard,
    FontAwesomeIcon,
    CommonTipBlock
  },
  props: ['commentItem'],
  data () {
    return {
      childrenCommentList: [],
      childrenCommentNextPage: 1,
      isRequestingChildrenComment: false,
      isShowChildrenComment: false,
      isChildrenCommentAll: false,
      isAskLiked: false
    }
  },
  computed: {
    avatarImg () {
      const fileServer = this.item._user?.avatar?.fileServer
      const path = this.item._user?.avatar?.path
      return (fileServer && path) ? this.$utils.formatImgUrl(fileServer, path) : black
    },
    createdTime () {
      return this.$utils.getCalendarTime(this.item.created_at)
    },
    item: {
      set () {},
      get () {
        return this.commentItem
      }
    }
  },
  methods: {
    commentLike: async function () {
      if (this.isAskLiked) { return }
      // change state.
      this.isAskLiked = true
      // pretend to be callback, for a more smooth use.
      const { likesCount } = this.item
      this.item.likesCount += this.item.isLiked ? -1 : 1
      this.item.isLiked = !this.item.isLiked
      // call api.
      const likeAction = await this.$api.commentLike({
        diversionUrl: this.diversionUrl, token: this.token, commentId: this.item._id
      })
      this.item.isLiked = likeAction === 'like'
      this.item.likesCount = likesCount + (likeAction === 'like' ? 1 : -1)
      // change state.
      this.isAskLiked = false
    },
    updateChildrenComments: async function () {
      if (this.isChildrenCommentAll || !this.item.commentsCount || this.isRequestingChildrenComment) { return }
      // change state.
      this.isRequestingChildrenComment = true
      // call api.
      const commentObj = await this.$api.childrenComments({
        diversionUrl: this.diversionUrl, token: this.token, commentId: this.item._id, page: this.childrenCommentNextPage
      })
      this.childrenCommentList.push(...commentObj.docs)
      console.log(commentObj, this.childrenCommentList)
      this.isChildrenCommentAll = +commentObj.page === +commentObj.pages
      this.childrenCommentNextPage = this.childrenCommentNextPage + !this.isChildrenCommentAll
      // change state.
      this.isRequestingChildrenComment = false
    },
    toggleChildrenComments: async function () {
      this.isShowChildrenComment = !this.isShowChildrenComment
      // init first time we call for children comments.
      !this.childrenCommentList.length && this.updateChildrenComments()
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/themes/config';
@import '~@/assets/themes/@{theme-name}/theme';
.comment-item {
  .comment-main {
    width: 100%;
    // min-height: 200px;
    padding: 14px 20px;
    margin-top: 10px;
    box-shadow: @shadow-card-default;
    border-radius: .75em;
    position: relative;
    overflow: hidden;
    .top-tag {
      width: 54px;
      height: 54px;
      position: absolute;
      top: 0;
      right: 0;
      .bg {
        font-size: 18px;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 0px 54px 54px 0;
        border-color: transparent fade(@background-btn-highlight, 60%) transparent transparent;
      }
      .tag-word {
        color: @background-main;
        position: absolute;
        top: 6px;
        right: 6px;
        font-size: 1.2em;
        // transform: rotate(45deg);
        user-select: none;
      }
    }
    .name-row {
      display: flex;
      flex-direction: row;
      align-items: center;
      img {
        width: 60px;
        height: 60px;
        border-radius: 60px;
      }
      .info-bar {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        margin-left: 14px;
        .name {
          font-size: 1.1em;
        }
        div {
          display: flex;
          flex-direction: row;
          align-items: baseline;
        }
      }
    }
    .words-row {
      margin-top: .8em;
      text-indent: 2em;
    }
    .detail-bar {
      display: flex;
      flex-direction: row;
      align-items: baseline;
      justify-content: flex-end;
      margin-top: .8em;
      .count {
        margin-left: 1em;
        user-select: none;
        cursor: pointer;
        &.active {
          color: @color-font-default-highlight;
        }
        &.loading {
          cursor: wait;
        }
        &.disable {
          cursor: default;
        }
      }
    }
  }
  .comment-children {
    padding-left: 42px;
    border-left: 4px solid #eee;
    .tip-layer {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      margin-top: 8px;
    }
  }
}
</style>
