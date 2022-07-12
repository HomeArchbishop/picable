<template>
  <div class="recent-container">
    <div class="display-card">
      <div v-if="isFoundAny">
        <div v-for="(item, index) in recentComicList" :key="'comic-' + index">
          <loading-item-large v-if="item === 'failed'" failed
            :comic-id="recentComicIdList[index]"
            @click="loadOneComicInfo(recentComicIdList[index], index)"
          />
          <loading-item-large v-else-if="item === 'waiting'" />
          <item-large v-else
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
import LoadingItemLarge from '../components/LoadingItemLarge.vue'

export default {
  name: 'Recent',
  components: { ItemLarge, CommonTipBlock, LoadingItemLarge },
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
      this.recentComicIdList = await this.$api.getRecentComic()
      const recentComicOfNextPage = this.recentComicIdList.slice(10 * (this.nextPage - 1), 10 * this.nextPage)
      if (10 * this.nextPage >= this.recentComicIdList.length) {
        this.isAll = true
      }
      this.nextPage += 1

      this.isFoundAny = !!this.recentComicIdList.length

      this.recentComicList.push(...Array.from({ length: recentComicOfNextPage.length }).fill('waiting'))

      const taskStack = []
      for (const index in recentComicOfNextPage) {
        const comicIndexInShowList = 10 * (this.nextPage - 2) + (+index)
        taskStack.push(this.loadOneComicInfo(recentComicOfNextPage[index], comicIndexInShowList))
      }
      Promise.all(taskStack).then(() => {
        this.isUpdating = false
      })
    },
    async loadOneComicInfo (comicId, comicIndexInShowList) {
      this.recentComicList[comicIndexInShowList] = 'waiting'
      try {
        const comicInfo = await this.$api.info({
          diversionUrl: this.diversionUrl, token: this.token, comicId
        })
        this.recentComicList[comicIndexInShowList] = comicInfo
      } catch (err) {
        this.recentComicList[comicIndexInShowList] = 'failed'
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
