import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import runtime from './modules/runtime'
import storage from './modules/storage'

const vuexPersistedState = createPersistedState({
  key: 'chores:vuex-storage-persisted-state',
  paths: ['storage']
})

export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    runtime,
    storage
  },
  plugins: [
    vuexPersistedState
  ]
})
