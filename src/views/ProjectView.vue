<template>
  <div class="project-view">
    <page-title v-if="!loading" class="mb-16">{{ repository.name }}</page-title>
    <v-skeleton-loader v-if="loading">
      <v-row align="center" justify="center" class="mx-0">
        <v-sheet :width="vSkeletonWidth" class="mx-5 my-4">
          <v-skeleton-loader width="100%" type="card"></v-skeleton-loader>
        </v-sheet>
      </v-row>
    </v-skeleton-loader>
    <div class="network-error" v-if="networkError">
      <v-alert
        border="left"
        icon="mdi-alert-circle"
        transition="slide-y-transition"
        elevation="4"
        type="error"
        :width="vAlertWidth"
      >
        Une erreur est survenue lors du chargement des projets. Veuillez
        vérifier votre connexion Internet ou réessayer plus tard.
      </v-alert>
    </div>
    <div class="not-found-error" v-if="notFound">
      <v-alert
        border="left"
        icon="mdi-alert-circle"
        transition="slide-y-transition"
        elevation="4"
        type="error"
        :width="vAlertWidth"
      >
        Ce projet n'existe pas. Veuillez retourner à la liste des projets.
      </v-alert>
    </div>
    <div v-if="!loading" class="project">
      <github-repository
        :repository="repository"
        :key="repository.name"
      ></github-repository>
    </div>
  </div>
</template>

<script>
import GitHubRepository from "@/components/GitHubRepository.vue";
import PageTitle from "@/components/PageTitle.vue";

export default {
  name: "project-view",
  data: () => ({
    loading: true,
    networkError: false,
    notFound: false,
    repository: null,
    titleLoader: `<v-skeleton-loader
      class="mx-auto"
      max-width="300"
      type="card"
    ></v-skeleton-loader>`,
  }),
  methods: {
    getRepository: async function () {
      await fetch("https://api.github.com/repos/MAXOUXAX/" + this.projectName)
        .then((response) => response.json())
        .then((data) => {
          if (data.message == "Not Found") {
            this.notFound = true;
          } else {
            this.repository = {
              name: data.name,
              url: data.html_url,
              description: data.description,
              language: data.language,
              license: data.license,
              stars: data.stargazers_count,
              archived: data.archived,
              pushed: data.pushed_at,
            };
          }
        });
      await fetch(
        "https://api.github.com/repos/MAXOUXAX/" +
          this.repository.name +
          "/branches/main"
      )
        .then((response) => response.json())
        .then((data) => {
          this.repository.lastCommit = data.commit.commit.author.date;
        });
    },
  },
  async mounted() {
    await this.getRepository();
    if (this.repository == null && !this.notFound) {
      this.networkError = true;
    } else {
      this.loading = false;
    }
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
    vAlertWidth() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "80vw";
        default:
          return "520px";
      }
    },
  },
  props: {
    projectName: String,
  },
  components: {
    PageTitle,
    "github-repository": GitHubRepository,
  },
};
</script>

<style>
</style>