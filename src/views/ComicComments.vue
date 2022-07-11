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
      <div class="tool-bar">
        <div class="tool-btn" @click="toggleSendCommentCard()">
          <font-awesome-icon icon="comment" />
        </div>
      </div>
      <div class="send-card" v-if="isShowSendCard">
        <textarea v-model="myCommentText" placeholder="在此输入你的伟论..."></textarea>
        <div class="send-btn" @click="sendComments()">发送<font-awesome-icon icon="angle-right" /></div>
      </div>
    </div>
  </div>
</template>

<script>
import CommentCard from '../components/CommentCard.vue'
import CommonTipBlock from '../components/CommonTipBlock'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faComment, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faComment, faAngleRight)

export default {
  name: 'Comments',
  components: { CommentCard, CommonTipBlock, FontAwesomeIcon },
  data () {
    return {
      commentInput: '',
      isAll: false,
      isFoundAny: true,
      isUpdating: false,
      commentsList: [],
      topCommentsList: [],
      nextPage: 1,
      isShowSendCard: false,
      myCommentText: ''
    }
  },
  computed: {
    comicId () {
      return this.$route.params.comicId
    }
  },
  methods: {
    async updatePage () {
      if (this.isAll) { return }
      // change state.
      this.isUpdating = true
      // call api to search.
      try {
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
      } catch (err) {
        if (!this.commentsList.length) {
          this.$compHelper.breakdown.call(this)
        }
      }
      // change state.
      this.isUpdating = false
    },
    async toggleSendCommentCard () {
      this.isShowSendCard = !this.isShowSendCard
    },
    async sendComments () {
      if (!this.myCommentText) { return }
      // call api.
      // - tip: sendState: 'success' | string
      try {
        const sendState = await this.$api.sendComments({
          diversionUrl: this.diversionUrl,
          token: this.token,
          comicId: this.comicId,
          content: this.myCommentText
        })
        console.log(sendState)
        // judge state.
        if (sendState === 'success') {
          this.myCommentText = ''
          this.isShowSendCard = false
          this.$swal.toast.info.fire({
            title: '发送成功',
            text: '重进本页面后可见'
          })
        } else {
          this.$swal.toast.error.fire({
            title: '发送失败',
            text: '请重新发送'
          })
        }
      } catch (err) {}
    }
  },
  created () {
    this.$route.params.comicId && this.updatePage()
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/themes/config';
@import '~@/assets/themes/@{theme-name}/theme';
.comic-comments-container {
  position: relative;
  .display-card {
     width: 100%;
    .tip-layer {
      display: flex;
      flex-direction: row;
      justify-content: center;
      margin-top: 10px;
    }
  }
  .tool-bar {
    display: flex;
    align-items: center;
    flex-direction: column;
    position: fixed;
    right: 15px;
    bottom: 40px;
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
  .send-card {
    position: fixed;
    right: 60px;
    bottom: 40px;
    width: 400px;
    height: 300px;
    background: @background-main;
    opacity: .8;
    border: 2px solid @color-line-default;
    border-radius: .75em;
    padding: 1em 1em calc(1em + 60px) 1em;
    text-align: right;
    textarea {
      display: block;
      width: 100%;
      height: 100%;
      font-size: 20px;
      font-size: 18px;
      font-family: inherit;
      box-sizing: border-box;
      border: none;
      background-color: transparent;
      outline: none;
      transition: .2s;
      resize: none;
    }
    .send-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100px;
      height: 40px;
      padding: 2px 1px 2px 5px;
      margin-top: 20px;
      font-size: 20px;
      border: none;
      background-color: transparent;
      outline: none;
      cursor: pointer;
      border-radius: .75em;
      transition: .2s;
      opacity: 1;
      background-color: @background-btn-default;
      &:hover {
        transform: scale(110%);
        background-color: darken(@background-btn-default, 20%);
      }
    }
  }
}
</style>
