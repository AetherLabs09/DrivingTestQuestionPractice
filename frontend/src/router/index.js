import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/login', name: 'Login', component: () => import('../views/Login.vue') },
  {
    path: '/',
    component: () => import('../views/Layout.vue'),
    children: [
      { path: '', redirect: '/dashboard' },
      { path: 'dashboard', name: 'Dashboard', component: () => import('../views/Dashboard.vue') },
      { path: 'users', name: 'Users', component: () => import('../views/Users.vue') },
      { path: 'questions', name: 'Questions', component: () => import('../views/Questions.vue') },
      { path: 'feedback', name: 'Feedback', component: () => import('../views/Feedback.vue') },
      { path: 'ads', name: 'Ads', component: () => import('../views/Ads.vue') },
      { path: 'stats', name: 'Stats', component: () => import('../views/Stats.vue') },
      { path: 'risk', name: 'Risk', component: () => import('../views/Risk.vue') }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const user = localStorage.getItem('user')
  if (!user && to.path !== '/login') {
    next('/login')
  } else {
    next()
  }
})

export default router