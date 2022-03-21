<template>
    <div class="projects my-6">
        <page-title class="mb-16">Projets</page-title>
        <div class="network-error" v-if="networkError">
            <v-alert
               border="left"
               icon="mdi-alert-circle"
               transition="slide-y-transition"
               elevation="4"
               type="error"
               :width="vAlertWidth"
               >
                Une erreur est survenue lors du chargement des projets. Veuillez vérifier votre connexion Internet ou réessayer plus tard.        
            </v-alert>
        </div>
        <div v-if="loading">
            <v-row
                align="center"
                justify="center"
            >
                <v-sheet
                    :width="vSkeletonWidth"
                    v-for="index in 10"
                    :key="index"
                    class="mx-5 my-4"
                >
                    <v-skeleton-loader
                        width="100%"
                        type="card"
                    ></v-skeleton-loader>
                </v-sheet>
            </v-row>
        </div>
        <div v-if="!loading" class="repository">
            <v-row
                align="center"
                justify="center"
                class="mx-0"
            >
                <github-repository v-for="repo in repos" :repository="repo" :key="repo.name"></github-repository>
            </v-row>
        </div>
    </div>
</template>

<script>
import GitHubRepository from '@/components/GitHubRepository.vue'
import PageTitle from '@/components/PageTitle.vue';

export default {
    data() {
        return {
            repos: [],
            transitionName: 'slide',
            loading: true,
            networkError: false,
        }
    },
    computed: {
        vSkeletonWidth () {
            switch (this.$vuetify.breakpoint.name) {
                case 'xs': return "80vw"
                default: return 374
            }
        },
        vAlertWidth() {
            switch (this.$vuetify.breakpoint.name) {
                case 'xs': return "80vw"
                default: return "520px"
            }
        }
    },
    mounted(){
        fetch('https://api.github.com/users/MAXOUXAX/repos').then(response => response.json()).then(data => {
            data.filter(repo => repo.fork == false)
                .filter(repo => repo.name != "MAXOUXAX")
                .forEach(repo => {
                    this.repos.push({
                        name: repo.name,
                        url: repo.html_url,
                        description: repo.description,
                        language: repo.language,
                        license: repo.license,
                        stars: repo.stargazers_count,
                        archived: repo.archived,
                        pushed: repo.pushed_at
                    });
            });
        }).finally(() => {
            if(this.repos.length == 0){
                this.networkError = true;
            }else{
                this.repos.sort((a, b) => {
                    if(a.archived && !b.archived) return 1;
                    if(!a.archived && b.archived) return -1;
                    if(a.pushed < b.pushed) return 1;
                    if(a.pushed > b.pushed) return -1;
                    return 0;
                });
                this.loading = false;
            }
        });
    },
    components: {
        'github-repository': GitHubRepository,
        PageTitle
    }
}
</script>

<style>
.network-error{
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>