<template>
  <router-link :to="link" custom v-slot="{ navigate }">
    <div class="recommend-item" @click="navigate">
      <div class="img-div" @click.stop="$utils.viewLargeImage($utils.formatImgUrl(item.thumb.fileServer, item.thumb.path))">
        <img :src="$utils.formatImgUrl(item.thumb.fileServer, item.thumb.path)" @click.prevent alt="加载失败">
      </div>
      <div class="content-div">
        <div class="title">{{ item.title }}</div>
        <div class="description">
          <span v-if="description.length > 30">
            {{ description.slice(0, 30) }}...
          </span>
          <span v-else>
            {{ description }}
          </span>
        </div>
        <div class="author">作者：{{ item.author }}</div>
        <div class="chineseTeam">汉化：{{ item.chineseTeam }}</div>
        <div class="tag-div">
          <router-link  v-for="tagName in item.tags" :key="tagName"
            :to="{ name: 'SearchTag', query: { t: tagName } }" custom v-slot="{ navigate }"
          >
            <tag-item @click="navigate">{{ tagName }}</tag-item>
          </router-link>
        </div>
        <div class="detail-div">
          <div class="likeCount">{{ item.likesCount }}喜欢</div>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script>
import TagItem from './TagItem.vue'

export default {
  name: 'ItemLarge',
  props: [
    'item',
    'link'
  ],
  components: { TagItem },
  computed: {
    description () {
      return this.item?.description || ''
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@/assets/themes/config';
@import '~@/assets/themes/@{theme-name}/theme';
.recommend-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  min-height: 200px;
  margin-top: 10px;
  padding: 10px;
  box-shadow: @shadow-card-default;
  border-radius: .75em;
  cursor: pointer;
  .img-div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 140px;
    height: 180px;
    overflow: hidden;
    cursor: pointer;
    img {
      width: 100%;
      max-height: 180px;
      border: none;
    }
  }
  .content-div {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: flex-start;
    margin-left: 10px;
    height: 100%;
    line-height: 25px;
    .title {
      font-size: 18px;
      font-weight: 700;
    }
    .description {
      color: @color-font-default-sub;
    }
    .tag-div {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      .tag {
        display: flex;
        border: 1px solid @color-font-default;
        margin-right: 5px;
        margin-top: 1px;
        padding: 2px;
        height: 18px;
        font-size: 14px;
        line-height: 14px;
        &:last-child {
          margin-right: 0;
        }
      }
    }
    .detail-div {
      display: flex;
      flex-direction: row;
      .likeCount,
      .viewCount {
        display: flex;
        margin-left: 5px;
        margin-top: 8px;
        padding: 2px;
        height: 18px;
        font-size: 14px;
        line-height: 14px;
        &:first-child {
          margin-left: 0;
        }
      }
    }
  }
}
</style>
