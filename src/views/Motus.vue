<template>
  <v-container class="d-flex justify-center align-center flex-column mt-8">
    <page-title>Motus</page-title>
    <v-divider width="20%" class="my-6"></v-divider>
    <div v-if="loading">
      <v-row align="center" justify="center">
        <v-sheet :width="vSkeletonWidth" class="mx-5 my-4">
          <v-skeleton-loader width="100%" type="date-picker"></v-skeleton-loader>
        </v-sheet>
      </v-row>
    </div>
    <div v-if="!loading" class="motus-grid" @click="openKeyboard">
      <v-row v-for="i in 6" :key="i" class="my-0 mx-0">
        <v-col
          class="pa-0"
          :width="widthClass()"
          v-for="l in motusWord.word.length"
          :key="l"
        >
          <motus-letter :ref="'row' + i"></motus-letter>
        </v-col>
      </v-row>
    </div>
    <input class="fakeTextInput" type="text" ref="fakeTextInput" />
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
        partie est perdue. !</v-card-subtitle
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
.fakeTextInput {
  width: 0px;
  height: 0px;
}
.col {
  border: 0.5px solid white;
  width: 96px;
  height: 96px;
  flex-basis: initial !important;
  flex-grow: initial !important;
}
@media screen and (max-width: 960px) {
  .col {
    width: 10vw;
    height: 10vw;
  }
}
</style>

<script>
import MotusLetter from "../components/MotusLetter.vue";
import PageTitle from "../components/PageTitle.vue";

export default {
  name: "Motus",
  data() {
    return {
      loading: true,
      cursor: Number,
      currentRow: Number,
      motusWord: {
        word: "",
        letterCount: {},
        letterCountClone: {},
        contains: function (letter) {
          return this.letterCountClone[letter] > 0;
        },
        setWord: function (word) {
          this.word = word;
          this.letterCount = word.split("").reduce((total, letter) => {
            total[letter] ? total[letter]++ : (total[letter] = 1);
            return total;
          }, {});
          this.letterCountClone = Object.assign({}, this.letterCount);
        },
        getWord: function () {
          return word;
        },
        removeLetter: function (letter) {
          if (this.letterCountClone[letter]) {
            this.letterCountClone[letter]--;
          }
        },
        resetLetterCount: function () {
          this.letterCountClone = this.letterCount;
        },
      },
      partyOngoing: Boolean,
    };
  },
  components: {
    "motus-letter": MotusLetter,
    PageTitle,
  },
  mounted() {
    this.startGame();
    this.$nextTick(() => {
      this.moveRow(1);
    });
    document.addEventListener("keydown", (e) => {
      e.stopPropagation();
      let key = e.key;
      if (key == "Enter") {
        this.validateRow();
      } else if (key == "Backspace") {
        this.moveCursor(-1);
        this.writeToCurrentCursor(".");
      } else if (/^[A-Z]$/.test(key.toUpperCase())) {
        this.writeToCurrentCursor(key);
        this.moveCursor(1);
      }
    });
  },
  methods: {
    startGame: function () {
      this.motusWord.setWord("maxouxax");
      this.partyOngoing = true;
	  setTimeout(() => {
      	this.loading = false;  
	  }, 1000);
    },
    moveRow: function (row) {
      this.cursor = 0;
      this.currentRow = row;
      this.$refs["row" + this.currentRow].forEach((row) => {
        row.setCurrentRow(true);
      });
    },
    moveCursor: function (direction) {
      let newCursor = this.cursor + direction;
      if (newCursor < 0) {
        newCursor = 0;
      }
      if (newCursor > this.motusWord.word.length) {
        newCursor = this.motusWord.word.length;
      }
      this.cursor = newCursor;
    },
    validateRow: async function () {
      if (this.cursor < this.motusWord.word.length) return;
      this.partyOngoing = false;

      this.$refs["row" + this.currentRow].forEach((motusLetter, i) => {
        let letter = motusLetter.getLetter().toLowerCase();
        if (this.motusWord.word[i] == letter) {
          this.motusWord.removeLetter(letter);
        }
      });

      let animation = [];
      this.$refs["row" + this.currentRow].forEach((motusLetter, i) => {
        animation.push(
          new Promise((resolve) => {
            setTimeout(() => {
              let letter = motusLetter.getLetter().toLowerCase();
              if (this.motusWord.word[i] == letter) {
                motusLetter.setWellPlaced(true);
              } else if (this.motusWord.contains(letter)) {
                motusLetter.setWronglyPlaced(true);
                this.partyOngoing = true;
              } else {
                this.partyOngoing = true;
              }
              this.motusWord.removeLetter(letter);
              resolve();
            }, i * 250);
          })
        );
      });
      await Promise.all(animation);
      if (this.partyOngoing) {
        this.moveRow(this.currentRow + 1);
        this.motusWord.resetLetterCount();
      }
    },
    writeToCurrentCursor: function (letter) {
      if (this.cursor >= this.motusWord.word.length) return;
      let motusLetter = this.$refs["row" + this.currentRow][this.cursor];
      if (!motusLetter.currentRow) {
        motusLetter.setCurrentRow(true);
      }
      motusLetter.setLetter(letter);
    },
    openKeyboard: function () {
      this.$refs.fakeTextInput.focus();
    },
    widthClass: function () {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "80vw";
        default:
          return "374px";
      }
    },
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
    vSkeletonWidth() {
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