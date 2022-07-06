export default {
  namespaced: true,
  state: {
    token: 'e',
    diversionIndex: 2,
    blurOutOfFocus: false,
    hasAppLock: false,
    appLockPassword: '123',
    sort: 'ua', // ['ua', 'da', 'dd', 'ld', 'vd']
    bannedTags: [],
    isUseHttps: true,
    imgViewerSettings: {
      direction: 'column-scroll',
      rl: 'lr', // left->right or right->left
      lazyLoad: true,
      autoUpdatePage: true,
      autoFlipMs: 1500
    },
    homePageModule: {
      part: {
        normalMei: true, // normal Mei recommandation
        normalMu: true, // normal Mu recommandation
        rankH24: true,
        rankD7: false,
        rankD30: false
      },
      order: ['normalMei', 'normalMu', 'rankH24', 'rankD7', 'rankD30']
    }
  },
  mutations: {
    setDiversionIndex (state, { nextDiversionIndex }) {
      state.diversionIndex = nextDiversionIndex
    },
    setToken (state, { nextToken }) {
      state.token = nextToken
    },
    setBlurOutOfFocus (state, { nextState }) {
      state.blurOutOfFocus = nextState
    },
    setSort (state, { nextSort }) {
      state.sort = nextSort
    },
    setHasAppLock (state, { nextState }) {
      state.hasAppLock = nextState
    },
    setAppLockPassword (state, { nextAppLockPassword }) {
      state.appLockPassword = nextAppLockPassword
    },
    toggleBannedTag (state, { tag }) {
      const set = new Set(state.bannedTags)
      state.bannedTags = Array.from((set.delete(tag) || set.add(tag), set))
    },
    setIsUseHttps (state, { isUseHttps }) {
      state.isUseHttps = !!isUseHttps
    },
    setImgViewerSettings (state, { direction, lazyLoad, autoUpdatePage, rl, autoFlipMs }) {
      if (direction !== undefined) {
        state.imgViewerSettings.direction = direction || 'column-scroll'
      }
      if (lazyLoad !== undefined) {
        state.imgViewerSettings.lazyLoad = !!lazyLoad
      }
      if (autoUpdatePage !== undefined) {
        state.imgViewerSettings.autoUpdatePage = !!autoUpdatePage
      }
      if (rl !== undefined) {
        state.imgViewerSettings.rl = rl
      }
      if (autoFlipMs !== undefined) {
        state.imgViewerSettings.autoFlipMs = autoFlipMs
      }
    },
    setHomePageModulePart (state, { key, nextValue }) {
      state.homePageModule.part[key] = nextValue
    },
    setHomePageModuleOrder (state, { nextOrder }) {
      state.homePageModule.order = [...nextOrder]
    }
  },
  actions: {}
}
