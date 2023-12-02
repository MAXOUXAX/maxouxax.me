<template>
  <v-footer inset width="auto" padless elevation="20">
    <v-card flat tile class="lighten-1 text-center">
      <v-card-text>
        <v-btn
          v-for="icon in icons"
          :key="icon.icon"
          :href="icon.link"
          target="_blank"
          class="mx-4"
          icon
        >
          <v-icon size="24px">
            {{ icon.icon }}
          </v-icon>
        </v-btn>
      </v-card-text>

      <v-card-text class="pt-0">
        Étudiant en troisième année • BUT Informatique
      </v-card-text>

      <v-row justify="center" no-gutters>
        <v-btn
          v-for="link in links"
          :key="link.name"
          :href="link.url"
          :to="link.to"
          :target="link.to ? '' : '_blank'"
          text
          rounded
          class="link mx-1 my-2"
        >
          {{ link.name }}
        </v-btn>
      </v-row>

      <v-divider></v-divider>

      <v-card-text class="copyright">
        <v-icon size="14px">mdi-copyright</v-icon>2021 -
        {{ new Date().getFullYear() }} — <strong>MAXOUXAX</strong>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
export default {
  data: () => ({
    icons: [
      {
        icon: "mdi-twitter",
        link: "https://twitter.com/MAXOUXAX/",
        name: "Twitter",
      },
      {
        icon: "mdi-youtube",
        link: "https://youtube.com/MAXOUXAX",
        name: "YouTube",
      },
      {
        icon: "mdi-github",
        link: "https://github.com/MAXOUXAX",
        name: "GitHub",
      },
    ],
    links: [
      {
        name: "Accueil",
        to: "/",
      },
      {
        name: "Projets",
        to: "/projects",
      },
      {
        name: "État des services",
        url: "https://status.maxouxax.me/",
      },
    ],
  }),
};
</script>

<style>
footer {
  width: 100%;
}
footer .copyright {
  user-select: none;
  -webkit-user-select: none;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
}
footer .copyright * {
  margin: 0px 3px;
}
footer div {
  width: 100%;
}
footer .link::before {
  opacity: 0 !important;
}
</style>