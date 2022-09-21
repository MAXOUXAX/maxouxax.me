<template>
  <div class="home">
    <div class="home-welcome">
      <img class="hero-glow" src="../assets/hero-glow.svg" alt="hero glow">
      <div class="about">
        <h1 class="font-weight-regular">Hey, moi c'est <span class="font-weight-bold">MAXOUXAX</span> 👋</h1>
        <h2 class="px-16">Étudiant en deuxième année de BUT Informatique</h2>
      </div>
      <div class="buttons">
        <v-btn x-large rounded color="primary" to="/projects">
          <v-icon left> mdi-bookshelf </v-icon>
          Projets
        </v-btn>
        <v-btn outlined x-large rounded color="secondary" to="/motus">
          <v-icon left> mdi-google-controller </v-icon>
          Jouer à Motus
        </v-btn>
      </div>
      <svg :class="'wave ' + (this.$vuetify.theme.isDark ? 'dark' : 'light')" viewBox="0 0 900 50"
        preserveAspectRatio="none" width="900" height="50" xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
        <path
          d="M0 41L50 37.2C100 33.3 200 25.7 300 21.5C400 17.3 500 16.7 600 19.3C700 22 800 28 850 31L900 34L900 51L850 51C800 51 700 51 600 51C500 51 400 51 300 51C200 51 100 51 50 51L0 51Z"
          fill="#121212" stroke-linecap="round" stroke-linejoin="miter"></path>
      </svg>
    </div>
    <div class="projects d-flex flex-column align-center">
      <img class="project-blob" src="../assets/projects/hero-projects.svg" alt="hero background">
      <h3 class="font-weight-bold text-center text-h3 mt-6 mb-12">Mes projets</h3>
      <div class="recent-projects">
        <v-row justify="center" class="mx-0 align-start align-stretch" no-gutters>
          <v-card v-for="project in projects" :key="project.name"
            class="project d-flex flex-grow-1 flex-shrink-1 flex-column ma-4" outlined :width="vCardWidth" elevation="10">
            <v-img :src="project.image" max-height="200"></v-img>
            <v-card-title class="font-weight-bold">{{ project.name }}</v-card-title>
            <v-card-text class="flex-grow-1">{{ project.description }}</v-card-text>
            <v-card-actions>
              <v-btn text small color="primary" :href="project.link" target="_blank">
                <v-icon left> mdi-link </v-icon>
                Voir le projet
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-row>
      </div>
      <v-btn class="my-6" to="/projects" color="secondary" outlined rounded text large>
        Voir tous les projets <v-icon right>mdi-arrow-right </v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: "Home",
  data() {
    return {
      projects: [
        {
          name: 'KorusMC',
          description: 'Serveur Minecraft orienté PVP entièrement développé par un ami et moi-même, en Java, et utilisant des technologies comme Velocity, Paper, MariaDB et Redis.',
          image: require("../assets/projects/korusmc.png"),
          link: "https://korusmc.fr"
        },
        {
          name: 'Supervisor',
          description: 'Supervisor est un programme consistant à faire fonctionner des BOTs Discord à la manière des plugins de Paper pour Minecraft. Il est développé en Java, est lourdement inspiré du système de plugins Minecraft et utilise notamment JDA, MariaDB et MongoDB.',
          image: require("../assets/projects/supervisor.png"),
          link: "https://github.com/MAXOUXAX/Supervisor"
        },
        {
          name: 'Raymond',
          description: 'Raymond est un BOT Discord développé en Java et fonctionnant en tant que plugin de Supervisor. Il est utilisé pour les serveurs Discord de ma promotion de BUT Informatique, et permet de récupérer les cours pour une journée précise, détecter les changements dans l\'emploi du temps, ou encore notifier lorsque des devoirs sont à rendre.',
          image: require("../assets/projects/raymond.png"),
          link: "https://github.com/MAXOUXAX/Raymond"
        },
        {
          name: 'maxouxax.me',
          description: 'Ce site web est mon portfolio, il est développé en utilisant VueJS et utilise le framework Vuetify. Il est hébergé sur l\'infrastructure Cloudflare Pages, et utilise des technologies comme Cloudflare Workers, Cloudflare Pages Functions',
          image: require("../assets/projects/maxouxax.me.png"),
          link: "https://github.com/MAXOUXAX/maxouxax.me"
        },
      ],
    };
  },
  computed: {
    ...mapGetters([
      'vCardWidth'
    ]),
  }
};
</script>

<style scoped lang="scss">
.home {
  width: 100%;
  min-height: 100%;
}

.home-welcome {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
  min-height: 90vh;
  overflow: hidden;
  background: linear-gradient(270deg, hsl(240, 57%, 3%), hsl(339, 57%, 3%), hsl(240, 100%, 3%));
  background-size: 400% 400%;
  color: white;
  animation: home-background 30s infinite alternate;
  flex: 1;

  .wave {
    width: 100%;
    height: 50px;
    position: absolute;
    object-fit: fill;
    object-position: bottom;
    bottom: 0;

    &.dark path {
      fill: #121212;
    }

    &.light path {
      fill: #fff;
    }
  }
}

.project {
  border-radius: 25px;
}

.home *:not(.hero-glow) {
  z-index: 2;
}

@keyframes home-background {
  0% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

.hero-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200%;
  transform: translate(-50%, -50%);
  border-style: none;
  z-index: 1;
  pointer-events: none;
  user-select: none;
  animation: hero-appear 5s backwards, hero-blur 30s 5s alternate infinite, hero-transform 120s 5s alternate infinite;
}

.projects {
  position: relative;
  overflow: hidden;

  .project-blob {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    transform: translate(-50%, -50%);
    border-style: none;
    z-index: 1;
    pointer-events: none;
    object-fit: fill;
    user-select: none;
  }
}

@keyframes hero-appear {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes hero-blur {
  0% {
    filter: blur(0px);
  }

  100% {
    filter: blur(20vw);
  }
}

@keyframes hero-transform {
  0% {
    transform: translate(-50%, -50%) rotate(0deg) translateX(0px);
  }

  100% {
    transform: translate(-50%, -50%) rotate(360deg) translateX(-900px);
  }
}

.about {
  text-align: center;
}

.buttons {
  margin: 35px;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
}

@media screen and (min-width: 800px) {
  .buttons {
    flex-direction: row;
  }
}

.buttons a {
  margin: 5px;
}

.about h1 {
  font-size: 3rem;
  font-weight: 900;
}

.about h2 {
  font-size: 1.6rem;
  font-weight: 400;
}

.about h3 {
  font-size: 1rem;
  font-weight: 200;
}
</style>