<template>
  <div class="game-of-motus">
    <div v-if="loading">
      <v-row align="center" justify="center">
        <v-sheet
          :width="vSkeletonWidth"
          class="mx-5 my-4"
          transition="v-expand-x-transition"
        >
          <v-skeleton-loader
            width="100%"
            type="list-item@6"
          ></v-skeleton-loader>
        </v-sheet>
      </v-row>
    </div>
    <motus-grid ref="motusGrid" v-show="!loading"></motus-grid>
  </div>
</template>

<script>
import MotusGrid from "@/components/motus/MotusGrid.vue";

export default {
  data() {
    return {
      motusGrid: null,
      partyOngoing: Boolean,
      loading: true,
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
    },
    startRandomGame: async function () {
      return fetch("https://api.github.com/users/maxouxax/followers")
        .then((response) => response.json())
        .then((data) => (this.loading = false))
        .then((data) => {
          this.motusGrid.motusWord.setWord("AHAHAHAH");
        });
    },
    startTodaysWordGame: async function () {
      return fetch("https://api.github.com/users/maxouxax/followers")
        .then((response) => response.json())
        .then((data) => (this.loading = false))
        .then((data) => {
          this.motusGrid.motusWord.setWord("randomword");
        });
    },
    abandonGame: function () {
      this.partyOngoing = false;
      this.motusGrid.motusWord.setWord("");
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