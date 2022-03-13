<template>
  <transition name="slide-down" mode="out-in">
    <div class="game-of-motus" v-show="gameStarted">
      <v-dialog v-model="abandonDialog" max-width="300px">
        <v-card>
          <v-card-title
            >Voulez-vous vraiment abandonner cette partie ?</v-card-title
          >
          <v-divider></v-divider>
          <v-card-text class="my-4">
            Êtes-vous sûr de vouloir abandonner la partie en cours ? ATTENTION:
            Votre progression sera perdue !
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="justify-space-between">
            <v-btn text @click="abandonDialog = false"> Annuler </v-btn>
            <v-btn color="red" @click="abandonGame">Abandonner</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <div class="game-command d-flex justify-center ma-12">
        <v-btn outlined rounded color="red" @click="confirmAbandonGame"
          >Abandonner</v-btn
        >
      </div>
      <motus-grid ref="motusGrid"></motus-grid>
    </div>
  </transition>
</template>

<script>
import MotusGrid from "@/components/motus/MotusGrid.vue";

export default {
  data() {
    return {
      motusGrid: null,
      partyOngoing: Boolean,
      gameStarted: false,
      abandonDialog: false,
    };
  },
  components: {
    MotusGrid,
  },
  methods: {
    startGame: async function (type) {
      await this.$nextTick();
      this.motusGrid = this.$refs.motusGrid;
      this.partyOngoing = true;
      if (type == "random") {
        await this.startRandomGame();
      } else {
        await this.startTodaysWordGame();
      }
      this.motusGrid.moveRow(1);
      this.gameStarted = true;
      this.$emit("game-state-change", this.gameStarted);
    },
    startRandomGame: async function () {
      return fetch("https://api.github.com/users/maxouxax/followers")
        .then((response) => response.json())
        .then((data) => {
          this.motusGrid.motusWord.setWord("randomword");
        });
    },
    startTodaysWordGame: async function () {
      return fetch("https://api.github.com/users/maxouxax/followers")
        .then((response) => response.json())
        .then((data) => {
          this.motusGrid.motusWord.setWord("todaysword");
        });
    },
    confirmAbandonGame: function () {
      this.abandonDialog = true;
    },
    abandonGame: function () {
      this.partyOngoing = false;
      this.gameStarted = false;
      this.abandonDialog = false;
      this.motusGrid.motusWord.setWord("");
      this.$emit("game-state-change", this.gameStarted);
    },
  },
  computed: {
    vSkeletonWidth: function () {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "80vw";
        default:
          return 512;
      }
    },
  },
};
</script>

<style>
</style>