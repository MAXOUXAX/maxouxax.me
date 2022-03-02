<template>
    <v-card
      v-ripple
      class="mx-5 my-4 card"
      min-width="374"
      max-width="374"
      min-height="120"
      elevation="2"
      outlined
      :href="repository.url"
      raised
      target="_blank"
    >

        <v-card-title>{{ repository.name }} <v-icon right>mdi-open-in-new</v-icon></v-card-title>


        <v-card-subtitle>{{ repository.description }}</v-card-subtitle>

    </v-card>
</template>

<script>
export default {
    name: 'github-repository',
    data: () => ({
        loading: false,
        selection: 1,
    }),
    methods: {
        reserve () {
            this.loading = true

            setTimeout(() => (this.loading = false), 2000)
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
</style>