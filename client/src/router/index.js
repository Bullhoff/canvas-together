import { createRouter, createWebHistory } from 'vue-router'
import c from './../constants.js'
import { canvasStore, styleStore, configStore } from "@/stores/store.js";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'canvas',
      component: () => import('../views/Canvas.vue'),
      //props: (route) => ({ query: route.query  })
      /* props: (route) => ({ query: { q: route.query.q } }) */
      meta: {
        //title: c.WINDOWTITLE, 
        requiresAuth: false,
        transition: 'slide-left'
      }
  
    },{
      path: '/test',
      name: 'test',
      component: () => import('../views/Test.vue')
    },
  ]
})

router.beforeEach(async (to, from) => {
    if ( to.name !== 'canvas' && !to.name.includes('test') ) {
      return '/'
      //return { name: 'canvas6' }
    }
})

/* router.beforeEach((to, from, next) => {
  const title = to.meta.title
  if (title) {
    //document.title = `${title} > ${canvasStore().current.parent}`
  }
  // Continue resolving the route
  next()
}) */



export default router
