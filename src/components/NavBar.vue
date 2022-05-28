<template>
  <div class="nav-container">
    <div class="part-group left-group">
      <div @click="$router.back(-1)" class="common-btn">
        <font-awesome-icon icon="angle-left" />
      </div>
      <div @click="$router.go(1)" class="common-btn">
        <font-awesome-icon icon="angle-right" />
      </div>
    </div>
    <div class="part-group center-group">
      <span class="window-title">{{ $store.state.runtime.windowTitle }}</span>
    </div>
    <div class="part-group right-group">
    </div>
  </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faAngleLeft, faAngleRight)

export default {
  name: 'SideBar',
  components: {
    FontAwesomeIcon
  }
}
</script>

<style lang='less' scoped>
@import '~@/assets/themes/config';
@import '~@/assets/themes/@{theme-name}/theme';
.nav-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  width: 100%;
  padding-right: 10vw;
  padding-left: 10vw;
  user-select: none;
  z-index: inherit;
  overflow: hidden;
  .part-group {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex: 1;
    height: 100%;
    &.center-group {
      justify-content: center;
    }
    .common-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 40px;
      max-width: 40px;
      min-height: 40px;
      max-height: 40px;
      overflow: hidden;
      cursor: pointer;
      -webkit-user-drag: none;
      .hoverable-btn();
    }
    .window-title {
      font-size: 18px;
      // font-weight: 700;
    }
  }
}
</style>
