<template>
  <div class="recent-container">
    <div class="display-card">
      <div v-if="isFoundAny">
        <div v-for="item in recentComicList.filter(o => o)" :key="item._id">
          <item-large v-if="item !== 'failed'"
            :item="item" :link="{ name: 'ComicDetail', params: { comicId: item._id } }"
          />
        </div>
      </div>
      <div class="tip-layer">
        <common-tip-block v-if="isFoundAny && isUpdating" :waiting="true">正在加载</common-tip-block>
        <common-tip-block v-if="!isFoundAny">什么都没有</common-tip-block>
        <common-tip-block v-if="isFoundAny && isAll && !isUpdating">没有更多了</common-tip-block>
        <common-tip-block v-if="recentComicList.length && !isAll && !isUpdating"
          :clickable="true" @click="updatePageComic()"
        >
          加载更多
        </common-tip-block>
      </div>
    </div>
  </div>
</template>

<script>
import ItemLarge from '../components/ItemLarge'
import CommonTipBlock from '../components/CommonTipBlock'

export default {
  name: 'Recent',
  components: { ItemLarge, CommonTipBlock },
  data () {
    return {
      recentComicIdList: [],
      recentComicList: [],
      nextPage: 1,
      isUpdating: false,
      isAll: false,
      isFoundAny: true
    }
  },
  methods: {
    async updatePageComic () {
      // change states.
      this.isUpdating = true
      // call api to update.
      this.recentComicIdList = await window.electronAPI.existRuntimeFile({ file: './recentComicIdList.json' })
        ? JSON.parse(await window.electronAPI.readRuntimeFile({ file: './recentComicIdList.json' }))
        : []
      const recentComicOfNextPage = this.recentComicIdList.slice(10 * (this.nextPage - 1), 10 * this.nextPage)
      if (10 * this.nextPage >= this.recentComicIdList.length) {
        this.isAll = true
      }
      this.nextPage += 1
      if (!this.recentComicIdList.length) {
        this.isFounAny = false
        this.isUpdating = false
      }
      for (const index in recentComicOfNextPage) {
        const comicIndexInShowList = 10 * (this.nextPage - 2) + (+index)
        this.$api.info({
          diversionUrl: this.diversionUrl, token: this.token, comicId: recentComicOfNextPage[index]
        })
          .then(comicInfo => {
            this.recentComicList[comicIndexInShowList] = comicInfo
          })
          .catch(() => {
            this.recentComicList[comicIndexInShowList] = 'failed'
          })
          .finally(() => {
            if (
              this.recentComicList.length === 10 * (this.nextPage - 2) + recentComicOfNextPage.length &&
              this.recentComicList.every(o => o)
            ) {
              this.isUpdating = false
            }
          })
      }
    }
  },
  created () {
    this.updatePageComic()
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/themes/config';
@import '~@/assets/themes/@{theme-name}/theme';
.recent-container {
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
