<template>
  <v-footer
    inset
    width="auto"
    dark
    padless
  >
    <v-card
      flat
      tile
      class="lighten-1 white--text text-center"
    >
      <v-card-text>
        <a rel="noreferrer" v-for="icon in icons" :key="icon.icon" :href="icon.link" target="_blank">
        <v-btn
          class="mx-4 white--text"
          icon
        >
          <v-icon size="24px">
            {{ icon.icon }}
          </v-icon>
        </v-btn>
        </a>
      </v-card-text>

      <v-card-text class="white--text pt-0">
        Étudiant en première année • BUT Informatique
      </v-card-text>

      <v-divider></v-divider>

      <v-card-text class="copyright white--text">
        <v-icon size="14px">mdi-copyright</v-icon>2021 - {{ new Date().getFullYear() }} — <strong>MAXOUXAX</strong>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
  export default {
    data: () => ({
      icons: [
        {icon: 'mdi-twitter', link: 'https://twitter.com/MAXOUXAX/', name: 'Twitter'},
        {icon: 'mdi-youtube', link: 'https://youtube.com/MAXOUXAX', name: 'YouTube'},
        {icon: 'mdi-github', link: 'https://github.com/MAXOUXAX', name: 'GitHub'},
      ],
    }),
  }
</script>

<style>
footer{
    width: 100%;
}
footer .copyright{
    user-select: none;
    -webkit-user-select: none;
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
}
footer .copyright *{
    margin: 0px 3px;
}
footer div{
    width: 100%;
}
</style>