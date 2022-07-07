<template>
<div class="wrap">
  <div class="window-header-container">
    <nav-bar v-if="isShowBar" />
  </div>
  <side-bar v-if="isShowBar" />
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
import shortcutsListener from './assets/js/shortcutsListener'
import { mapState } from 'vuex'

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
  computed: {
    ...mapState({
      shortcuts: state => state.storage.shortcuts
    }),
    isShowBar () {
      return typeof this.$route.name !== 'undefined' &&
        !['Diversion', 'Login', 'AppLock', 'Register', 'HideSecret'].includes(this.$route.name)
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
    },
    shortcuts: {
      deep: true,
      handler () {
        shortcutsListener.restart()
      }
    }
  },
  created () {
    shortcutsListener.install(this)
    shortcutsListener.start()
    console.log(this.diversionUrl)
    this.addListener()
    this.getDiversionUrlList()
  }
}
</script>

<style lang="less">
@import '~@/assets/themes/config';
@import '~@/assets/themes/@{theme-name}/root';
@import '~@/assets/themes/@{theme-name}/theme';

#app {
  overflow: hidden;
}

.wrap {
  width: 100%;
  padding: 0;
  margin: 0;
  overflow: hidden;

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
    overflow: hidden;
  }

  .app-main-root-container {
    min-height: 100vh;
    width: 100vw;
    z-index: 50;
    padding: (54px + 26px) 60px 30px (60px + 20px);
    margin: 0;
    overflow: hidden;
  }
}
</style>
