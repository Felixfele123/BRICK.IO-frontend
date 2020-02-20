import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Skins from '../views/Skins.vue'
import Leaderboard from '../views/Leaderboard.vue'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'
import Multi from '../views/Multi.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'home',
    component: Home
  },
  {
    path: '/skins',
    name: 'skins',
    component: Skins
  },
  {
    path: '/leaderboard',
    name: 'leaderboard',
    component: Leaderboard
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/signup',
    name: 'signup',
    component: Signup
  },
  {
    path: '/multi',
    name: 'multi',
    component: Multi
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

/*function login(){
  let myCookie = this.getCookie("createUser");
          if (myCookie == null) {
              // do cookie doesn't exist stuff;
              return true
              
          }
          else {
              // do cookie exists stuff
              return false
          }
}*/


export default router
