import { isObjectLike } from 'lodash'
import { createRouter, createWebHashHistory } from 'vue-router'
import store from '../store'

const routes = [
  {
    path: '/',
    name: 'Diversion',
    component: () => import('../views/Diversion')
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
    path: '/comic-detail/:comicId',
    name: 'ComicDetail',
    component: () => import('../views/ComicDetail')
  },
  {
    path: '/comic/:comicId/:order',
    name: 'ComicViewer',
    component: () => import('../views/ComicViewer')
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
    path: '/game',
    name: 'Game',
    component: () => import('../views/Random'),
    meta: {
      title: '游戏区'
    }
  },
  {
    path: '/knight',
    name: 'Knight',
    component: () => import('../views/Random'),
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
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior (to, from) {
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
  store.commit('runtime/setSavedScrollPosition', {
    routeName: from.name, nextX: scrollX, nextY: scrollY
  })
  return next()
})

// router.afterEach((to, from, next) => {
//   // change window title
//   store.commit('runtime/setWindowTitle', {
//     nextTitle: to.meta.title || ''
//   })
//   next()
// })

export default router
