<template>
  <div class="post-web-container">
    <div class="display-card">
      <div class="posts-container">
        <post-web-card class="post-card" v-for="item in postsList" :key="item._id" :postWebItem="item"></post-web-card>
      </div>
      <div class="tip-layer">
        <common-tip-block v-if="isFoundAny && isUpdating" :waiting="true">正在加载</common-tip-block>
        <common-tip-block v-if="!isFoundAny">什么都没有</common-tip-block>
        <common-tip-block v-if="!isUpdating && isFoundAny && isAll">最后一页了</common-tip-block>
        <common-tip-block v-if="postsList.length && !isAll && !isUpdating"
          :clickable="true" @click="updatePage()"
        >
          下一页
        </common-tip-block>
      </div>
      <div class="tool-bar">
        <div class="tool-btn" :class="{ disabled: currentPage <= 1 }" @click="toPage(currentPage - 1)">
          <font-awesome-icon icon="angle-left" />
        </div>
        <form @submit.prevent="toPage(toPageInput)">
          第<input name="currentPage" type="number" v-model="toPageInput">页
        </form>
        <div class="tool-btn" :class="{ disabled: currentPage >= totalPage }" @click="updatePage()">
          <font-awesome-icon icon="angle-right" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CommonTipBlock from '../components/CommonTipBlock'
import PostWebCard from '../components/PostWebCard'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faAngleRight, faAngleLeft)

export default {
  name: 'Comments',
  components: { CommonTipBlock, FontAwesomeIcon, PostWebCard },
  data () {
    return {
      commentInput: '',
      isAll: false,
      isFoundAny: true,
      isUpdating: false,
      postsList: [],
      nextPage: 1,
      currentPage: 1,
      totalPage: 1,
      toPageInput: 1
    }
  },
  methods: {
    async updatePage () {
      if (this.nextPage > this.totalPage || this.isUpdating) { return }
      this.postsList = []
      // change state.
      this.isUpdating = true
      // call api to search.
      const [formerCurrentPage, formerToPageInput] = [this.nextPage, this.nextPage]
      this.currentPage = this.nextPage
      this.toPageInput = this.nextPage
      try {
        const postInfo = await this.$api.postInfo({ token: this.token, page: this.nextPage })
        this.totalPage = Math.ceil(postInfo.total / 10)
        this.postsList = postInfo.posts
        console.log(postInfo)
        if (this.nextPage === this.totalPage) {
          this.isAll = true
        }
        if (!postInfo.posts.length) {
          this.isFoundAny = false
        }
        this.nextPage++
      } catch (err) {
        this.currentPage = formerCurrentPage
        this.toPageInput = formerToPageInput
        if (!this.postsList.length) {
          this.$compHelper.breakdown.call(this)
        }
      }
      // change state.
      this.isUpdating = false
    },
    async toPage (_nextPage) {
      if (_nextPage === this.currentPage) { return }
      if (_nextPage > this.totalPage) {
        this.nextPage = this.totalPage
      } else if (_nextPage < 1) {
        this.nextPage = 1
      } else {
        this.nextPage = _nextPage
      }
      this.updatePage()
    }
  },
  created () {
    this.updatePage()
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/themes/config';
@import '~@/assets/themes/@{theme-name}/theme';
.post-web-container {
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
    // flex-direction: column;
    position: fixed;
    right: 15px;
    bottom: 40px;
    .tool-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 30px;
      height: 30px;
      border-radius: 40px;
      background: @background-btn-default;
      margin-top: 5px;
      margin-bottom: 5px;
      cursor: pointer;
      &.disabled {
        cursor: not-allowed;
      }
    }
    form {
      color: @color-font-default-sub;
      font-size: 1em;
      margin: 0 .8em;
      cursor: default;
      input {
        background: transparent;
        border: none;
        width: 1.3em;
        text-align: center;
        color: @color-font-default-highlight;
        font-size: 1em;
        outline-color: @color-line-default-highlight;
        &:focus {
          color: @color-font-default-sub;
        }
        &::-webkit-inner-spin-button{
          -webkit-appearance: none !important;
          margin: 0;
        }
      }
    }
  }
}
</style>
