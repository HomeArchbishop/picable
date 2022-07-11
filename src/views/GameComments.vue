<template>
  <div class="game-comments-container">
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
  name: 'GameComments',
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
    gameId () {
      return this.$route.params.gameId
    }
  },
  methods: {
    async updatePage () {
      if (this.isAll) { return }
      // change state.
      this.isUpdating = true
      // call api to search.
      try {
        const resultInfo = await this.$api.gameComments({
          diversionUrl: this.diversionUrl, token: this.token, gameId: this.gameId, page: this.nextPage
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
      } catch (err) {
        if (!this.commentsList.length) {
          this.$compHelper.breakdown.call(this)
        }
      }
      // change state.
      this.isUpdating = false
    },
    async sendComments () {
      if (!this.commentInput) {
        this.$refs.commentInput.focus()
        return
      }
      try {
        // call api.
        // - tip: sendState: 'success' | string
        const sendState = await this.$api.sendComments(this.token, this.gameId, this.commentInput)
        // judge state.
        if (sendState === 'success') {
          this.$set(this, 'commentInput', '')
          this.$dialog({
            title: '发送成功',
            content: '重进本页面后可见',
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
      } catch (err) {}
    }
  },
  created () {
    this.$route.params.gameId && this.updatePage()
  }
}
</script>

<style lang="less" scoped>
.game-comments-container {
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
