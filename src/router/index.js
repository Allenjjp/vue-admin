import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 引入布局组件
import Layout from '@/views/Layout'

  const routes = [
  {
    path: '/',
    redirect: 'login',
    hidden: true,
    meta: {
      name: '主页'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login/index.vue'),
    hidden: true,
    meta: {
      name: '登录'
    }
  },
  {
    path: '/console',
    name: 'Console',
    redirect: "index",
    component: Layout,
    meta: {
      name: '控制台',
      icon: 'console'
    },
    children: [
      {
        path: '/index',
        name: 'Index',
        meta: {
          name: '首页'
        },
        component: () => import('../views/Console/index.vue')
      }
    ]
  },
  {
    path: '/info',
    name: 'Info',
    component: Layout,
    meta: {
      name: '信息管理',
      icon: 'info'
    },
    children: [
      {
        path: '/infoIndex',
        name: 'InfoIndex',
        meta: {
          name: '信息列表'
        },
        component: () => import('../views/Info/index.vue')
      },
      {
        path: '/infoCategory',
        name: 'InfoCategory',
        meta: {
          name: '信息分类'
        },
        component: () => import('../views/Info/category.vue')
      }
    ]
  },
  {
    path: '/user',
    name: 'User',
    component: Layout,
    meta: {
      name: '用户管理',
      icon: 'user'
    },
    children: [
      {
        path: '/userIndex',
        name: 'UserIndex',
        meta: {
          name: '用户列表'
        },
        component: () => import('../views/User/index.vue')
      }
    ]
  },
]

const router = new VueRouter({
  routes
})

export default router
