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
    showInMenu: true,
    allowEasterEgg: true
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('../views/Contact.vue'),
    icon: "mdi-email",
    showInMenu: false,
    allowEasterEgg: true
  },
  {
    path: '/projects',
    name: 'Projets',
    component: () => import('../views/Projects.vue'),
    icon: "mdi-bookshelf",
    showInMenu: true,
    allowEasterEgg: true
  },
  {
    path: '/projects/:projectName',
    props: true,
    name: 'Projets - Détails',
    component: () => import('../views/ProjectView.vue'),
    icon: "mdi-bookshelf",
    showInMenu: false,
    allowEasterEgg: true
  },
  {
    path: '/groubox',
    name: 'GROUBOX',
    component: () => import('../views/GROUBOX.vue'),
    icon: "mdi-account-voice",
    showInMenu: true,
    allowEasterEgg: true
  },
  {
    path: '/uppercasegenerator',
    name: 'UpperCaseGenerator',
    component: () => import('../views/UpperCaseGenerator.vue'),
    icon: "mdi-format-text-rotation-down-vertical",
    showInMenu: true,
    allowEasterEgg: false
  },
  {
    path: '/mejri',
    name: 'MEJRI',
    component: () => import('../views/MEJRI.vue'),
    icon: "mdi-account-question-outline",
    showInMenu: false,
    allowEasterEgg: false
  },
  {
    path: '/motus',
    name: 'MOTUS',
    component: () => import('../views/Motus.vue'),
    icon: "mdi-google-controller",
    showInMenu: true,
    allowEasterEgg: false
  },
  {
    path: "*",
    name: 'Page introuvable',
    component: () => import('../views/NotFound.vue'),
    icon: "mdi-heart-broken",
    showInMenu: false,
    allowEasterEgg: true
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
        let currentRoute = router.options.routes.filter(route => route.path === router.currentRoute.path)[0];
        strTyped = '';
        if(currentRoute.allowEasterEgg){
          router.push("mejri");
        }
      }
  };
}()) );

export default router
