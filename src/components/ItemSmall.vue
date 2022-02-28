<template>
  <router-link :to="link" custom v-slot="{ navigate }">
    <div class="recommend-item" @click="navigate">
      <div class="img-div">
        <img :src="$utils.formatImgUrl(item.thumb.fileServer, item.thumb.path)">
      </div>
      <span class="title">
        {{ item.title && item.title.slice(0, 13) }}
        {{ item.title && item.title.length > 13 ? '...' : '' }}
      </span>
      <span class="description">
        {{ item.description }}
      </span>
    </div>
  </router-link>
</template>

<script>
export default {
  name: 'ItemSmall',
  props: [
    'item',
    'link'
  ]
}
</script>
<style lang="less" scoped>
@import '~@/assets/themes/config';
@import '~@/assets/themes/@{theme-name}/theme';
.recommend-item {
  display: flex;
  flex-direction: column;
  width: 140px;
  height: 198px;
  margin-right: 10px;
  margin-top: 10px;
  box-shadow: @shadow-card-default;
  border-radius: .75em;
  overflow: hidden;
  cursor: pointer;
  transition: 200ms;
  &:hover img {
    transform: scale(1.06);
  }
  .img-div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 140px;
    height: 140px;
    overflow: hidden;
    cursor: pointer;
    img {
      flex: 1;
      height: 140px;
      object-fit: cover;
      border: none;
      transition: 500ms;
    }
  }
  .title {
    font-weight: 800;
    font-size: 16px;
    padding: 0 6px;
    margin-top: 4px;
  }
  .description {
    font-size: 13px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    padding: 0 6px;
    margin-top: 4px;
  }
}
</style>
