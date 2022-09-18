import { createRouter, createWebHistory } from 'vue-router'

const Home = () => import('@/views/Home.vue')
const City = () => import('@/views/City.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/weather/:state/:city',
      name: 'City',
      component: City
    }
  ]
})

export default router
