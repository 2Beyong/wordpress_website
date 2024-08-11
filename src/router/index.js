import { createRouter, createWebHashHistory } from 'vue-router'
import PostsList from '../components/PostsList.vue'
import PostDetail from '../components/PostDetail.vue'
//import { KeepAlive } from 'vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: PostsList,
    meta: {
      KeepAlive: true,
      isBack: false
    }
  },
  {
    path: '/post/:id',
    name: 'post',
    component: PostDetail
  }
]

const router = createRouter({
  history: createWebHashHistory('/blog/'),
  routes
})

export default router
