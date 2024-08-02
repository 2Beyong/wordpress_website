import { createRouter, createWebHistory } from 'vue-router';
import PostsList from '../components/PostsList.vue';
import PostDetail from '../components/PostDetail.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: PostsList
  },
  {
    path: '/post/:id',
    name: 'post',
    component: PostDetail
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;