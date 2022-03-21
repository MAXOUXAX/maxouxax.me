<template>
    <v-scroll-x-transition mode="in-out">
        <v-card
          v-ripple
          class="mx-5 my-4 card"
          :min-width="vCardWidth"
          :width="vCardWidth"
          min-height="120"
          elevation="2"
          outlined
          :disabled="repository.archived"
          :to="'/projects/' + repository.name"
          raised
        >

            <v-card-title>{{ repository.name }} <v-icon v-if="repository.archived" right>mdi-lock</v-icon></v-card-title>


            <v-card-subtitle>{{ repository.description }}</v-card-subtitle>

            <div class="details">

                <v-card-subtitle class="stars">{{ repository.stars }} <v-icon class="mx-1" small>mdi-star</v-icon></v-card-subtitle>

                <v-divider vertical class="my-4"></v-divider>

                <v-card-subtitle class="license"><v-icon class="mx-1" small>mdi-scale-balance</v-icon> {{ repository.license ? repository.license.name : "Pas de license" }}</v-card-subtitle>

            </div>

            <v-divider class="mx-4"></v-divider>

            <v-chip
                class="ma-4 my-4"
            >
                {{ repository.language ? repository.language : 'Language inconnu' }}
            </v-chip>


        </v-card>
    </v-scroll-x-transition>
</template>

<script>
export default {
    name: 'github-repository',
    data: () => ({
        loading: false,
    }),
    computed: {
      vCardWidth () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return "80vw"
          default: return 374
        }
      },
    },
    props: {
        repository: {
            name: String,
            url: String,
            description: String,
            language: String,
            license: Object,
            stars: Number,
            archived: Boolean,
            updated: Date
        }
    }
}
</script>

<style scoped>
.card{
    cursor: pointer;
    user-select: none;
}
.v-card__title{
    justify-content: space-between;
}
.v-card--disabled{
    pointer-events: inherit !important;
}
.card .details{
    display: flex;
    justify-content: flex-start;
}
.card .stars{
    display: flex;
    align-items: center;
    align-content: center;
    vertical-align: middle;
}
.v-ripple__container::deep{
    border-radius: 5px;
}
</style>