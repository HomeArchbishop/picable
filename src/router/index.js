import { isObjectLike } from 'lodash'
import { createRouter, createWebHashHistory } from 'vue-router'
import store from '../store'
import { swal } from '../plugins/sweetalert-picable/sweetalert-picable'

// import { showLoadingPica, hideLoadingPica } from '../assets/utils/controlLoadingPica'

import AppLock from '../views/AppLock'
import Diversion from '../views/Diversion'
import Buffer from '../views/Buffer'
import HideSecret from '../views/HideSecret'

const routes = [
  {
    path: '/',
    name: 'Buffer',
    component: Buffer
  },
  {
    path: '/hide-secret',
    name: 'HideSecret',
    component: HideSecret,
    beforeEnter: (to, from, next) => {
      to.meta.from = from || {}
      next()
    }
  },
  {
    path: '/app-lock',
    name: 'AppLock',
    component: AppLock,
    beforeEnter: (to, from, next) => {
      to.meta.from = from || {}
      next()
    }
  },
  {
    path: '/diversion',
    name: 'Diversion',
    component: Diversion
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home'),
    meta: {
      keepAlive: true,
      title: '推荐'
    }
  },
  {
    path: '/category',
    name: 'Category',
    component: () => import('../views/Category'),
    meta: {
      keepAlive: true,
      title: '分类'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register'),
    meta: {
      title: '注册'
    }
  },
  {
    path: '/comic-detail/:comicId',
    name: 'ComicDetail',
    component: () => import('../views/ComicDetail')
  },
  {
    path: '/comic/:comicId/:order',
    name: 'ComicViewer',
    component: () => import('../views/ComicViewer/ComicViewer'),
    meta: {
      scrollBehavior: false
    }
  },
  {
    path: '/comic-comments/:comicId',
    name: 'ComicComments',
    component: () => import('../views/ComicComments'),
    meta: {
      title: '漫画评论'
    }
  },
  {
    path: '/favourite',
    name: 'Favourite',
    component: () => import('../views/Favourite'),
    meta: {
      keepAlive: true,
      title: '收藏'
    }
  },
  {
    path: '/recent',
    name: 'Recent',
    component: () => import('../views/Recent'),
    meta: {
      title: '最近'
    }
  },
  {
    path: '/search',
    name: 'Search',
    props: route => ({ kw: route.query.kw }),
    component: () => import('../views/Search'),
    meta: {
      keepAlive: true,
      title: '搜索'
    }
  },
  {
    path: '/tag-search',
    name: 'SearchTag',
    props: route => ({ t: route.query.t }),
    component: () => import('../views/SearchTag'),
    meta: {
      keepAlive: true,
      title: '标签搜索'
    }
  },
  {
    path: '/category-search',
    name: 'SearchCategory',
    props: route => ({ c: route.query.c }),
    component: () => import('../views/SearchCategory'),
    meta: {
      keepAlive: true,
      title: '分类搜索'
    }
  },
  {
    path: '/user-info',
    name: 'User',
    component: () => import('../views/User'),
    meta: {
      keepAlive: true,
      title: '用户'
    }
  },
  {
    path: '/user-comments',
    name: 'UserComments',
    component: () => import('../views/UserComments'),
    meta: {
      title: '我的评论'
    }
  },
  {
    path: '/link',
    name: 'Link',
    props: route => ({ link: route.query.link }),
    component: () => import('../views/Link')
  },
  {
    path: '/random',
    name: 'Random',
    component: () => import('../views/Random'),
    meta: {
      title: '随机本子'
    }
  },
  {
    path: '/knight',
    name: 'Knight',
    component: () => import('../views/Knight'),
    meta: {
      title: '骑士榜'
    }
  },
  {
    path: '/rank',
    name: 'Rank',
    component: () => import('../views/Rank'),
    meta: {
      title: '排行榜'
    }
  },
  {
    path: '/game',
    name: 'Game',
    component: () => import('../views/Game'),
    meta: {
      title: '游戏区'
    }
  },
  {
    path: '/game-detail/:gameId',
    name: 'GameDetail',
    component: () => import('../views/GameDetail'),
    meta: {
      title: '游戏'
    }
  },
  {
    path: '/game-comments/:gameId',
    name: 'GameComments',
    component: () => import('../views/GameComments'),
    meta: {
      title: '游戏评论'
    }
  },
  {
    path: '/setting',
    name: 'Setting',
    component: () => import('../views/Setting'),
    meta: {
      title: '设置'
    }
  },
  {
    path: '/post-web',
    name: 'PostWeb',
    component: () => import('../views/PostWeb'),
    meta: {
      title: '锅贴'
    }
  },
  {
    path: '/chat',
    name: 'Chat',
    component: () => import('../views/Chat'),
    meta: {
      title: '哔咔聊天室'
    }
  },
  {
    path: '/chat-room',
    name: 'ChatRoom',
    props: route => ({ url: route.query.url, chatname: route.query.name }),
    component: () => import('../views/ChatRoom')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior (to, from) {
    if (to.meta.scrollBehavior === false) { return false }
    if (to.name === from.name) { return false }
    const x = isObjectLike(store.state.runtime.savedScrollPositions[to.name])
      ? store.state.runtime.savedScrollPositions[to.name].x : 0
    const y = isObjectLike(store.state.runtime.savedScrollPositions[to.name])
      ? store.state.runtime.savedScrollPositions[to.name].y : 0
    // console.log(x, y)
    // TODO better it
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ left: x, top: y })
      }, 50)
    })
  }
})

router.beforeEach((to, from, next) => {
  swal.close()
  store.commit('runtime/setSavedScrollPosition', {
    routeName: from.name, nextX: scrollX, nextY: scrollY
  })
  return next()
})

router.afterEach((to, from) => {
  // change window title
  store.commit('runtime/setWindowTitle', {
    nextTitle: to.meta.title || ''
  })
})

export default router
