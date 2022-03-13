<template>
  <div class="motus-game">
    <transition name="slide-down" mode="out-in">
      <div v-if="!gameStarted" class="game-selection-screen py-12">
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
              @click="startGame('todays-word')"
              color="primary"
              elevation="10"
              outlined
              raised
              rounded
              x-large
              block
              :loading="todaysLoading"
            >
              <v-icon left> mdi-calendar-today </v-icon>
              Mot du jour
            </v-btn>
            <v-btn
              class="game-selection-screen-button ma-2"
              @click="startGame('random')"
              color="secondary"
              elevation="10"
              outlined
              raised
              rounded
              x-large
              block
              :loading="randomLoading"
            >
              <v-icon left> mdi-dice-5-outline </v-icon>
              Mot aléatoire
            </v-btn>
          </div>
        </v-card-actions>
      </div>
    </transition>
    <div class="game">
      <game-of-motus
        ref="gameOfMotus"
        @game-state-change="gameStateChange"
      ></game-of-motus>
    </div>
  </div>
</template>

<script>
import GameOfMotus from "@/components/motus/GameOfMotus.vue";

export default {
  components: {
    GameOfMotus,
  },
  data() {
    return {
      gameOfMotus: null,
      todaysLoading: false,
      randomLoading: false,
      gameStarted: false,
    };
  },
  mounted() {
    this.gameOfMotus = this.$refs.gameOfMotus;
  },
  methods: {
    startGame: async function (type) {
      this.toggleLoader(type, true);
      await this.gameOfMotus.startGame(type);
      this.toggleLoader(type, false);
    },
    toggleLoader: function (type, state) {
      if (type == "todays-word") {
        this.todaysLoading = state;
      } else {
        this.randomLoading = state;
      }
    },
    gameStateChange: function (state) {
      this.gameStarted = state;
    },
  },
};
</script>

<style scoped>
.game-selection-screen {
  height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>