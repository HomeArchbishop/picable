<template>
  <div class="comic-comments-container">
    <div class="display-card">
      <div class="comments-container">
        <comment-card v-for="item in topCommentsList" :key="item._id" :commentItem="item" />
        <comment-card v-for="item in commentsList" :key="item._id" :commentItem="item" />
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
  name: 'Comments',
  components: { CommentCard, CommonTipBlock },
  data () {
    return {
      commentInput: '',
      isAll: false,
      isFoundAny: true,
      isUpdating: false,
      commentsList: [],
      topCommentsList: [],
      nextPage: 1
    }
  },
  computed: {
    comicId () {
      return this.$route.params.comicId
    }
  },
  methods: {
    updatePage: async function () {
      if (this.isAll) { return }
      // change state.
      this.isUpdating = true
      // call api to search.
      const resultInfo = await this.$api.comments({
        diversionUrl: this.diversionUrl, token: this.token, comicId: this.comicId, page: this.nextPage
      })
      const commentsInfo = resultInfo.comments
      this.commentsList.push(...commentsInfo.docs.filter(item => !item.isTop))
      if (+commentsInfo.page === 1) {
        const topCommentsList = resultInfo.topComments
        this.topCommentsList.push(...topCommentsList)
      }
      console.log(resultInfo)
      this.isAll = +commentsInfo.page === +commentsInfo.pages
      this.nextPage += !this.isAll
      this.isFoundAny = !!commentsInfo.pages
      // change state.
      this.isUpdating = false
    },
    sendComments: async function () {
      if (!this.commentInput) {
        this.$refs.commentInput.focus()
        return
      }
      // call api.
      // - tip: sendState: 'success' | string
      const sendState = await this.$api.sendComments(this.token, this.comicId, this.commentInput)
      // judge state.
      if (sendState === 'success') {
        this.$set(this, 'commentInput', '')
        this.$dialog({
          title: '发送成功',
          content: '评论刷新页面后可见。',
          autoClose: 3000
        })
      } else {
        const _this = this
        this.$dialog({
          title: '发送失败',
          content: '请重新发送。',
          confirm () {
            _this.$refs.commentInput.focus()
          },
          close () {
            _this.$refs.commentInput.focus()
          }
        })
      }
    }
  },
  created () {
    this.$route.params.comicId && this.updatePage()
  }
}
</script>

<style lang="less" scoped>
.comic-comments-container {
  .display-card {
     width: 100%;
    .tip-layer {
      display: flex;
      flex-direction: row;
      justify-content: center;
      margin-top: 10px;
    }
  }
}
</style>
