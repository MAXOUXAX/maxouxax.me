<template>
  <div class="game">
    <v-row class="mb-6 justify-center" no-gutters>
      <v-col class="pa-6">
        <v-card>
          <v-card-title>Informations sur la partie en cours</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <h3>Partie: {{ isStarted() ? "En cours (" + getGameDuration + ")" : "Arrêtée" }}</h3>
            <h3>Type: <span class="info--text">{{ getGameMode.displayName }}</span></h3>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="pa-4">
            <v-btn outlined rounded color="error" @click="getMotusGame().confirmAbandonGame()"
            >Abandonner
            </v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col class="pa-6">
        <motus-game ref="motusGame"></motus-game>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import MotusGame from '@/components/motus/MotusGame.vue'

export default {
  name: 'MotusGameView',
  components: {
    MotusGame
  },
  props: {
    gameMode: {
      type: String,
      required: true
    }
  },
  computed: {
    getGameMode() {
      return {
        name: this.$props.gameMode,
        displayName: this.$props.gameMode === "daily" ? "Mot du jour" : "Mot aléatoire",
      };
    },
  },
  methods: {
    getGameDuration() {
      if (!this.isStarted()) return "00:00:00";
      return Date.now() - this.getMotusGame().gameStartDate.getTime();
    },
    getMotusGame() {
      return this.$refs.motusGame;
    },
    isStarted() {
      return this.getMotusGame() == null ? false : this.getMotusGame().gameStarted;
    }
  },
  async mounted() {
    await this.$nextTick();
    await this.getMotusGame().startGame(this.gameMode.name);
  }
}
</script>

<style>
.game {
  width: 100%;
}
</style>