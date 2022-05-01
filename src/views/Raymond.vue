<template>
  <div class="raymond mt-12 mx-xl-12 mx-lg-8 mx-md-8 mx-sm-4 mx-xs-2">
    <div class="loading d-flex justify-center" v-if="loading">
      <v-sheet :width="vSkeletonWidth" class="mx-5 my-4">
        <v-skeleton-loader width="100%" type="card"></v-skeleton-loader>
      </v-sheet>
    </div>
    <div class="error" v-if="!valid">
      <h1>Error</h1>
    </div>
    <div class="contact ma-4" v-if="!loading">
      <div class="contact-info d-flex justify-center">
        <v-card flat color="transparent" class="mb-10">
          <div class="d-flex align-content-center align-center">
            <v-avatar class="profile mr-4" size="128">
              <v-img :src="teacher.image"></v-img>
            </v-avatar>
            <v-divider vertical class="my-12"></v-divider>
            <div class="identity d-flex justify-center flex-column">
              <v-card-title class="text-h3 py-0 font-weight-bold">{{
                teacher.displayName
              }}</v-card-title>
              <v-card-text class="text-h5 py-0 text--secondary">{{
                teacher.bcShortLabel
              }}</v-card-text>
            </div>
          </div>
        </v-card>
      </div>
      <div
        class="
          contact-buttons
          d-flex
          justify-center
          align-center align-content-center
          flex-column
          mt-16
        "
      >
        <p class="text-h4 font-weight-bold">
          Choisissez la messagerie à utiliser
        </p>
        <v-divider class="mx-16"></v-divider>
        <div class="options full-width d-flex justify-center flex-wrap">
          <v-card
            v-ripple
            class="mx-5 my-4 card"
            :min-width="vCardWidth"
            :width="vCardWidth"
            min-height="120"
            elevation="2"
            outlined
            :href="
              'https://mail.etu.univ-lorraine.fr/zimbra/mail?view=compose&to=' +
              email
            "
            raised
          >
            <v-card-title
              ><v-icon left>mdi-email</v-icon> Messagerie
              universitaire</v-card-title
            >
            <v-card-subtitle
              >Contactez {{ teacher.displayName }} via la messagerie de
              l'Université de Lorraine</v-card-subtitle
            >
          </v-card>
          <v-card
            v-ripple
            class="mx-5 my-4 card"
            :min-width="vCardWidth"
            :width="vCardWidth"
            min-height="120"
            elevation="2"
            outlined
            :href="'mailto:' + email"
            raised
          >
            <v-card-title
              ><v-icon left>mdi-email</v-icon> Messagerie de mon
              appareil</v-card-title
            >
            <v-card-subtitle
              >Contactez {{ teacher.displayName }} via la messagerie par défaut
              de votre appareil</v-card-subtitle
            >
          </v-card>
          <v-card
            v-ripple
            class="mx-5 my-4 card"
            :min-width="vCardWidth"
            :width="vCardWidth"
            min-height="120"
            elevation="2"
            outlined
            :disabled="copied"
            @click="
              copyEmail();
              copied = true;
            "
            raised
          >
            <v-card-title
              ><v-icon left>mdi-clipboard-text</v-icon> Copier l'adresse
              email</v-card-title
            >
            <v-card-subtitle
              >Contactez {{ teacher.displayName }} via la messagerie de votre
              choix en copiant simplement l'adresse email</v-card-subtitle
            >
          </v-card>
          <v-snackbar elevation="12" v-model="copied" timeout="3000">
            Adresse email copiée !
            <template v-slot:action="{ attrs }">
              <v-btn color="info" text v-bind="attrs" @click="copied = false">
                Fermer
              </v-btn>
            </template>
          </v-snackbar>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const emailPattern = new RegExp("(.*)(@univ-lorraine.fr)$");

export default {
  name: "Raymond",
  data() {
    return {
      teacher: {},
      copied: false,
      email: "",
      loading: true,
      valid: true,
    };
  },
  async mounted() {
    this.email = this.$route.params.email;
    if (this.email.match(emailPattern)) {
      let id = this.email.match(emailPattern)[1].split(".").join(" ");
      this.teacher = await fetch("/api/raymond/get-info?search=" + id).then(
        (response) => response.json()
      );
      this.email = this.decryptEmail(this.teacher.mail);
    } else {
      this.valid = false;
    }
    this.loading = false;
  },
  methods: {
    copyEmail() {
      navigator.clipboard.writeText(this.email);
    },
    decryptEmail(email) {
      var n = 0;
      var r = "";
      for (var i = 0; i < email.length; i++) {
        n = email.charCodeAt(i);
        if (n >= 8364) {
          n = 128;
        }
        r += String.fromCharCode(n - 1);
      }
      return r;
    },
  },
  computed: {
    vSkeletonWidth() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "80vw";
        default:
          return 374;
      }
    },
    vCardWidth() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "80vw";
        default:
          return 374;
      }
    },
  },
};
</script>

<style scoped>
.raymond {
  height: 100%;
  width: 100%;
}
</style>