import { createRouter, createWebHistory } from 'vue-router'
import AuthView from '../components/AuthView.vue'
import RegisterForm from '../components/RegisterForm.vue'
import HelloWorld from "../components/HelloWorld.vue"
import Map from "../components/Map.vue"
import ShareTripComponent from '../components/ShareTripComponent.vue'
import Profile from '../components/Profile.vue'
import ResetPassword from "../components/ResetPassword.vue"


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
    {
        path:'/shared-trip/:token',
        component:ShareTripComponent,
        meta: {
            requiresAuth: false // or omit this line entirely
        }
    },
    {
        path:'/profile',
        component:Profile,
        meta: {
            requiresAuth: true // or omit this line entirely
        }
    }
    ,
    {
        path:'/reset-password/:token',
        component:ResetPassword,
        meta: {
            requiresAuth: true // or omit this line entirely
        }
    }

]


const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router