import * as webApis from './web-api'
import * as picaApis from './pica-api'
import * as appApis from './app-api'

export default {
  install: (app) => {
    app.config.globalProperties.$api = {
      ...webApis,
      ...picaApis,
      ...appApis
    }
  }
}
