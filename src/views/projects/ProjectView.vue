<template>
  <div class="project-view fill-height">
    <page-title v-if="!loading" class="mb-16">{{ repository.name }}</page-title>
    <div class="d-flex align-center justify-center" v-if="networkError">
      <v-alert
        border="left"
        icon="mdi-alert-circle"
        transition="slide-y-transition"
        elevation="4"
        type="error"
        :width="vAlertWidth"
      >
        Une erreur est survenue lors du chargement des informations du projet.
        Veuillez vérifier votre connexion Internet ou réessayer plus tard.
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
    <v-skeleton-loader v-if="loading && !networkError && !notFound">
      <v-skeleton-loader
        class="mx-auto d-flex justify-center mb-16"
        max-width="800px"
        type="heading"
      ></v-skeleton-loader>
      <v-row align="center" justify="center" class="mx-0">
        <v-sheet :width="vSkeletonWidth" class="mx-5 my-4">
          <v-skeleton-loader width="100%" type="card"></v-skeleton-loader>
        </v-sheet>
      </v-row>
    </v-skeleton-loader>
    <div
      v-if="!loading"
      class="project d-flex justify-center align-center align-content-center"
    >
      <v-container full-width>
        <v-row class="mb-6 justify-center" no-gutters>
          <v-col>
            <v-card class="ma-5">
              <v-card-title primary-title>
                {{ repository.name }}
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                {{ repository.description }}
              </v-card-text>
            </v-card>
            <v-card class="ma-5 mt-12">
              <v-card-title primary-title>README.md</v-card-title>
              <v-divider></v-divider>
              <div v-html="compileMarkdown" class="pa-4"></div>
            </v-card>
          </v-col>
          <v-col>
            <v-card class="ma-5">
              <v-card-title primary-title> Actions</v-card-title>
              <v-card-actions class="pa-4 flex-wrap">
                <span v-for="action in getActions" :key="action.text">
                  <v-btn
                    :color="action.color"
                    target="_blank"
                    rel="noopener"
                    :href="action.href"
                    @click="action.onClick($data)"
                    :class="'ma-0 mr-1 mt-1 ' + (!action.href ? 'd-inline-block' : '')"
                  >
                    <v-icon left> {{ action.icon }}</v-icon>
                    <span style="white-space: normal">{{ action.text }}</span>
                  </v-btn>
                </span>
                <v-snackbar elevation="12" v-model="copied" timeout="3000">
                  Adresse copiée !
                  <template v-slot:action="{ attrs }">
                    <v-btn
                      color="info"
                      text
                      v-bind="attrs"
                      @click="copied = false"
                    >
                      Fermer
                    </v-btn>
                  </template>
                </v-snackbar>
              </v-card-actions>
              <v-divider></v-divider>
              <v-card-text>
                <v-col>
                  <v-chip
                    v-for="chip in getChips"
                    :key="chip.text"
                    :color="chip.color"
                    text-color="white"
                    class="ml-1 mt-2 mb-1"
                  >
                    <v-icon left>
                      {{ chip.icon }}
                    </v-icon>
                    {{ chip.text }}
                  </v-chip>
                </v-col>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
import GitHubRepository from "@/components/GitHubRepository.vue";
import PageTitle from "@/components/PageTitle.vue";
import { marked } from "marked";

export default {
  name: "project-view",
  data: () => ({
    loading: true,
    networkError: false,
    notFound: false,
    repository: null,
    copied: false,
  }),
  methods: {
    getRepository: async function () {
      await fetch("https://api.github.com/repos/MAXOUXAX/" + this.projectName)
        .then((response) => {
          if (response.status === 403) throw new Error("Rate limit exceeded");
          return response.json();
        })
        .then((data) => {
          if (data.message === "Not Found") {
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
        })
        .catch((error) => {
          this.networkError = true;
        });
      let mainBranchName;
      await fetch(
        "https://api.github.com/repos/MAXOUXAX/" +
          this.projectName +
          "/branches"
      )
        .then((response) => {
          if (response.status === 403) throw new Error("Rate limit exceeded");
          return response.json();
        })
        .then((data) => {
          return data.filter((branch) => {
            if (branch.name === "master" || branch.name === "main") {
              mainBranchName = branch.name;
            }
          });
        })
        .catch((error) => {
          this.networkError = true;
        });
      await fetch(
        "https://api.github.com/repos/MAXOUXAX/" +
          this.repository.name +
          "/branches/" +
          mainBranchName
      )
        .then((response) => {
          if (response.status === 403) throw new Error("Rate limit exceeded");
          return response.json();
        })
        .then((data) => {
          this.repository.lastCommit = data.commit.commit.author.date;
        })
        .catch((error) => {
          this.networkError = true;
        });
      this.repository.readme = await fetch(
        "https://raw.githubusercontent.com/MAXOUXAX/" +
          this.projectName +
          "/" +
          mainBranchName +
          "/README.md"
      )
        .then((response) => {
          if (response.status === 403) throw new Error("Rate limit exceeded");
          return response.text();
        })
        .catch((error) => {
          this.networkError = true;
          return "";
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
    getChips() {
      if (this.repository == null) {
        return [];
      }

      let date = new Date(this.repository.pushed);
      let repositoryHealthColor;
      let latestCommitTimeDeltaInDays =
        (new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
      if (latestCommitTimeDeltaInDays < 30) {
        repositoryHealthColor = "success";
      } else if (latestCommitTimeDeltaInDays < 90) {
        repositoryHealthColor = "info";
      } else if (latestCommitTimeDeltaInDays < 180) {
        repositoryHealthColor = "warning";
      } else {
        repositoryHealthColor = "error";
      }
      return [
        {
          text: this.repository.stars,
          icon: "mdi-star",
          color: "primary",
        },
        {
          text: date.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
          }),
          icon: "mdi-update",
          color: repositoryHealthColor,
        },
        {
          text: this.repository.language,
          icon: "mdi-language",
          color: "secondary",
        },
        {
          text: this.repository.license
            ? this.repository.license.name
            : "Aucune licence",
          icon: "mdi-license",
          color: "secondary",
        },
      ];
    },
    getActions() {
      if (this.repository == null) {
        return [];
      }

      return [
        {
          text: "Voir sur GitHub",
          icon: "mdi-github",
          color: "primary",
          href: this.repository.url,
          onClick() {
            //TODO: Double check that
          },
        },
        {
          text: "Clone (SSH)",
          icon: "mdi-powershell",
          color: "accent",
          href: null,
          onClick(data) {
            navigator.clipboard.writeText(
              "git@github.com:MAXOUXAX/" + data.repository.name + ".git"
            );
            data.copied = true;
          },
        },
        {
          text: "Clone (HTTPS)",
          icon: "mdi-lock",
          color: "accent",
          href: null,
          onClick(data) {
            navigator.clipboard.writeText(data.repository.url + ".git");
            data.copied = true;
          },
        },
      ];
    },
    compileMarkdown() {
      if (this.repository == null) {
        return "";
      }

      return marked(this.repository.readme);
    },
  },
  props: {
    projectName: String,
  },
  components: {
    PageTitle,
    GitHubRepository,
  },
};
</script>

<style scoped>
.project-view {
  width: 100%;
}

.project {
  width: 100%;
}
.v-btn__content::deep{
  height: 100%;
}
</style>