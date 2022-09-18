<template>
  <div class="projects-list">
    <h1 class="mb-16">Projets</h1>
    <div class="d-flex align-center justify-center" v-if="networkError">
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
    <div v-if="loading && !networkError">
      <v-row justify="center" class="align-start" no-gutters>
        <v-sheet
            :width="vSkeletonWidth"
            v-for="index in 10"
            :key="index"
            class="mx-5 my-4"
        >
          <v-skeleton-loader width="100%" type="card"></v-skeleton-loader>
        </v-sheet>
      </v-row>
    </div>
    <div v-if="!loading" class="repository">
      <v-row justify="center" class="mx-0 align-start" no-gutters>
        <github-repository
            v-for="repo in repos"
            :repository="repo"
            :key="repo.name"
        ></github-repository>
      </v-row>
    </div>
  </div>
</template>

<script>
import GitHubRepository from "@/components/GitHubRepository.vue";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      repos: [],
      transitionName: "slide",
      loading: true,
      networkError: false,
    };
  },
  computed: {
    ...mapGetters([
      "vAlertWidth",
      "vSkeletonWidth",
    ]),
  },
  mounted() {
    fetch("https://api.github.com/users/MAXOUXAX/repos")
        .then((response) => {
          if (response.status === 403) throw new Error('Rate limit exceeded');
          return response.json()
        })
        .then((data) => {
          data
              .filter((repo) => repo.fork === false)
              .filter((repo) => repo.name !== "MAXOUXAX")
              .forEach((repo) => {
                this.repos.push({
                  name: repo.name,
                  url: repo.html_url,
                  description: repo.description,
                  language: repo.language,
                  license: repo.license,
                  stars: repo.stargazers_count,
                  archived: repo.archived,
                  pushed: repo.pushed_at,
                });
              });
        })
        .finally(() => {
          if (this.repos.length === 0) {
            this.networkError = true;
          } else {
            this.repos.sort((a, b) => {
              if (a.archived && !b.archived) return 1;
              if (!a.archived && b.archived) return -1;
              if (a.pushed < b.pushed) return 1;
              if (a.pushed > b.pushed) return -1;
              return 0;
            });
            this.loading = false;
          }
        })
        .catch((error) => {
          this.networkError = true;
        });
  },
  components: {
    "github-repository": GitHubRepository,
  },
};
</script>