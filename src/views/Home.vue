<template>
<div class="home-container">
  <div v-if="isRequestingCollections">
    <div class="unit-group loading" v-for="collectionGroupIndex in 2" :key="'loading' + collectionGroupIndex">
      <h2 class="loading-unit-group-title">
        <div class="cover"></div>
      </h2>
      <div class="comic-list">
        <loading-item-small v-for="index in 4" :key="'loading' + collectionGroupIndex + index" />
      </div>
    </div>
  </div>
  <div v-else>
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
      collectionsList: []
    }
  },
  methods: {
    async getList () {
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
  .unit-group {
    display: flex;
    flex-direction: column;
    width: 100%;
    .loading-unit-group-title {
      width: 8em;
      background: #eee;
      padding: 0;
      .cover {
        width: 100%;
        height: 1.4em;
        animation: loading 5s linear infinite;
        background-image: linear-gradient(50deg, transparent, transparent, #fafafa 55%, transparent, transparent);
        background-size: 400% 100%;
        z-index: 3;
      }
    }
    .comic-list {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      margin-bottom: 20px;
    }
  }
}
@keyframes loading {
  0% {
    background-position: 400% 50%
  }
  to {
    background-position: 0% 50%
  }
}
</style>
