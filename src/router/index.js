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
    meta: {
      icon: "mdi-home",
      showInMenu: true,
      allowEasterEgg: true
    }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('../views/Contact.vue'),
    meta: {
      icon: "mdi-email",
      showInMenu: false,
      allowEasterEgg: true
    }
  },
  {
    path: '/projects',
    component: () => import('../views/projects/Projects.vue'),
    meta: {
      icon: "mdi-bookshelf",
      showInMenu: true,
      allowEasterEgg: true,
    },
    children: [
      {
        path: '',
        name: 'Projets',
        component: () => import('../views/projects/ProjectsList.vue'),
      },
      {
        path: ':projectName',
        props: true,
        name: 'Projets - Détails',
        component: () => import('../views/projects/ProjectView.vue'),
        meta: {
          icon: "mdi-bookshelf",
          showInMenu: false,
          allowEasterEgg: true
        }
      }
    ],
  },
  {
    path: '/groubox',
    name: 'GROUBOX',
    component: () => import('../views/GROUBOX.vue'),
    meta: {
      icon: "mdi-account-voice",
      showInMenu: false,
      allowEasterEgg: true
    }
  },
  {
    path: '/uppercasegenerator',
    name: 'UpperCaseGenerator',
    component: () => import('../views/UpperCaseGenerator.vue'),
    meta: {
      icon: "mdi-format-text-rotation-down-vertical",
      showInMenu: true,
      allowEasterEgg: false
    }
  },
  {
    path: '/mejri',
    name: 'MEJRI',
    component: () => import('../views/MEJRI.vue'),
    meta: {
      icon: "mdi-account-question-outline",
      showInMenu: false,
      allowEasterEgg: false
    }
  },
  {
    path: '/motus',
    component: () => import('../views/motus/Motus.vue'),
    meta: {
      icon: "mdi-google-controller",
      showInMenu: true,
      allowEasterEgg: false
    },
    children: [
      {
        path: '',
        name: 'Motus',
        component: () => import('../views/motus/MotusMenu.vue'),
      },
      {
        path: ':gameMode',
        props: true,
        name: 'Motus - Partie',
        component: () => import('../views/motus/MotusGameView.vue'),
      }
    ],
  },
  {
    path: '/raymond',
    component: () => import('../views/raymond/Raymond.vue'),
    meta: {
      icon: "mdi-robot-happy",
      showInMenu: true,
      allowEasterEgg: true,
    },
    children: [
      {
        path: '',
        name: 'Raymond',
        component: () => import('../views/raymond/RaymondHome.vue'),
      },
      {
        path: 'teacher',
        name: 'Professeur',
        component: () => import('../views/raymond/RaymondTeacher.vue'),
        children: [
          {
            path: ':email',
            props: true,
            name: 'On regarde un professeur',
            component: () => import('../views/raymond/RaymondTeacherView.vue'),
            meta: {
              icon: "mdi-email",
              showInMenu: false,
              allowEasterEgg: false
            }
          }
        ]
      }
    ],
  },
  {
    path: "*",
    name: 'Page introuvable',
    component: () => import('../views/NotFound.vue'),
    meta: {
      icon: "mdi-heart-broken",
      showInMenu: false,
      allowEasterEgg: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
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

window.addEventListener('keypress', (function () {
  var strToType = 'mejri';
  var strTyped = '';
  return function (event) {
    var character = String.fromCharCode(event.which);
    strTyped += character;
    if (strToType.indexOf(strTyped) === -1) strTyped = '';
    else if (strTyped === strToType) {
      let currentRoute = router.currentRoute;
      strTyped = '';

      if (currentRoute.meta.allowEasterEgg) {
        router.push("mejri");
      }
    }
  };
}()));

export default router
