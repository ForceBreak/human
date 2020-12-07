import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue')
  },
  {
    path: '/stuff',
    name: 'Stuff',
    component: () => import(/* webpackChunkName: "about" */ '../views/Stuff.vue')
  },
  {
    path: '/thalgo-home',
    name: 'Thalgo Домашняя',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/ThalgoHome.vue')
  },
  {
    path: '/biologic-home',
    name: 'Биолоджик Домашняя',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/BiologicHome.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
