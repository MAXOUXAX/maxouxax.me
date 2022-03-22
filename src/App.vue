<template>
  <v-app>
    <Header :theme="theme"></Header>
    <v-main>
      <v-container fill-height fluid>
        <transition
          name="slide-down"
          mode="out-in"
          appear
          @beforeLeave="beforeLeave"
          @enter="enter"
          @afterEnter="afterEnter"
        >
          <router-view></router-view>
        </transition>
      </v-container>
    </v-main>
    <Footer></Footer>
  </v-app>
</template>

<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import CSSMetaProperties from "@/components/CSSMetaProperties.vue";

const DEFAULT_TRANSITION = "slide";

export default {
  name: "App",
  data() {
    return {
      prevHeight: 0,
      transitionName: DEFAULT_TRANSITION,
      theme: "dark",
    };
  },
  components: {
    Footer,
    Header,
  },
  created() {
    this.$router.beforeEach((to, from, next) => {
      let transitionName = to.meta.transitionName || from.meta.transitionName;

      if (transitionName === "slide") {
        const toDepth = to.path.split("/").length;
        const fromDepth = from.path.split("/").length;
        transitionName = toDepth < fromDepth ? "slide-down" : "slide-up";
      }

      this.transitionName = transitionName || DEFAULT_TRANSITION;

      next();
    });
  },
  methods: {
    beforeLeave(element) {
      this.prevHeight = getComputedStyle(element).height;
    },
    enter(element) {
      const { height } = getComputedStyle(element);

      element.style.height = this.prevHeight;

      setTimeout(() => {
        element.style.height = height;
      });
    },
    afterEnter(element) {
      element.style.height = "auto";
    },
  },
  mounted() {
    let theme = localStorage.getItem("theme");
    if (theme) {
      if(theme === "dark" || theme === "light") {
        this.theme = theme;
      }else{
        localStorage.removeItem("theme");
      }
    } else {
      const osTheme = window.matchMedia("(prefers-color-scheme: dark)");
      this.theme = osTheme.matches ? "dark" : "light";
      localStorage.setItem("theme", this.theme);
    }
    this.$vuetify.theme.dark = this.theme === "dark" ? true : false;
  },
};
</script>

<style>
.slide-down-enter-active,
.slide-down-leave-active,
.slide-up-enter-active,
.slide-up-leave-active {
  transition-duration: 0.5s;
  transition-property: opacity, transform;
  transition-timing-function: cubic-bezier(0.55, 0, 0.1, 1);
  overflow: hidden;
}

.slide-down-enter,
.slide-up-leave-active {
  opacity: 0;
  transform: translate(0, -2em);
}

.slide-down-leave-active,
.slide-up-enter {
  opacity: 0;
  transform: translate(0, 2em);
}

@import url("https://fonts.googleapis.com/css2?family=Cabin:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap");

.container {
  width: 100%;
  min-height: 100%;
  padding: 0 !important;
}
a {
  text-decoration: none;
}
html {
  height: 100%;
  overflow-x: hidden;
  background-color: black;
  scroll-behavior: smooth;
}
body {
  min-height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}
* {
  margin: 0;
  padding: 0;
  font-family: "Cabin", sans-serif;
}
</style>