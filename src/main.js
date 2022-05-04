import { createApp } from 'vue'
import { mapState } from 'vuex'
import App from './App.vue'
import router from './router'
import store from './store'
import apis from './assets/apis'
import utils from './assets/utils'
import VueDOMPurifyHTML from 'vue-dompurify-html'

const app = createApp(App).use(store).use(router).use(apis).use(utils).use(VueDOMPurifyHTML).mixin({
  computed: {
    ...mapState({
      token: state => state.storage.token,
      diversionUrl: state => state.runtime.diversionUrlList[state.storage.diversionIndex] || state.runtime.diversionUrlList[0]
    })
  }
})

setTimeout(() => {
  app.mount('#app')
}, 200)
