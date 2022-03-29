import Vue from 'vue'
import Vuetify from '@/plugins/vuetify';
import Vuex from 'vuex'

Vue.use(Vuex)

let theme = "dark";

let storageTheme = localStorage.getItem("theme");
if (storageTheme) {
  if (storageTheme === "dark" || storageTheme === "light") {
    theme = storageTheme;
  } else {
    localStorage.removeItem("theme");
  }
} else {
  const osTheme = window.matchMedia("(prefers-color-scheme: dark)");
  theme = osTheme.matches ? "dark" : "light";
  localStorage.setItem("theme", theme);
}

const store = new Vuex.Store({
  state: {
    theme: theme,
  },
  mutations: {
    changeTheme(state) {
      state.theme = !state.theme;
      Vuetify.framework.theme.dark = state.theme;
      localStorage.setItem("theme", state.theme ? "dark" : "light");
    },
    setTheme(state, theme) {
      state.theme = theme;
      Vuetify.framework.theme.dark = state.theme;
      localStorage.setItem("theme", state.theme ? "dark" : "light");
    }
  },
  actions: {
  },
  modules: {
  }
})

Vue.nextTick().then(() => {
  Vuetify.framework.theme.dark = theme === "dark" ? true : false;
  store.commit("setTheme", theme === "dark" ? true : false);
});

export default store;