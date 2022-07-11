<template>
  <div class="user-comments-container">
    <div class="display-card">
      <div class="comments-container">
        <div class="comment-group" v-for="(comicGroup, comicGroupId) in commentsByComicGroup" :key="comicGroupId">
          <router-link :to="{ name: 'ComicDetail', params: { comicId: comicGroupId } }" custom v-slot="{ navigate }">
            <div class="group-title" @click="navigate">{{ comicGroup[0]._comic?.title || ('未知漫画（id：' + comicGroupId + '）') }}</div>
          </router-link>
          <comment-card v-for="item in comicGroup" :key="item._id" :commentItem="item" />
        </div>
      </div>
      <div class="tip-layer">
        <common-tip-block v-if="isFoundAny && isUpdating" :waiting="true">正在加载</common-tip-block>
        <common-tip-block v-if="!isFoundAny">什么都没有</common-tip-block>
        <common-tip-block v-if="isFoundAny && isAll">没有更多了</common-tip-block>
        <common-tip-block v-if="commentsList.length && !isAll && !isUpdating"
          :clickable="true" @click="updatePage()"
        >
          加载更多
        </common-tip-block>
      </div>
    </div>
  </div>
</template>

<script>
import CommentCard from '../components/CommentCard.vue'
import CommonTipBlock from '../components/CommonTipBlock'

export default {
  name: 'UserComments',
  components: { CommentCard, CommonTipBlock },
  data () {
    return {
      commentInput: '',
      isAll: false,
      isFoundAny: true,
      isUpdating: false,
      commentsList: [],
      nextPage: 1,
      isRequestingPersonInfo: true,
      personInfo: {}
    }
  },
  computed: {
    commentsByComicGroup () {
      const commentsByComicGroup = this.renderedCommentsList.reduce((p, c) => {
        if (typeof p[c._comic._id] === 'undefined') {
          p[c._comic._id] = []
        }
        p[c._comic._id].push(c)
        return p
      }, {})
      console.log(commentsByComicGroup)
      return commentsByComicGroup
    },
    renderedCommentsList () {
      if (Object.keys(this.personInfo).length === 0) {
        return this.commentsList
      }
      return this.commentsList.map(obj => {
        obj._user = this.personInfo
        return obj
      })
    }
  },
  methods: {
    async getPersonInfo () {
      // change state.
      this.isRequestingPersonInfo = true
      // call api.
      try {
        const personInfo = await this.$api.personInfo({
          diversionUrl: this.diversionUrl, token: this.token
        })
        this.personInfo = personInfo
        console.log(personInfo)
      } catch (err) {}
      // change state.
      this.isRequestingPersonInfo = false
    },
    async updatePage () {
      if (this.isAll) { return }
      // change state.
      this.isUpdating = true
      // call api to search.
      try {
        const resultInfo = await this.$api.myComments({
          diversionUrl: this.diversionUrl, token: this.token, page: this.nextPage
        })
        const commentsInfo = resultInfo.comments
        this.commentsList.push(...commentsInfo.docs)
        console.log(resultInfo)
        this.isAll = +commentsInfo.page === +commentsInfo.pages
        this.nextPage += !this.isAll
        this.isFoundAny = !!commentsInfo.pages
      } catch (err) {
        if (!this.commentsList.length) {
          this.$compHelper.breakdown.call(this)
        }
      }
      // change state.
      this.isUpdating = false
    }
  },
  created () {
    this.updatePage()
    this.getPersonInfo()
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/themes/config';
@import '~@/assets/themes/@{theme-name}/theme';
.user-comments-container {
  .display-card {
     width: 100%;
    .tip-layer {
      display: flex;
      flex-direction: row;
      justify-content: center;
      margin-top: 10px;
    }
    .comments-container {
      .comment-group {
        margin-top: 15px;
        .group-title {
          padding-left: 1em;
          color: @color-font-default-sub;
          cursor: pointer;
          transition: .2s;
          &:hover {
            color: @color-font-default-highlight;
            text-decoration: underline;
            &::after {
              content: ' >>';
            }
          }
        }
      }
    }
  }
}
</style>
