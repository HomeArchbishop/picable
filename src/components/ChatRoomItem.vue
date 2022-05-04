<template>
  <router-link :to="{ name: 'ChatRoom', query: { url: item.url, name: item.title } }" custom v-slot="{ navigate }">
    <div class="recommend-item" @click="navigate">
      <div class="img-div">
        <img :src="item.avatar" @click.stop="$utils.viewLargeImage(item.avatar)" alt="加载失败">
      </div>
      <div class="content-div">
        <div class="title">{{ item.title }}</div>
        <div class="description">{{ item.description }}</div>
      </div>
    </div>
  </router-link>
</template>

<script>
export default {
  name: 'ChatRoomItem',
  props: ['item']
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
  font-weight: 300;
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
      border-radius: 100%;
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
      font-weight: normal;
    }
    .description {
      color: @color-font-default-sub;
    }
  }
}
</style>
