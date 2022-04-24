<template>
<div class="home-container">
  <div class="if-wrap" v-if="isRequestingCollections">
    <div class="unit-group loading" v-for="collectionGroup in collectionsList" :key="'loading' + collectionGroup.title">
      <h2>{{ collectionGroup.title }}</h2>
      <div class="comic-list">
        <loading-item-small v-for="index in 4" :key="'loading' + collectionsList.title + index" />
      </div>
    </div>
  </div>
  <div class="if-wrap" v-else>
    <div class="unit-group" v-for="collectionGroup in collectionsList" :key="collectionGroup.title" v-show="collectionGroup.comics.length">
      <h2>{{ collectionGroup.title }}</h2>
      <div class="comic-list">
        <item-small v-for="item in collectionGroup.comics" :key="collectionsList.title + item._id" :item="item"
          :link="{ name: 'ComicDetail', params: { comicId: item._id } }"
        />
      </div>
    </div>
  </div>
</div>
</template>

<script>
import LoadingItemSmall from '../components/LoadingItemSmall.vue'
import ItemSmall from '../components/ItemSmall.vue'

export default {
  name: 'Home',
  components: {
    LoadingItemSmall,
    ItemSmall
  },
  data () {
    return {
      isRequestingCollections: true,
      collectionsList: [
        { title: '本子妹推薦' },
        { title: '本子母推薦(曬黑/日燒)' },
        { title: '本子神推薦' },
        { title: '本子魔推薦' }
      ]
    }
  },
  methods: {
    getList: async function () {
      // change state.
      this.isRequestingCollections = true
      // call api.
      const shenMoTuiJianList = await this.$api.shenMoCollections({
        diversionUrl: this.diversionUrl, token: this.token
      })
      console.log(shenMoTuiJianList)
      this.collectionsList = shenMoTuiJianList
      // change state.
      this.isRequestingCollections = false
    }
  },
  created () {
    this.getList()
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/themes/config';
@import '~@/assets/themes/@{theme-name}/theme';
.home-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  .unit-group {
    display: flex;
    flex-direction: column;
    width: 100%;
    .comic-list {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      margin-bottom: 20px;
    }
  }
}
</style>
