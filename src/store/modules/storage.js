export default {
  namespaced: true,
  state: {
    token: 'e',
    diversionIndex: 2,
    blurOutOfFocus: false,
    hasAppLock: true,
    appLockPassword: '',
    sort: 'ua' // ['ua', 'da', 'dd', 'ld', 'vd']
  },
  mutations: {
    setDiversionIndex (state, { nextDiversionIndex }) {
      state.diversionIndex = nextDiversionIndex
    },
    setToken (state, { nextToken }) {
      state.token = nextToken
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
