<template>
  <div class="favourite-container">
    <div class="display-card">
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
  </div>
</template>

<script>
import ItemLarge from '../components/ItemLarge'
import CommonTipBlock from '../components/CommonTipBlock'

export default {
  name: 'Favourite',
  components: { ItemLarge, CommonTipBlock },
  data () {
    return {
      favouriteComicList: [],
      favouriteAuthorList: [],
      favouriteChineseList: [],
      currentType: 'comic', // ? 'comic' | 'author' | 'chinese'
      nextPage: 1, // for 'comic' type
      isUpdating: false, // for 'comic' type
      isAll: false, // for 'comic' type
      isFoundAny: true // for 'comic' type
    }
  },
  methods: {
    updatePageComic: async function () { // for 'comic' type.
      // change states.
      this.isUpdating = true
      // call api to update.
      const myFavouriteListObject = await this.$api.myFavourite({
        diversionUrl: this.diversionUrl, token: this.token, page: this.nextPage
      })
      this.favouriteComicList.push(...myFavouriteListObject.docs)
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
.favourite-container {
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
