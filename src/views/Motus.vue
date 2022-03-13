<template>
  <v-container class="d-flex align-center flex-column mt-8">
    <page-title>Motus</page-title>
    <v-divider width="20%" class="my-6"></v-divider>
    <motus-game></motus-game>
    <v-card
      class="my-16 my-14 card"
      :min-width="vCardWidth"
      :width="vCardWidth"
      min-height="120"
      elevation="2"
      raised
      outlined
    >
      <v-card-title
        >Règles du Motus
        <v-icon right>mdi-clipboard-text-outline</v-icon></v-card-title
      >
      <v-card-subtitle class="rules-subtitle"
        >Un mot est choisi aléatoirement dans le dictionnaire Français en début
        de partie. Votre mission ? Deviner le mot caché derrière cette grille
        avec le moins d'essais possibles, dans la limite de 6, après lequel la
        partie est perdue.</v-card-subtitle
      >
      <v-divider class="my-4"></v-divider>
      <v-card-title>Un 🟥 apparaît ?</v-card-title>
      <v-card-subtitle
        >Si un carré rouge recouvre le fond de la case, cela indique que la
        lettre présente dans cette case est bien placée.</v-card-subtitle
      >
      <v-card-title>Un 🟡 apparaît ?</v-card-title>
      <v-card-subtitle
        >Si un cercle jaune apparaît sur la case, cela indique que la lettre
        présente dans cette case est présente dans le mot, mais mal
        placée</v-card-subtitle
      >
    </v-card>
  </v-container>
</template>

<style scoped>
.v-card__title {
  justify-content: space-between;
}
.rules-subtitle {
  width: 80%;
}
</style>

<script>
import MotusGame from "@/components/motus/MotusGame.vue";
import PageTitle from "@/components/PageTitle.vue";

export default {
  name: "Motus",
  components: {
    PageTitle,
    MotusGame
  },
  computed: {
    vCardWidth() {
      switch (this.$vuetify.breakpoint.name) {
        case "sm":
        case "xs":
          return "80vw";
        default:
          return 640;
      }
    },
  },
};
</script>