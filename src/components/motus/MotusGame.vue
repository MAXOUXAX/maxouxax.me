<template>
  <div class="motus-game">
    <div v-if="!gameStarted" class="game-selection-screen">
      <div class="game-selection-screen-title">
        <h1>Game of Motus</h1>
      </div>
      <div class="game-selection-screen-buttons">
        <v-btn
          class="game-selection-screen-button"
          @click="startGame('random')"
        >
          Random
        </v-btn>
        <v-btn
          class="game-selection-screen-button"
          @click="startGame('todays-word')"
        >
          Today's Word
        </v-btn>
      </div>
    </div>
    <div class="game" v-show="gameStarted">
      <div class="game-command">
        <v-btn outlined color="red" @click="abandonGame">Abandonner</v-btn>
      </div>
      <game-of-motus ref="gameOfMotus"></game-of-motus>
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
      gameStarted: false,
      gameOfMotus: null,
    };
  },
  mounted() {
    this.gameOfMotus = this.$refs.gameOfMotus;
  },
  methods: {
    startGame: async function (type) {
      this.gameStarted = true;
      await this.gameOfMotus.startGame(type);
    },
    abandonGame: function () {
      this.gameStarted = false;
      this.gameOfMotus.loading = true;
    },
  },
};
</script>

<style>
</style>