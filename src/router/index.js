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
    component: Home,
    icon: "mdi-home",
    showInMenu: true
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('../views/Contact.vue'),
    icon: "mdi-email",
    showInMenu: true
  },
  {
    path: '/projects',
    name: 'Projets',
    component: () => import('../views/Projects.vue'),
    icon: "mdi-bookshelf",
    showInMenu: true
  },
  {
    path: '/groubox',
    name: 'GROUBOX',
    component: () => import('../views/GROUBOX.vue'),
    icon: "mdi-account-voice",
    showInMenu: true
  },
  {
    path: '/uppercasegenerator',
    name: 'UpperCaseGenerator',
    component: () => import('../views/UpperCaseGenerator.vue'),
    icon: "mdi-format-text-rotation-down-vertical",
    showInMenu: true
  },
  {
    path: '/mejri',
    name: 'MEJRI',
    component: () => import('../views/MEJRI.vue'),
    icon: "mdi-account-question-outline",
    showInMenu: false
  },
  {
    path: '/motus',
    name: 'MOTUS',
    component: () => import('../views/Motus.vue'),
    icon: "mdi-keyboard",
    showInMenu: true
  },
  {
    path: "*",
    name: 'Page introuvable',
    component: () => import('../views/NotFound.vue'),
    icon: "mdi-heart-broken",
    showInMenu: false
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
}));

export default router
