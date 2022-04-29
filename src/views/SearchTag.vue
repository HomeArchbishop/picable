<template>
  <div class="search-container" ref="searchContainer">
    <h1><span class="title-highlight-span">标签：</span>{{ t }}</h1>
    <div class="display-card" v-if="t">
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
import CommonTipBlock from '../components/CommonTipBlock'

export default {
  name: 'SearchTag',
  components: { ItemLarge, CommonTipBlock },
  props: ['t'],
  data () {
    return {
      searchResultList: [],
      nextPage: 1,
      isAll: false,
      isFoundAny: true,
      isSearching: false
    }
  },
  computed: {
    ...mapState({
      sort: state => state.storage.sort
    })
  },
  methods: {
    async updatePage () {
      if (this.isAll) { return }
      // change state.
      this.isSearching = true
      // call api to search.
      const searchResultInfo = await this.$api.searchTag({
        diversionUrl: this.diversionUrl,
        token: this.token,
        tag: this.t,
        page: this.nextPage,
        sort: this.sort
      })
      console.log(searchResultInfo.docs)
      this.searchResultList.push(...searchResultInfo.docs)
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
    async changeSort (sortCode) {
      if (this.sort === sortCode) {
        return
      }
      this.$store.commit('storage/setSort', { nextSort: sortCode })
    }
  },
  watch: {
    t () {
      // init result data.
      Object.assign(this.$data, this.$options.data())
      // call for new data.
      this.updatePage()
    },
    sort () {
      // init $data.
      Object.assign(this.$data, this.$options.data())
      this.updatePage()
    }
  },
  created () {
    if (this.t) {
      this.updatePage()
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/themes/config';
@import '~@/assets/themes/@{theme-name}/theme';
.search-container {
  .title-highlight-span {
    color: @color-font-default-highlight;
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
