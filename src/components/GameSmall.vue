<template>
  <router-link :to="link" custom v-slot="{ navigate }">
    <div class="game-item" @click="navigate">
      <div class="star-icon" v-if="item.suggest"></div>
      <div class="adult-icon" v-if="item.adult" :class="{ second: item.suggest }"></div>
      <div class="img-div">
        <img :src="$utils.formatImgUrl(item.icon.fileServer, item.icon.path)">
      </div>
      <span class="title">
        {{ item.title }}
      </span>
    </div>
  </router-link>
</template>

<script>
export default {
  name: 'GameSmall',
  props: [
    'item',
    'link'
  ]
}
</script>

<style lang="less" scoped>
@import '~@/assets/themes/config';
@import '~@/assets/themes/@{theme-name}/theme';
.game-item {
  display: flex;
  flex-direction: column;
  width: 140px;
  height: 198px;
  margin-right: 10px;
  margin-top: 10px;
  box-shadow: @shadow-card-default;
  border-radius: .75em;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  transition: 200ms;
  &:hover img {
    transform: scale(1.06);
  }
  .star-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    background: url('../assets/svg/star.svg') no-repeat;
    width: 2em;
    height: 2em;
    border-radius: 2em;
    border: 2px solid #f4ea2a; // the color is fixed according to svg
    position: absolute;
    right: .2em;
    top: .2em;
    z-index: 60;
  }
  .adult-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    background: url('../assets/svg/adult.svg');
    background-color: fade(@color-font-default-highlight, 20%);
    width: 2em;
    height: 2em;
    border-radius: 2em;
    position: absolute;
    right: .2em;
    top: .2em;
    z-index: 60;
    &.second {
      top: 2.5em;
    }
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
}
</style>
