import Mousetrap from 'mousetrap'

// Mousetrap plugins depend on `window.Mousetrap`
// -- the same copy of the instance as `vm.$mousetrap`
import 'mousetrap/plugins/record/mousetrap-record'
import 'mousetrap/plugins/pause/mousetrap-pause'

// ! NOTICE IT !
// The whole app should only import one Mousetrap library,
// for the possible overwrite when import twice
export default {
  install: (app) => {
    app.config.globalProperties.$mousetrap = Mousetrap
  }
}
