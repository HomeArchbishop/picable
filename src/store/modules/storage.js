export default {
  namespaced: true,
  state: {
    token: 'e',
    diversionIndex: 2,
    blurOutOfFocus: false,
    hasAppLock: false,
    appLockPassword: '123',
    sort: 'ua' // ['ua', 'da', 'dd', 'ld', 'vd']
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
    }
  },
  actions: {}
}
