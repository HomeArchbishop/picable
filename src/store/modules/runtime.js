import deepcopy from 'deepcopy'

export default {
  namespaced: true,
  state: {
    diversionUrlList: ['http://picaapi.picacomic.com/'],
    keywordList: [],
    categoryList: [],
    sortList: [
      { code: 'ua', name: '默认' },
      { code: 'dd', name: '最新' },
      { code: 'da', name: '最旧' },
      { code: 'ld', name: '最爱' },
      { code: 'vd', name: '最多' }
    ],
    searchKeyword: ''
  },
  mutations: {
    setDiversionUrlList (state, { nextDiversionUrlList }) {
      state.diversionUrlList = deepcopy(nextDiversionUrlList)
    },
    setKeywordList (state, { nextKeywordList }) {
      state.keywordList = deepcopy(nextKeywordList)
    },
    setCategoryList (state, { nextCategoryList }) {
      state.categoryList = deepcopy(nextCategoryList)
    },
    setSearchKeyword (state, { nextSearchKeyword }) {
      state.searchKeyword = '' + nextSearchKeyword
    }
  },
  actions: {}
}
