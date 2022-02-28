import { createApp } from 'vue'
import { mapState } from 'vuex'
import App from './App.vue'
import router from './router'
import store from './store'
import apis from './assets/apis'
import utils from './assets/utils'

createApp(App).use(store).use(router).use(apis).use(utils).mixin({
  computed: {
    ...mapState({
      token: state => state.storage.token,
      diversionUrl: state => state.runtime.diversionUrlList[state.storage.diversionIndex] || state.runtime.diversionUrlList[0]
    })
  }
}).mount('body')
