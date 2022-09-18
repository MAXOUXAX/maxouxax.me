<template>
  <v-app>
    <Header></Header>
    <v-main>
      <v-breadcrumbs class="breadcrumbs" :items="breadCrumbsItems"></v-breadcrumbs>
      <v-container fill-height fluid>
        <transition
          name="slide-x-reverse-transition"
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

export default {
  name: "App",
  data() {
    return {
      prevHeight: 0,
    };
  },
  computed: {
    breadCrumbsItems() {
      let items = [];
      let routePath = this.$route.path;
      let routeParts = routePath.split("/");
      routeParts = routeParts.filter((part) => part !== "");
      if (routeParts.length >= 1) {
        let homeRoute = this.$router.match("/");
        items.push({
          text: homeRoute.name,
          disabled: false,
          to: homeRoute.fullPath,
        });
        routeParts.forEach((part, index) => {
          let aRoute = this.$router.match("/" + routeParts.slice(0, index + 1).join("/"));
          let routeParams = Object.keys(aRoute.params);
          let name = routeParams.length >= 1 ? part : aRoute.name;
          let routeTo = routeParams.length >= 1 ? "/" + routeParts.slice(0, index + 1).join("/") : aRoute.fullPath;
          items.push({
            text: name,
            disabled: routeParts[routeParts.length - 1] == part,
            to: routeTo,
            exact: true
          });
        });
      }
      return items;
    },
  },
  components: {
    Footer,
    Header,
    CSSMetaProperties
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
      element.style.height = null;
    },
  },
};
</script>

<style>
.container {
  width: 100%;
  min-height: 100%;
  padding: 0 !important;
}
.breadcrumbs{
  position: absolute;
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
}
</style>