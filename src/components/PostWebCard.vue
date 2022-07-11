<template>
  <div class="post-item">
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
    <div class="post-main" ref="postMain">
      <div class="words-row">
        <div>{{ item.content }}</div>
        <div>
          <img v-for="(src, index) in item.medias" :key="index" :src="src" alt="加载失败" class="content-img"
            @click="$utils.viewLargeImage(src)"
          >
        </div>
      </div>
      <div class="detail-bar">
        <div class="count disable">
          <font-awesome-icon icon="heart" />点赞{{ item.totalLikes || 0 }}
        </div>
        <div class="count" :class="{ disable: !item.totalComments }" @click.stop="toggleComments()">
          <font-awesome-icon icon="comment-dots" />评论{{ item.totalComments || 0 }}
        </div>
      </div>
    </div>
    <div class="post-comment" v-if="isShowComment && (commentList.length || isRequestingComment)">
      <post-web-comment-card v-for="item in commentList" :key="item._id" :commentItem="item" />
      <div class="tip-layer">
        <common-tip-block v-if="isRequestingComment" :waiting="true">评论加载中...</common-tip-block>
        <common-tip-block v-if="!isRequestingComment"
          :clickable="true" @click="toggleComments()"
        >
          收起
        </common-tip-block>
        <common-tip-block v-if="!isRequestingComment && !isCommentAll"
          :clickable="true" @click="updateComments()"
        >
          加载更多
        </common-tip-block>
      </div>
    </div>
  </div>

</template>

<script>
import { black } from '../assets/img/black'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faMars, faVenus, faHeart, faCommentDots } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import PostWebCommentCard from './PostWebCommentCard'
import CommonTipBlock from '../components/CommonTipBlock'

library.add(faMars, faVenus, faHeart, faCommentDots)

export default {
  name: 'PostWebCard',
  components: {
    FontAwesomeIcon,
    PostWebCommentCard,
    CommonTipBlock
  },
  props: ['postWebItem'],
  data () {
    return {
      commentList: [],
      commentNextPage: 1,
      isRequestingComment: false,
      isShowComment: false,
      isCommentAll: false
    }
  },
  computed: {
    avatarImg () {
      return this.item._user?.avatar || black
    },
    createdTime () {
      return this.$utils.getCalendarTime(this.item.createdAt)
    },
    item: {
      set () {},
      get () {
        return this.postWebItem
      }
    }
  },
  methods: {
    async updateComments () {
      if (this.isCommentAll || !this.item.totalComments || this.isRequestingComment) { return }
      // change state.
      this.isRequestingComment = true
      // call api.
      try {
        const commentObj = await this.$api.postWebComments({
          token: this.token, postId: this.item._id + 'd', page: this.commentNextPage
        })
        this.commentList.push(...commentObj.comments)
        console.log(commentObj)
        this.isCommentAll = +commentObj.total < +commentObj.limit * this.commentNextPage
        this.commentNextPage += 1
      } catch (err) {}
      // change state.
      this.isRequestingComment = false
    },
    async toggleComments () {
      if (!this.commentList.length) {
        this.updateComments()
      }
      this.isShowComment = !this.isShowComment
      if (!this.isShowComment) {
        this.$refs.postMain.scrollIntoViewIfNeeded()
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/themes/config';
@import '~@/assets/themes/@{theme-name}/theme';
.post-item {
  margin-top: 30px;
  width: 85%;
  max-width: 530px;
  .name-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    color: @color-font-default-sub;
    font-size: .8em;
    img {
      width: 40px;
      height: 40px;
      border-radius: 40px;
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
  .post-main {
    // min-height: 200px;
    padding: 14px 20px;
    box-shadow: @shadow-card-default;
    border-radius: .75em;
    position: relative;
    overflow: hidden;
    .words-row {
      margin-top: .8em;
      text-indent: 2em;

      .content-img {
        width: 80%;
        max-width: 500px;
      }
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
  .post-comment {
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
