<template>
  <div id="header">
    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list shaped>
        <v-list-item-group
          v-model="group"
          active-class="blue--text text--accent-4"
        >
          <router-link
            v-for="route in this.pages"
            :key="getRouteName(route)"
            :to="route.path"
          >
            <v-list-item class="my-1">
              <v-list-item-icon class="item-icon">
                <v-icon>{{ route.meta.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ getRouteName(route) }}</v-list-item-title>
            </v-list-item>
          </router-link>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>

      <v-toolbar-title>{{ $route.name }}</v-toolbar-title>

      <v-switch
        :value="!this.$store.state.theme"
        @change="toggleDarkMode"
        inset
        class="ml-auto switch"
        prepend-icon="mdi-weather-night"
        append-icon="mdi-weather-sunny"
      ></v-switch>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  data: () => ({
    drawer: false,
    group: null,
  }),
  async mounted(){
    await this.$nextTick();
  },
  methods: {
    toggleDarkMode: function () {
      this.$store.commit('changeTheme');
    },
    getRouteName: function (route) {
      return this.$router.match(route.path).name;
    }
  },
  computed: {
    pages() {
      return this.$router.options.routes.filter((route) => route.meta.showInMenu);
    },
  },
};
</script>

<style scoped>
#header {
  width: 100%;
}
#header .item-icon {
  margin: 10px;
  margin-right: 32px;
}
::v-deep .v-input__control{
  flex-direction: row;
  flex-wrap: nowrap !important;
}
::v-deep .v-input__slot{
  margin-bottom: 0;
}
::v-deep .v-input--selection-controls__input{
  margin-right: -8px !important;
}
</style>