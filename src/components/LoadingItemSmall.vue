<template>
  <div class="recommend-item">
    <div class="cover"></div>
    <div class="img-div"></div>
    <span class="title"></span>
    <span class="description"></span>
  </div>
</template>

<script>
export default {
  name: 'LoadingItemSmall'
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
  cursor: wait;
  position: relative;
  .cover {
    width: 100%;
    height: 100%;
    animation: loading 5s linear infinite;
    background-image: linear-gradient(50deg, transparent, transparent, #fafafa 55%, transparent, transparent);
    background-size: 400% 100%;
    z-index: 3;
    position: absolute;
  }
  .img-div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 140px;
    height: 140px;
    overflow: hidden;
    background: #eee;
  }
  .title {
    background: #eee;
    margin: 10px 10px 0 10px;
    height: 16px;
  }
  .description {
    background: #eee;
    margin: 8px 10px;
    height: 26px;
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
