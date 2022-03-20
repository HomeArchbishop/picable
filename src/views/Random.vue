<template>
  <div class="random-container">
    <div class="display-card">
      <div>
        <item-large v-for="item in resultList" :key="item._id"
          :item="item" :link="{ name: 'ComicDetail', params: { comicId: item._id } }"
        />
      </div>
      <div class="tip-layer">
        <common-tip-block v-if="isUpdating" :waiting="true">正在加载</common-tip-block>
        <common-tip-block v-if="!isUpdating"
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
  name: 'random',
  components: { ItemLarge, CommonTipBlock },
  data () {
    return {
      resultList: [],
      isUpdating: false
    }
  },
  methods: {
    updatePage: async function () {
      this.resultList = []
      // change state.
      this.isUpdating = true
      // call api to search.
      const resultList = await this.$api.randomComic({
        diversionUrl: this.diversionUrl, token: this.token
      })
      this.resultList = [...resultList]
      // change state.
      this.isUpdating = false
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
.random-container {
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
