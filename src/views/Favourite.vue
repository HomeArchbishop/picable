<template>
  <div class="favourite-container">
    <div class="display-card">
      <div class="menu-area">
        <div class="type-list">
          <div class="type-item" @click.stop="changeType(item.code)" :class="{ current: currentType === item.code }"
            v-for="item in $store.state.runtime.favouriteTypeList" :key="item.code">{{ item.name }}</div>
        </div>
      </div>
      <div v-if="currentType === 'comic'">
        <div v-if="isFoundAny">
          <item-large v-for="item in favouriteComicList" :key="item._id"
            :item="item" :link="{ name: 'ComicDetail', params: { comicId: item._id } }"
          />
        </div>
        <div class="tip-layer">
          <common-tip-block v-if="isFoundAny && isUpdating" :waiting="true">正在加载</common-tip-block>
          <common-tip-block v-if="!isFoundAny">什么都没有</common-tip-block>
          <common-tip-block v-if="isFoundAny && isAll">没有更多了</common-tip-block>
          <common-tip-block v-if="favouriteComicList.length && !isAll && !isUpdating"
            :clickable="true" @click="updatePageComic()"
          >
            加载更多
          </common-tip-block>
        </div>
      </div>
      <div v-if="currentType === 'author'">
        <div v-if="isFoundAnyAuthor">
          <form @submit.prevent>
            <font-awesome-icon icon="magnifying-glass" class="icon" @click="$refs.inputAuthor.focus()" />
            <input type="text" v-model="searchAuthorKeyword" ref="inputAuthor" @keyup="searchAuthor()">
            <span class="search-tip" v-if="searchAuthorKeyword">{{ searchAuthorActiveList.length }}条结果</span>
          </form>
          <router-link v-for="name in favouriteAuthorList" :key="name"
            :to="{ name: 'Search', query: { kw: name } }"
            custom v-slot="{ navigate }"
          >
            <div class="item-block" @click="navigate" :id="`author_${name}`"
              :class="{ highlight: searchAuthorActiveList.includes(name) }"
            >
              {{ name }}
            </div>
          </router-link>
        </div>
        <div class="tip-layer">
          <common-tip-block v-if="isUpdatingAuthor">正在加载</common-tip-block>
          <common-tip-block v-if="!isUpdatingAuthor && !isFoundAnyAuthor">什么都没有</common-tip-block>
          <common-tip-block v-if="favouriteAuthorList.length && !isUpdatingAuthor"
            :clickable="true" @click="updatePageAuthor()"
          >
            刷新
          </common-tip-block>
        </div>
      </div>
      <div v-if="currentType === 'chinese'">
        <div v-if="isFoundAnyChinese">
          <form @submit.prevent>
            <font-awesome-icon icon="magnifying-glass" class="icon" @click="$refs.inputChinese.focus()" />
            <input type="text" v-model="searchChineseKeyword" ref="inputChinese" @keyup="searchChinese()">
            <span class="search-tip" v-if="searchChineseKeyword">{{ searchChineseActiveList.length }}条结果</span>
          </form>
          <router-link v-for="name in favouriteChineseList" :key="name"
            :to="{ name: 'Search', query: { kw: name } }"
            custom v-slot="{ navigate }"
          >
            <div class="item-block" @click="navigate" :id="`chinese_${name}`"
              :class="{ highlight: searchChineseActiveList.includes(name) }"
            >
              {{ name }}
            </div>
          </router-link>
        </div>
        <div class="tip-layer">
          <common-tip-block v-if="isUpdatingChinese">正在加载</common-tip-block>
          <common-tip-block v-if="!isUpdatingChinese && !isFoundAnyChinese">什么都没有</common-tip-block>
          <common-tip-block v-if="favouriteChineseList.length && !isUpdatingChinese"
            :clickable="true" @click="updatePageChinese()"
          >
            刷新
          </common-tip-block>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ItemLarge from '../components/ItemLarge'
import CommonTipBlock from '../components/CommonTipBlock'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faMagnifyingGlass)

export default {
  name: 'Favourite',
  components: { ItemLarge, CommonTipBlock, FontAwesomeIcon },
  data () {
    return {
      isPageFirstEnter: true,
      favouriteComicList: [],
      favouriteAuthorList: [],
      favouriteChineseList: [],
      favouriteComicTotalCnt: 0,
      currentType: 'comic', // ? 'comic' | 'author' | 'chinese'
      typeInitState: { comic: false, author: false, chinese: false },
      nextPage: 1, // for 'comic' type
      isUpdating: true, // for 'comic' type
      isAll: false, // for 'comic' type
      isFoundAny: true, // for 'comic' type
      isUpdatingAuthor: true,
      isFoundAnyAuthor: true,
      isUpdatingChinese: true,
      isFoundAnyChinese: true,
      searchAuthorKeyword: '',
      searchAuthorActiveList: [],
      searchChineseKeyword: '',
      searchChineseActiveList: []
    }
  },
  methods: {
    async updatePageComic () { // for 'comic' type.
      // change states.
      this.isUpdating = true
      // call api to update.
      const myFavouriteListObject = await this.$api.myFavourite({
        diversionUrl: this.diversionUrl, token: this.token, page: this.nextPage
      })
      this.favouriteComicList.push(...myFavouriteListObject.docs)
      this.favouriteComicTotalCnt = myFavouriteListObject.total
      if (myFavouriteListObject.page === myFavouriteListObject.pages) {
        this.isAll = true
      } else {
        this.nextPage += 1
      }
      if (!myFavouriteListObject.pages) {
        this.isFounAny = false
      }
      // change states.
      this.isUpdating = false
    },
    async updatePageAuthor () { // for 'author' type.
      this.favouriteAuthorList = []
      // change states.
      this.isUpdatingAuthor = true
      // call api to update.
      this.favouriteAuthorList = await this.$api.favouriteAuthorList()
      this.isFoundAnyAuthor = !!this.favouriteAuthorList.length
      // change states.
      this.isUpdatingAuthor = false
    },
    async updatePageChinese () { // for 'chinese' type.
      this.favouriteChineseList = []
      // change states.
      this.isUpdatingChinese = true
      // call api to update.
      this.favouriteChineseList = await this.$api.favouriteChineseList()
      this.isFoundAnyChinese = !!this.favouriteChineseList.length
      // change states.
      this.isUpdatingChinese = false
    },
    async searchAuthor () {
      const kw = this.searchAuthorKeyword
      if (!kw) {
        this.searchAuthorActiveList = []
        return
      }
      this.searchAuthorActiveList = this.favouriteAuthorList.filter(name => new RegExp(kw, 'gi').test(name))
    },
    async searchChinese () {
      const kw = this.searchChineseKeyword
      if (!kw) {
        this.searchChineseActiveList = []
        return
      }
      this.searchChineseActiveList = this.favouriteChineseList.filter(name => new RegExp(kw, 'gi').test(name))
    },
    changeType (nextType) {
      if (nextType === this.currentType) { return }
      this.currentType = ''
      setTimeout(() => {
        this.currentType = nextType
      }, 80)
    }
  },
  watch: {
    currentType: {
      handler (nextType) {
        switch (nextType) {
          case 'comic':
            this.typeInitState[nextType] === false && this.updatePageComic()
            break
          case 'author':
            this.updatePageAuthor()
            break
          case 'chinese':
            this.updatePageChinese()
            break
        }
        this.typeInitState[nextType] = true
      },
      immediate: true
    }
  },
  async activated () {
    if (this.isPageFirstEnter) {
      this.isPageFirstEnter = false
      return
    }
    const myFavouriteListObject = await this.$api.myFavourite({
      diversionUrl: this.diversionUrl, token: this.token, page: 1
    })
    if (myFavouriteListObject.total !== this.favouriteComicTotalCnt) {
      console.log('!!!!!')
      const formerType = this.currentType
      Object.assign(this.$data, this.$options.data(), { currentType: '', isPageFirstEnter: false })
      this.currentType = formerType
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/themes/config';
@import '~@/assets/themes/@{theme-name}/theme';
.favourite-container {
  .display-card {
    width: 100%;
    .menu-area {
      width: 100%;
      padding: 15px;
      box-shadow: @shadow-card-default;
      border-radius: .75em;
      .type-list {
        display: flex;
        overflow-x: scroll;
        width: 50%;
        &::-webkit-scrollbar {
          display: none;
        }
        .type-item{
          display: flex;
          min-width: 2em;
          cursor: pointer;
          transition: .2s;
          &:not(:nth-child(1)) {
            margin-left: 10px;
          }
          &:hover {
            color: @color-font-default-highlight;
          }
          &.current {
            cursor: default;
            color: @color-font-default-highlight;
          }
        }
      }
    }
    .tip-layer {
      display: flex;
      flex-direction: row;
      justify-content: center;
      margin-top: 10px;
    }
    form {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-top: 20px;
      width: 100%;
      position: relative;
      .icon {
        display: inline;
        transform: translateX(34px);
        color: @color-font-default-sub;
        z-index: 1;
      }
      input {
        width: 8em;
        display: inline-block;
        box-sizing: border-box;
        background: transparent;
        padding: 9px 18px 9px 40px;
        border-radius: 20px;
        border: 2px solid @color-line-default-sub;
        font-family: inherit;
        font-size: 1em;
        transition: .2s;
        color: @color-font-default-sub;
        &:focus {
          box-shadow: 0 0 3px 0 inset @color-line-default-sub;
          border-color: darken(@color-line-default-sub, .4);
          width: 50%;
        }
        &:not(:focus) + .search-tip {
          display: none;
        }
        outline: none;
      }
      .search-tip {
        display: inline-block;
        position: absolute;
        right: 16px;
        font-size: .9em;
        color: @color-font-default-sub;
      }
    }
    .item-block {
      display: inline-flex;
      background: @background-btn-default;
      border-radius: .75em;
      margin-top: 10px;
      margin-right: 10px;
      padding: 4px 9px;
      font-size: 14px;
      line-height: 2em;
      cursor: pointer;
      transition: .2s;
      font-weight: 300;
      &:nth-last-child(1) {
        margin-right: 0;
      }
      &.highlight {
        color: lighten(@color-font-default, 20%);
        background: lighten(@background-btn-highlight, 20%);
      }
      &:hover {
        transform: scale(110%);
        color: lighten(@color-font-default, 20%);
        background: lighten(@background-btn-highlight, 15%);
      }
    }
  }
}
</style>
