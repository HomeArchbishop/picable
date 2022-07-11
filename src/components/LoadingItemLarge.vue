<template>
<div class="recommend-item" :class="{ failed }">
  <div class="waiting" v-if="!failed">
    <div class="cover"></div>
    <div class="img-div"></div>
    <div class="content-div">
      <div class="title"></div>
      <div class="long"></div>
      <div class="short"></div>
      <div class="short"></div>
    </div>
  </div>
  <div class="failed" v-else>
    <div class="btn">
      <font-awesome-icon icon="redo" />
    </div>
    <div class="content-div">
      <div class="title">出错了，点击重试</div>
      <small class="short" v-if="comicId">ID: {{ comicId }}</small>
    </div>
  </div>
</div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import { faRedo } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faRedo)

export default {
  name: 'LoadingItemLarge',
  components: { FontAwesomeIcon },
  props: {
    failed: {
      type: Boolean,
      default: false
    },
    comicId: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/themes/config';
@import '~@/assets/themes/@{theme-name}/theme';
.recommend-item {
  display: flex;
  flex-direction: column;
  padding: 10px;
  width: 100%;
  min-height: 200px;
  margin-top: 10px;
  box-shadow: @shadow-card-default;
  border-radius: .75em;
  overflow: hidden;
  cursor: wait;
  position: relative;
  &.failed {
    cursor: pointer;
  }
  .waiting {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex: 1;
    width: 100%;
    .cover {
      width: 100%;
      height: 100%;
      animation: loading 3s linear infinite;
      background-image: linear-gradient(90deg, transparent, #fafafa88 10%, transparent 20%);
      z-index: 3;
      position: absolute;
      top: 0;
      left: 0;
    }
    .img-div {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 140px;
      height: 180px;
      background: #eee;
    }
    .content-div {
      display: flex;
      flex: 1;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      margin-left: 10px;
      height: 100%;
      line-height: 25px;
      .title {
        height: 30px;
        width: 60%;
        background: #eee;
        margin: 6px 0;
      }
      .long {
        height: 15px;
        width: 100%;
        background: #eee;
        margin: 6px 0;
      }
      .short {
        height: 15px;
        width: 60%;
        background: #eee;
        margin: 6px 0;
      }
    }
  }
  .failed {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex: 1;
    width: 1;
    color: #ccc;
    .btn {
      width: 140px;
      text-align: center;
      font-size: 100px;
    }
    .content-div {
      margin-left: 30px;
    }
  }
}
@keyframes loading {
  0% {
    transform: translateX(-50%);
  }
  to {
    transform: translateX(100%);
  }
}
</style>
