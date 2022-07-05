<template>
<div class="sub-view-setting-container" :class="{ 'fade-out': willFadeOut }" @click="fadeOut()">
  <div class="card" @click.stop>
    <div class="title-bar">
      <h2>设置</h2>
      <div class="close-btn" @click="fadeOut()">
        <font-awesome-icon icon="xmark" />
      </div>
    </div>
    <div class="main-view">
      <setting-view />
    </div>
  </div>
</div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import SettingView from '../views/Setting.vue'

library.add(faXmark)

export default {
  name: 'SubViewSetting',
  data () {
    return {
      willFadeOut: false
    }
  },
  components: {
    SettingView,
    FontAwesomeIcon
  },
  methods: {
    async fadeOut () {
      this.willFadeOut = true
      setTimeout(() => {
        this.$emit('hide-sub-view-setting')
      }, 500)
    }
  }
}

</script>

<style lang="less" scoped>
@import '~@/assets/themes/config';
@import '~@/assets/themes/@{theme-name}/theme';

.sub-view-setting-container {
  z-index: 140;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #00000033;
  &.fade-out {
    transform: translateY(100%);
    animation: fadeOut .4s;
  }
  .card {
    padding: 20px 60px;
    background: fade(@background-main, 98%);
    box-shadow: @shadow-card-default;
    border-top-right-radius: .7em;
    border-top-left-radius: .7em;
    position: fixed;
    top: 10vh;
    left: 0;
    right: 0;
    bottom: 0;
    animation: fadeIn .4s;
    .main-view {
      overflow: scroll;
      height: calc(100% - 60px - 40px);
    }
    .title-bar {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      position: sticky;
      top: 0;
      padding: 20px 0;
      h2 {
        margin: 0;
      }
      .close-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        border-radius: 100%;
        background: @background-btn-default;
        line-height: 1em;
        user-select: none;
        cursor: pointer;
        &:hover {
          transform: rotate(360deg);
          transition: .5s;
        }
      }
    }
  }
}
@keyframes fadeIn {
  0% {
    transform: translateY(100%);
  }
}
@keyframes fadeOut {
  0% {
    background: transparent;
    transform: translateY(0);
  }
  100% {
    background: transparent;
    transform: translateY(100%);
  }
}
::-webkit-resizer, ::-webkit-scrollbar-corner {
  display: none;
}
::-webkit-scrollbar {
  display: none;
}
::-webkit-scroll-track, ::-webkit-scrollbar-button {
  display: none;
}
::-webkit-resizer, ::-webkit-scrollbar-corner {
  display: none;
}
::-webkit-scrollbar-thumb {
  display: none;
}
::-webkit-scrollbar-track-piece {
  display: none;
}
</style>
