<template>
  <div class="rank-container">
    <div class="display-card">
      <h1><span class="title-highlight-span">排行：</span>{{ $store.state.runtime.ttList.find(({ code }) => code === tt).name }}</h1>
      <div class="menu-area">
        <div class="tt-list">
          <div class="tt-item" @click.stop="changeTt(item.code)" :class="{ current: tt === item.code }"
            v-for="item in $store.state.runtime.ttList" :key="item.code">{{ item.name }}</div>
        </div>
      </div>
      <div>
        <item-large v-for="item in rankList" :key="item._id"
          :item="item" :link="{ name: 'ComicDetail', params: { comicId: item._id } }"
        />
      </div>
      <div class="tip-layer">
        <common-tip-block v-if="isSearching" :waiting="true">正在加载</common-tip-block>
        <common-tip-block v-if="rankList.length && !isSearching"
          :clickable="true" @click="updatePage()"
        >
          刷新
        </common-tip-block>
      </div>
    </div>
  </div>
</template>

<script>
import ItemLarge from '../components/ItemLarge'
import CommonTipBlock from '../components/CommonTipBlock'

export default {
  name: 'Rank',
  components: { ItemLarge, CommonTipBlock },
  data () {
    return {
      H24List: [],
      D7List: [],
      D30List: [],
      isSearching: false
    }
  },
  computed: {
    rankList () {
      return this[`${this.tt}List`]
    },
    tt () {
      return this.$store.state.runtime.currentTt // H24 D7 D30
    }
  },
  methods: {
    async updatePage () {
      this[`${this.tt}List`] = []
      // change state.
      this.isSearching = true
      // call api to search.
      const rankList = await this.$api.rank({
        diversionUrl: this.diversionUrl, token: this.token, tt: this.tt
      })
      console.log(rankList)
      this[`${this.tt}List`] = [...rankList]
      // change state.
      this.isSearching = false
    },
    async changeTt (tt = 'H24') {
      this.$store.commit('runtime/setCurrentTt', { nextCurrentTt: tt })
    }
  },
  watch: {
    tt: async function () {
      if (!this[`${this.tt}List`].length) {
        await this.updatePage()
      }
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
.rank-container {
  .display-card {
    width: 100%;
    .title-highlight-span {
      color: @color-font-default-highlight;
    }
    .menu-area {
      width: 100%;
      padding: 15px;
      box-shadow: @shadow-card-default;
      border-radius: .75em;
      .tt-list {
        display: flex;
        overflow-x: scroll;
        width: 50%;
        &::-webkit-scrollbar {
          display: none;
        }
        .tt-item{
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
