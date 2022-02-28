export default {
  namespaced: true,
  state: {
    token: 'e',
    diversionIndex: 2,
    blurOutOfFocus: false,
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
    }
  },
  actions: {}
}
