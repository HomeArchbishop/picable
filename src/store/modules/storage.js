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
      direction: 'column',
      lazyLoad: true,
      autoUpdatePage: true
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
    setImgViewerSettings (state, { direction, lazyLoad, autoUpdatePage }) {
      if (direction !== undefined) {
        state.imgViewerSettings.direction = direction || 'column'
      }
      if (lazyLoad !== undefined) {
        state.imgViewerSettings.lazyLoad = !!lazyLoad
      }
      if (autoUpdatePage !== undefined) {
        state.imgViewerSettings.autoUpdatePage = !!autoUpdatePage
      }
    }
  },
  actions: {}
}
