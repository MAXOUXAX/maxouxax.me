import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Accueil',
    component: Home
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('../views/Contact.vue')
  },
  {
    path: '/projects',
    name: 'Projets',
    component: () => import('../views/Projects.vue')
  },
  {
    path: '/groubox',
    name: 'GROUBOX',
    component: () => import('../views/GROUBOX.vue')
  },
  {
    path: '/uppercasegenerator',
    name: 'UpperCaseGenerator',
    component: () => import('../views/UpperCaseGenerator.vue')
  },
  {
    path: '/mejri',
    name: 'MEJRI',
    component: () => import('../views/MEJRI.vue')
  },
  {
    path: '/motus',
    name: 'MOTUS',
    component: () => import('../views/Motus.vue')
  },
  {
    path: "*",
    name: 'Page introuvable',
    component: () => import('../views/404.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior (to, from, savedPosition) {
    return {
      x: 0, y: 0, behavior: 'smooth',
    }
  }
})

const BASE_TITLE = "MAXOUXAX — "

router.beforeEach((to, from, next) => {
  document.title = BASE_TITLE + to.name;
  NProgress.start();
  next();
});

router.afterEach(to => {
  NProgress.done();
});

window.addEventListener('keypress', (function() {
  var strToType = 'mejri';
  var strTyped = '';
  return function(event) {
      var character = String.fromCharCode(event.which);
      strTyped += character;
      if (strToType.indexOf(strTyped) === -1) strTyped = '';
      else if (strTyped === strToType) {
          strTyped = '';
          if(router.currentRoute.name != "MEJRI")router.push("mejri");
      }
  };
}()) );

export default router
