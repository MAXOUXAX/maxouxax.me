<template>
  <div class="motus-grid" @click="openKeyboard">
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
    <input class="fakeTextInput" type="text" ref="fakeTextInput" />
  </div>
</template>

<script>
import MotusLetter from "./MotusLetter.vue";

export default {
  name: "motus-grid",
  data() {
    return {
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
          this.word = word.toLowerCase();
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
    };
  },
  mounted() {
    document.addEventListener("keydown", this.handleTyping);
  },
  destroyed() {
    document.removeEventListener("keydown", this.handleTyping);
  },
  methods: {
    handleTyping: function (e) {
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
    },
    moveRow: function (row) {
      this.cursor = 1;
      this.currentRow = row;
      this.$refs["row" + this.currentRow].forEach((motusLetter) => {
        motusLetter.setActive(true);
      });
      this.$refs["row" + this.currentRow][0].setLetter(this.motusWord.word[0]);
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
              let shouldRemoveLetter = true;
              if (this.motusWord.word[i] == letter) {
                motusLetter.setWellPlaced(true);
                shouldRemoveLetter = false;
              } else if (this.motusWord.contains(letter)) {
                motusLetter.setWronglyPlaced(true);
                this.partyOngoing = true;
              } else {
                this.partyOngoing = true;
              }
              if(shouldRemoveLetter) this.motusWord.removeLetter(letter);
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
        motusLetter.setActive(true);
      }
      motusLetter.setLetter(letter);
    },
    widthClass: function () {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "80vw";
        default:
          return "374px";
      }
    },
    openKeyboard: function () {
      this.$refs.fakeTextInput.focus();
    },
  },
  components: {
    MotusLetter,
  },
};
</script>

<style scoped>
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
@media screen and (max-height: 960px) {
  .col {
    width: 84px;
    height: 84px;
  }
}
@media screen and (max-width: 960px) {
  .col {
    width: 10vw;
    height: 10vw;
  }
}
</style>