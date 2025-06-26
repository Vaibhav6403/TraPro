import { createRouter, createWebHistory } from 'vue-router'
import AuthView from '../components/AuthView.vue'
import RegisterForm from '../components/RegisterForm.vue'
import HelloWorld from "../components/HelloWorld.vue"
import Map from "../components/Map.vue"


const routes = [
    {
        path: '/login',
        component: AuthView,
        meta: { requiresAuth: false }
    },
    {
        path: '/register',
        component: AuthView,
        meta: { requiresAuth: false }
    },
    {
        path: '/dashboard',
        component: Map,
        meta: { requiresAuth: true }
    },

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router