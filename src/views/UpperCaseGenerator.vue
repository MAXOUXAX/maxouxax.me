<template>
  <div id="uppercasegenerator" class="my-12">
    <div class="header d-flex justify-center align-center flex-column">
      <div class="title">
        <v-card-text class="text--primary text-center">
          <h1>UpperCaseGenerator</h1>
        </v-card-text>
      </div>
      <v-divider width="40%" class="mx-16"></v-divider>
    </div>
    <div class="main">
      <div
        class="
          convert
          d-flex
          justify-center
          flex-column
          align-center align-content-center
        "
      >
        <div class="input">
          <v-textarea
            outlined
            v-model="text"
            name="input-7-4"
            id="input"
            label="Texte à modifier"
            maxlength="9000"
            placeholder="Entrez votre texte ici"
          ></v-textarea>
        </div>
        <div class="output">
          <v-text-field
            v-model="transformText"
            append-icon="mdi-clipboard-text-multiple-outline"
            outlined
            id="output"
            label="Résultat"
            type="text"
            readonly
            maxlength="9000"
            @click:append="copyToClipboard()"
          ></v-text-field>
        </div>
      </div>
      <v-row
        align="center"
        justify="center"
        class="ma-0">
        <v-card
          raised
          outlined
          min-height="120"
          :width="vCardWidth"
          elevation="2"
        >
          <v-card-title class="text--primary text-center">
            Pourquoi ce site ?
          </v-card-title>
          <v-card-text>
              UpperCaseGenerator est un utilitaire vous permettant de
              transformer du texte en alternant majuscule et minuscule.
          </v-card-text>
          <v-card-text>
              Pour utiliser cet utilitaire, il vous suffit d'écrire votre texte
              original dans l'emplacement prévu à cet effet, et le site se
              chargera de le transformer en temps réel. Vous pourrez retrouver le résultat dans
              l'emplacement juste en dessous, et le copier à l'aide de l'icône prévu à cet effet.
          </v-card-text>
        </v-card>
      </v-row>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      text: "",
    };
  },
  methods: {
    copyToClipboard: function () {
      var copyText = document.getElementById("output");
      var check = document.getElementById("clip");

      copyText.select();

      document.execCommand("copy");
      check.style.transform = "scale(1,1)";
      setTimeout(() => {
        check.style.transform = "scale(0,0)";
      }, 1500);
    },
  },
  computed: {
    transformText: function () {
      var str = "";
      for (var i = 0; i < this.text.length; i++) {
        i % 2
          ? (str = str + this.text.charAt(i).toUpperCase())
          : (str = str + this.text.charAt(i).toLowerCase());
      }
      return str;
    },
    vCardWidth() {
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

<style scoped>
.input,
.output {
  max-width: 1024px;
  width: 100%;
}
#uppercasegenerator {
  width: 100%;
}
.title h1{
  margin-bottom: 80px;
  transition: 0.3s cubic-bezier(0.86, 0, 0.07, 1);
}
.title .v-card__text {
  font-size: 4vw !important;
}
.title h1:hover {
  transform: scale(0.95, 0.95);
}
.convert {
  padding: 50px;
  margin: 1vw;
  text-align: center;
}
@media screen and (min-width: 1000px) {
  .title h1 {
    font-size: 4rem;
  }
}
</style>