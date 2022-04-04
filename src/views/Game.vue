<template>
  <div class="category-container">
    <div class="display-card">
      <div class="item-wrap" v-if="!gameList.length">
        <loading-item-small v-for="i in 100" :key="i" />
      </div>
      <div class="item-wrap">
        <game-small v-for="item in gameList" :key="item._id"
          :link="{ name: 'GameDetail', params: { gameId: item._id } }" :item="item"
        />
      </div>
      <div class="tip-layer">
        <common-tip-block v-if="isRequesting" :waiting="true">正在加载</common-tip-block>
        <common-tip-block v-if="gameList.length && !isAll && !isRequesting"
          :clickable="true" @click="updatePage()"
        >
          加载更多
        </common-tip-block>
      </div>
    </div>
  </div>
</template>

<script>
import LoadingItemSmall from '@/components/LoadingItemSmall'
import GameSmall from '../components/GameSmall.vue'
import CommonTipBlock from '../components/CommonTipBlock'

export default {
  name: 'Game',
  components: {
    LoadingItemSmall,
    GameSmall,
    CommonTipBlock
  },
  data () {
    return {
      gameList: [],
      nextPage: 1,
      isAll: false,
      isRequesting: true
    }
  },
  methods: {
    async updatePage () {
      // change state.
      this.isRequesting = true
      // call api.
      const gameListObject = await this.$api.gameList({
        diversionUrl: this.diversionUrl, token: this.token, page: this.nextPage
      })
      console.log(gameListObject)
      this.gameList.push(...gameListObject.docs)
      // update isAll and nextPage.
      this.isAll = +gameListObject.pages === +gameListObject.page
      this.nextPage += !this.isAll
      // change state.
      this.isRequesting = false
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
.category-container {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  .display-card {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 300px;
    .item-wrap {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: flex-start;
      width: 100%;
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
