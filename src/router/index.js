import { createRouter, createWebHashHistory } from 'vue-router'

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
  routes
  // scrollBehavior (to, from, savedPosition) {
  //   if (to.name === from.name) { return {} }
  //   console.log(savedPosition)
  //   console.log(to)
  //   if (savedPosition) {
  //     console.log(savedPosition)
  //     return savedPosition
  //   } else {
  //     const position = {}
  //     if (to.hash) {
  //       console.log(to.hash)
  //       position.selector = to.hash
  //     } else {
  //       position.top = 0
  //     }
  //     return position
  //   }
  // }
})

// router.beforeEach((to, from, next) => {
//   next()
// })

export default router
