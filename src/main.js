import { createApp } from 'vue'
import { mapGetters, mapState } from 'vuex'
import App from './App.vue'
import router from './router'
import store from './store'
import apis from './apis'
import utils from './assets/utils'
import Mousetrap from './plugins/mousetrap'
import VueDOMPurifyHTML from 'vue-dompurify-html'

createApp(App)

  .use(store)
  .use(router)
  .use(apis)
  .use(utils)
  .use(Mousetrap)
  .use(VueDOMPurifyHTML)

  .mixin({
    computed: {
      ...mapState({
        token: state => state.storage.token
      }),
      ...mapGetters({
        diversionUrl: 'runtime/currentDiversionUrl'
      })
    }
  })

  .mount('#app')
