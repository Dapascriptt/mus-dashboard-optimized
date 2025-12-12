// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

//AGGRESSIVE LAZY LOADING — SEMUA PAGES DI-IMPORT DINAMIS

// Dashboard (halaman utama – Eager Loading for Hybrid Strategy)
import Dashboard from '../pages/Dashboard.vue'

// PRODUCT MODULE
const ProductList = () => import('../pages/ProductList.vue')
const ProductAdd = () => import('../pages/ProductAdd.vue')
const ProductEdit = () => import('../pages/ProductEdit.vue')

// ORDER MODULE
const OrderAdd = () => import('../pages/OrderAdd.vue')
const OrderList = () => import('../pages/OrderList.vue')
const OrderDetail = () => import('../pages/OrderDetail.vue')

// OTHER PAGES
const CustomerList = () => import('../pages/CustomerList.vue')
const CustomerAdd = () => import('../pages/CustomerAdd.vue')
const CustomerEdit = () => import('../pages/CustomerEdit.vue')
const Analytics = () => import('../pages/Analytics.vue')
const Settings = () => import('../pages/Settings.vue')
const Login = () => import('../pages/auth/Login.vue')

const routes = [
  { path: '/', redirect: '/dashboard' },

  // Dashboard
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
  },

  // Product
  {
    path: '/products',
    name: 'ProductList',
    component: ProductList,
  },
  {
    path: '/products/add',
    name: 'ProductAdd',
    component: ProductAdd,
  },
  {
    path: '/products/edit/:id',
    name: 'ProductEdit',
    props: true,
    component: ProductEdit,
  },

  // Order
  {
    path: '/orders',
    name: 'OrderList',
    component: OrderList,
  },
  {
    path: '/orders/add',
    name: 'OrderAdd',
    component: OrderAdd,
  },
  {
    path: '/orders/:id',
    name: 'OrderDetail',
    props: true,
    component: OrderDetail,
  },

  // Other pages
  {
    path: '/customers',
    name: 'CustomerList',
    component: CustomerList,
  },
  {
    path: '/customers/add',
    name: 'CustomerAdd',
    component: CustomerAdd,
  },
  {
    path: '/customers/edit/:id',
    name: 'CustomerEdit',
    props: true,
    component: CustomerEdit,
  },
  {
    path: '/analytics',
    name: 'Analytics',
    component: Analytics,
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
