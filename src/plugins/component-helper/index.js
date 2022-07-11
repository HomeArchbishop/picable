import { reset } from './reset'
import { breakdown } from './breakdown'

export default {
  install: (app) => {
    app.config.globalProperties.$compHelper = {
      reset,
      breakdown
    }
  }
}
