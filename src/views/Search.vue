<template>
  <div class="search-container" ref="searchContainer">
    <div class="input-card">
      <form @submit.prevent="searchNew()">
        <input type="text" :placeholder="'热门：' + (randomKeyword || '')" v-model="inputKeyword">
      </form>
      <div class="keyword-tag-wrap">
        <tag-item v-for="word in keywordList" :key="word"
          @click.stop="inputKeyword = word; searchNew()"
        >
          {{ word }}
        </tag-item>
      </div>
    </div>
    <div class="display-card" v-if="inputKeyword">
      <div class="menu-area">
        <div class="sort-list">
          <div class="sort-item" @click.stop="changeSort(item.code)" :class="{ current: sort === item.code }"
            v-for="item in $store.state.runtime.sortList" :key="item.code">{{ item.name }}</div>
        </div>
      </div>
      <div v-if="isFoundAny">
        <item-large v-for="item in searchResultList" :key="item._id"
          :item="item" :link="{ name: 'ComicDetail', params: { comicId: item._id } }"
        />
      </div>
      <div class="tip-layer">
        <common-tip-block v-if="isFoundAny && isSearching" :waiting="true">正在加载</common-tip-block>
        <common-tip-block v-if="!isFoundAny">什么都没有</common-tip-block>
        <common-tip-block v-if="isFoundAny && isAll">没有更多了</common-tip-block>
        <common-tip-block v-if="searchResultList.length && !isAll && !isSearching"
          :clickable="true" @click="updatePage()"
        >
          加载更多
        </common-tip-block>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ItemLarge from '../components/ItemLarge'
import TagItem from '../components/TagItem'
import CommonTipBlock from '../components/CommonTipBlock'

export default {
  name: 'Search',
  props: ['kw'],
  components: { ItemLarge, TagItem, CommonTipBlock },
  data () {
    return {
      inputKeyword: '',
      isAll: false,
      isFoundAny: true,
      isSearching: false,
      searchResultList: [],
      nextPage: 1
    }
  },
  computed: {
    ...mapState({
      keywordList: state => state.runtime.keywordList,
      sort: state => state.storage.sort
    }),
    randomKeyword () {
      return this.keywordList[~~(Math.random() * this.keywordList.length)]
    },
    _kw () {
      this.$store.commit('runtime/setSearchKeyword', { nextSearchKeyword: this.kw })
      return this.kw
    }
  },
  methods: {
    updatePage: async function () {
      if (this.isAll) {
        return
      }
      // change state.
      this.isSearching = true
      // call api to search.
      const searchResultInfo = await this.$api.search({
        diversionUrl: this.diversionUrl,
        token: this.token,
        keyword: this.inputKeyword,
        page: this.nextPage,
        sort: this.sort
      })
      this.searchResultList.push(...searchResultInfo.docs)
      console.log(searchResultInfo, searchResultInfo.page, searchResultInfo.pages)
      // change state.
      this.isSearching = false
      // judge if empty.
      if (!searchResultInfo.total) {
        this.isFoundAny = false
      }
      // judge if is all, if not, then pageCount++.
      if (+searchResultInfo.page === +searchResultInfo.pages) {
        this.isAll = true
      } else {
        this.nextPage = this.nextPage + 1
      }
    },
    searchNew: async function () {
      // if: empty keyword, return.
      if (!this.inputKeyword) {
        if (!this.randomKeyword) { return }
        this.inputKeyword = this.randomKeyword
      }
      // if: search the same as the url's query.kw, return.
      console.log(this._kw, 'this.inputKeyword === this._kw', this.inputKeyword === this._kw)
      if (this.inputKeyword === this._kw) {
        return
      }
      // else: a new search, ask for new page url.
      this.$router.push({ name: 'Search', query: { kw: this.inputKeyword } })
    },
    getKeywordList: async function () {
      const nextKeywordList = await this.$api.keyword({ diversionUrl: this.diversionUrl, token: this.token })
      this.$store.commit('runtime/setKeywordList', { nextKeywordList })
      console.log(nextKeywordList)
    },
    changeSort: async function (sortCode) {
      if (this.sort === sortCode) {
        return
      }
      this.$store.commit('storage/setSort', { nextSort: sortCode })
    }
  },
  watch: {
    kw () {
      // init $data.
      Object.assign(this.$data, this.$options.data())
      this.inputKeyword = this._kw
      this.updatePage()
    },
    sort () {
      // init $data.
      Object.assign(this.$data, this.$options.data())
      this.inputKeyword = this._kw
      this.updatePage()
    }
  },
  created () {
    if (!this.keywordList.length) {
      this.getKeywordList()
    }
    this.inputKeyword = this._kw
    if (this._kw) {
      this.updatePage()
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/themes/config';
@import '~@/assets/themes/@{theme-name}/theme';
.search-container {
  .input-card {
    margin: 30px 0 36px 0;
    form {
      input {
        width: 100%;
        display: block;
        box-sizing: border-box;
        height: 48px;
        padding: 18px 26px;
        padding-left: 1em;
        font-size: 20px;
        background: transparent;
        border-radius: 20px;
        border: 2px solid @color-line-default-sub;
        font-family: inherit;
        &:focus {
          box-shadow: 0 0 3px 0 inset @color-line-default-sub;
        }
        outline: none;
      }
    }
    .keyword-tag-wrap {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
      padding-right: 2em;
      position: relative;
      margin: 4px;
    }
  }
  .display-card {
    width: 100%;
    .menu-area {
      width: 100%;
      padding: 15px;
      box-shadow: @shadow-card-default;
      border-radius: .75em;
      .sort-list {
        display: flex;
        overflow-x: scroll;
        width: 50%;
        &::-webkit-scrollbar {
          display: none;
        }
        .sort-item{
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
  }
}
</style>
