import { createRouter, createWebHistory } from 'vue-router'

const Home = () => import('@/views/Home.vue')
const City = () => import('@/views/City.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        title: 'Home'
      }
    },
    {
      path: '/weather/:state/:city',
      name: 'City',
      component: City,
      meta: {
        title: 'Weather'
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = `${to.params.state 
    ? `${to.params.city}, ${to.params.state}` : to.meta?.title} 
    | The Local Weather`
  next()
})

export default router
