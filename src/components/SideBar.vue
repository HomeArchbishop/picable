<template>
  <div class="side-bar-container">
    <div class="upwards-btn-group">
      <router-link :to="{ name: 'User' }" custom v-slot="{ navigate }">
        <div class="common-btn" @click="navigate">
          <font-awesome-icon icon="user-alt" />
        </div>
      </router-link>
      <router-link :to="{ name: 'AppLock' }" custom v-slot="{ navigate }" v-if="$store.state.storage.hasAppLock">
        <div class="common-btn" @click="navigate">
          <font-awesome-icon icon="lock" />
        </div>
      </router-link>
      <router-link :to="{ name: 'HideSecret' }" custom v-slot="{ navigate }">
        <div class="common-btn" @click="navigate">
          <font-awesome-icon icon="eye-slash" />
        </div>
      </router-link>
      <router-link :to="{ name: 'Setting' }" custom v-slot="{ navigate }">
        <div class="common-btn" @click="navigate">
          <font-awesome-icon icon="gear" />
        </div>
      </router-link>
    </div>
    <div class="down-btn-group">
      <router-link :to="{ name: 'Home' }" custom v-slot="{ navigate }">
        <div class="common-btn" @click="navigate">
          <font-awesome-icon icon="house" />
        </div>
      </router-link>
      <router-link custom v-slot="{ navigate }"
        :to="{ name: 'Search', query: { kw: $store.state.runtime.searchKeyword } }"
      >
        <div class="common-btn" @click="navigate">
          <font-awesome-icon icon="magnifying-glass" />
        </div>
      </router-link>
      <router-link :to="{ name: 'Category' }" custom v-slot="{ navigate }">
        <div class="common-btn" @click="navigate">
          <font-awesome-icon icon="book" />
        </div>
      </router-link>
      <router-link :to="{ name: 'Favourite' }" custom v-slot="{ navigate }">
        <div class="common-btn" @click="navigate">
          <font-awesome-icon icon="bookmark" />
        </div>
      </router-link>
      <router-link :to="{ name: 'Recent' }" custom v-slot="{ navigate }">
        <div class="common-btn" @click="navigate">
          <font-awesome-icon icon="eye" />
        </div>
      </router-link>
      <router-link :to="{ name: 'Download' }" custom v-slot="{ navigate }">
        <div class="common-btn" @click="navigate">
          <font-awesome-icon icon="download" />
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import { faHouse, faArrowLeft, faEyeSlash, faUserAlt, faGear, faMagnifyingGlass, faBook, faDownload, faBookmark, faEye, faLock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faHouse, faArrowLeft, faEyeSlash, faUserAlt, faGear, faMagnifyingGlass, faBook, faDownload, faBookmark, faEye, faLock)

export default {
  name: 'SideBar',
  components: {
    FontAwesomeIcon
  },
  data () {
    return {}
  }
}
</script>

<style lang='less' scoped>
@import '~@/assets/themes/config';
@import '~@/assets/themes/@{theme-name}/theme';
.side-bar-container {
  display: flex;
  flex-direction: column;
  width: 60px;
  overflow-y: scroll;
  position: fixed;
  top: 54px;
  left: 0;
  bottom: 0;
  z-index: 90;
  overflow: hidden;
}
.upwards-btn-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
.down-btn-group {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  flex: 1;
  margin-bottom: 20px;
}
.common-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  min-width: 40px;
  max-width: 40px;
  min-height: 40px;
  max-height: 40px;
  overflow: hidden;
  cursor: pointer;
  .hoverable-btn();
}
</style>
