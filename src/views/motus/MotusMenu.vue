<template>
  <v-container class="d-flex align-center flex-column mt-8">
    <div class="game-selection-screen py-12">
      <v-card-title>
        Choisissez le type de partie à laquelle vous souhaitez jouer
      </v-card-title>
      <v-card-actions class="justify-space-around">
        <div
            class="
              game-selection-screen-buttons
              d-flex
              justify-space-around
              ma-2
              flex-wrap
            "
        >
          <v-btn
              class="game-selection-screen-button ma-2"
              to="motus/daily"
              color="primary"
              raised
              rounded
              x-large
              block
          >
            <v-icon left> mdi-calendar-today </v-icon>
            Mot du jour
          </v-btn>
          <v-btn
              class="game-selection-screen-button ma-2"
              to="motus/random"
              color="secondary"
              outlined
              raised
              rounded
              x-large
              block
          >
            <v-icon left> mdi-dice-5-outline </v-icon>
            Mot aléatoire
          </v-btn>
        </div>
      </v-card-actions>
    </div>
  </v-container>
</template>

<style scoped>
.game-selection-screen {
  height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>

<script>
import PageTitle from "@/components/PageTitle.vue";

export default {
  name: "Motus",
  components: {
    PageTitle,
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