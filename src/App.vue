<template>
<div class="wrap">
  <div class="window-header-container">
    <nav-bar v-if="$route.name !== 'Diversion' && $route.name !== 'Login' && $route.name !== 'AppLock'" />
  </div>
  <side-bar v-if="$route.name !== 'Diversion' && $route.name !== 'Login' && $route.name !== 'AppLock'" />
  <div class="app-main-root-container">
    <router-view v-slot="{ Component }">
      <transition>
        <keep-alive :include="keepAliveList">
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
</div>
</template>

<script>
import SideBar from '@/components/SideBar'
import NavBar from '@/components/NavBar'

export default {
  name: 'App',
  components: {
    SideBar,
    NavBar
  },
  data () {
    return {
      keepAliveList: []
    }
  },
  methods: {
    getDiversionUrlList: async function () {
      const nextDiversionUrlList = await this.$api.getDiversionUrlList()
      this.$store.commit('runtime/setDiversionUrlList', { nextDiversionUrlList })
    },
    addListener: async function () {
      window.onblur = () => {
        if (this.$store.state.storage.blurOutOfFocus !== false) {
          document.body.classList.add('blur')
        }
      }
      window.onfocus = () => {
        document.body.classList.remove('blur')
      }
    }
  },
  watch: {
    $route (to) {
      if (to.meta.keepAlive && !this.keepAliveList.includes(to.name)) {
        this.keepAliveList.push(to.name)
      }
    }
  },
  created () {
    console.log(this.diversionUrl)
    this.addListener()
    this.getDiversionUrlList()
  }
}
</script>

<style lang="less">
@import '~@/assets/themes/config';
@import '~@/assets/themes/@{theme-name}/theme';

body {
  padding: 0;
  margin: 0;
  font-family: ChineseFont, EnglishFont, Apple Color Emoji, Segoe UI Emoji, system-ui, sans-serif;
  color: @color-font-default;
  background: @background-main;
  overflow: scroll;

  &.blur {
    filter: blur(30px);
  }
}

* {
  box-sizing: border-box !important;
}

.wrap {
  width: 100%;
  padding: 0;
  margin: 0;

  .window-header-container {
    display: flex;
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    height: 54px;
    background: @background-window-head;
    -webkit-backdrop-filter: saturate(180%) blur(20px);
    backdrop-filter: saturate(180%) blur(20px);
    z-index: 100;
    -webkit-app-region: drag;
  }

  .app-main-root-container {
    min-height: 100vh;
    width: 100vw;
    z-index: 50;
    padding: (54px + 26px) 60px 30px (60px + 20px);
    margin: 0;
  }
}
</style>
