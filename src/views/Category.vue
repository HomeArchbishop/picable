<template>
  <div class="category-container">
    <div class="display-card">
      <h2 class="title">小程序</h2>
      <div class="item-wrap" v-if="!appList.length && !webList.length">
        <loading-item-small v-for="i in 12" :key="i" />
      </div>
      <div class="item-wrap">
        <item-small v-for="item in webList" :key="item._id + item.title" :item="item"
          :link="{ name: 'Link', query: { link: item.link } }" />
        <item-small v-for="item in appList" :key="item._id + item.title" :item="item"
          :link="{ name: item.toName }" />
      </div>
    </div>
    <div class="display-card">
      <h2 class="title">分类</h2>
      <div class="item-wrap" v-if="!cateList.length">
        <loading-item-small v-for="i in 12" :key="i" />
      </div>
      <div class="item-wrap">
        <item-small v-for="item in cateList" :key="item._id + item.title" :item="item"
          :link="{ name: 'SearchCategory', query: { c: item.title } }" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import LoadingItemSmall from '@/components/LoadingItemSmall'
import ItemSmall from '../components/ItemSmall.vue'

export default {
  name: 'Category',
  components: {
    LoadingItemSmall,
    ItemSmall
  },
  data () {
    return {
      appList: [],
      webList: [],
      cateList: []
    }
  },
  computed: {
    ...mapState({
      categoryList: state => state.runtime.categoryList // contain web & app & cate.
    })
  },
  methods: {
    getCategoryList: async function () {
      const categoryList = await this.$api.categories({
        diversionUrl: this.diversionUrl, token: this.token
      })
      this.$store.commit('runtime/setCategoryList', { nextCategoryList: categoryList })
      console.log(this.categoryList)
      // set values in each data.
      this.categoryList.forEach(item => {
        if (item.isWeb) {
          this.webList.push(item)
          return
        }
        if (item.isApp) {
          this.appList.push(item)
          return
        }
        this.cateList.push(item)
      })
    }
  },
  created: async function () {
    if (!this.categoryList.length) {
      this.getCategoryList()
    }
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
    .title {
      margin-bottom: 10px;
    }
    .item-wrap {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: flex-start;
      width: 100%;
    }
  }
}
</style>
