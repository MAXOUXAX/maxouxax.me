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
            :key="route.name"
            :to="route.path"
          >
            <v-list-item class="my-1">
              <v-list-item-icon class="item-icon">
                <v-icon>{{ route.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ route.name }}</v-list-item-title>
            </v-list-item>
          </router-link>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar fixed>
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>

      <v-toolbar-title>{{ $route.name }}</v-toolbar-title>

      <v-switch
        :value="darkMode"
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
    darkMode: false,
  }),
  methods: {
    toggleDarkMode: function () {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      this.darkMode = !this.darkMode;
    },
  },
  computed: {
    pages() {
      return this.$router.options.routes.filter((route) => route.showInMenu);
    },
    switchLabel: function () {
      return this.darkMode ? "light" : "dark";
    },
  },
};
</script>

<style scoped>
#header {
  width: 100%;
  margin-bottom: 64px;
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