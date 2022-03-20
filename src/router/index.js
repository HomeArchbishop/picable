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
      keepAlive: true
    }
  },
  {
    path: '/category',
    name: 'Category',
    component: () => import('../views/Category'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login')
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
    component: () => import('../views/ComicComments')
  },
  {
    path: '/search',
    name: 'Search',
    props: route => ({ kw: route.query.kw }),
    component: () => import('../views/Search'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/tag-search',
    name: 'SearchTag',
    props: route => ({ t: route.query.t }),
    component: () => import('../views/SearchTag'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/category-search',
    name: 'SearchCategory',
    props: route => ({ c: route.query.c }),
    component: () => import('../views/SearchCategory'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/user-info',
    name: 'User',
    component: () => import('../views/User'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/link',
    name: 'Link',
    props: route => ({ link: route.query.link }),
    component: () => import('../views/Link')
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
  next()
})

export default router
