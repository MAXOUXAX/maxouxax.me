<template>
  <div class="raymond-home d-flex justify-center align-center flex-column">
    <span class="mb-16 mx-16 font-weight-regular">Raymond est un BOT Discord développé pour les serveurs de la promo de
      BUT INFO, vous permettant d'obtenir des informations sur l'emploi du temps, les devoirs, ainsi que les
      professeurs.</span>
    <v-divider width="40%"></v-divider>
    <h3>Que souhaitez-vous faire ?</h3>
    <div class="d-flex justify-center align-center mx-10">
      <v-card v-ripple class="mx-5 my-4 card" :min-width="vCardWidth" :width="vCardWidth" min-height="120" elevation="2"
        outlined to="/raymond/teacher" raised>
        <v-card-title>Rechercher un professeur <v-icon right>mdi-magnify</v-icon>
        </v-card-title>
        <v-card-subtitle>Cette fonction vous permettra de rechercher un professeur parmi l'annuaire de l'Université de
          Lorraine</v-card-subtitle>
      </v-card>
    </div>
  </div>
</template>

<script>
import RaymondTeacherSearch from "@/components/raymond/RaymondTeacherSearch";
import { mapGetters } from "vuex";

export default {
  name: 'RaymondHome',
  components: { RaymondTeacherSearch },
  computed: {
    ...mapGetters([
      'vCardWidth'
    ])
  },
}
</script>