<template>
    <div class="projects">
        <div v-if="loading">
            <v-row
                align="center"
                justify="center"
            >
                <v-skeleton-loader
                    v-for="index in 10"
                    :key="index"
                    class="mx-5 my-4"
                    max-width="300"
                    type="card"
                ></v-skeleton-loader>
            </v-row>
        </div>
        <div v-if="!loading" class="repository">
            <v-row
                align="center"
                justify="center"
            >
                <github-repository v-for="repo in repos" :repository="repo" :key="repo.name">{{ repo }}</github-repository>
            </v-row>
        </div>
    </div>
</template>

<script>
import GitHubRepository from '../components/GitHubRepository.vue'

export default {
    data() {
        return {
            repos: [],
            transitionName: 'slide',
            loading: true
        }
    },
    mounted(){
        fetch('https://api.github.com/users/MAXOUXAX/repos').then(response => response.json()).then(data => {
            data.filter(repo => repo.fork == false).forEach(repo => {
                this.repos.push({
                    name: repo.name,
                    url: repo.html_url,
                    description: repo.description,
                    language: repo.language,
                    license: repo.license,
                    stars: repo.stargazers_count,
                    archived: repo.archived,
                    updated: repo.updated_at
                });
            });
        }).finally(() => {
            if(this.repos.length == 0){
                alert("No repositories found (Network error)");
            }else{
                this.loading = false;
            }
        });
    },
    components: {
        'github-repository': GitHubRepository
    }
}
</script>

<style>

</style>