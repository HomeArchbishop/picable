import { createApp } from 'vue'
import { mapGetters, mapState } from 'vuex'
import App from './App.vue'
import router from './router'
import store from './store'
import apis from './apis'
import utils from './assets/utils'
import Mousetrap from './plugins/mousetrap'
import swal from './plugins/sweetalert-picable/sweetalert-picable'
import compHelper from './plugins/component-helper'
import VueDOMPurifyHTML from 'vue-dompurify-html'
import tippyPicable from './plugins/tippy-picable'
import styleUtils from './plugins/style-utils'

const app = createApp(App)

  .use(store)
  .use(router)
  .use(apis)
  .use(utils)
  .use(Mousetrap)
  .use(swal)
  .use(compHelper)
  .use(tippyPicable)
  .use(styleUtils)
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

router.isReady().then(() => {
  app.mount('#app')
})
