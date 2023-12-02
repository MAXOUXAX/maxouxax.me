<template>
  <div class="home">
    <div class="about">
      <h1>MAXOUXAX</h1>
      <h2>Étudiant en troisième année</h2>
      <h3>BUT Informatique</h3>
    </div>
    <div class="buttons">
      <v-btn x-large color="primary" to="/projects">
        <v-icon left> mdi-bookshelf </v-icon>
        Projets
      </v-btn>
      <!--<v-btn outlined x-large color="secondary" to="/motus">
        <v-icon left> mdi-google-controller </v-icon>
        Jouer à Motus
      </v-btn>
      -->
    </div>
    <div class="announcement pa-6">
      <iframe
        width="100%"
        height="150"
        :src="
          'https://odesli.co/embed/?url=https%3A%2F%2Fsong.link%2Fmaxouxax-mess&theme=' +
          (this.$store.state.theme ? 'dark' : 'light')
        "
        frameborder="0"
        allowfullscreen
        sandbox="allow-same-origin allow-scripts allow-presentation allow-popups allow-popups-to-escape-sandbox"
        allow="clipboard-read; clipboard-write"
      ></iframe>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
};
</script>

<style scoped>
.home {
  width: 100%;
  min-height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
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
.announcement {
  width: 100%;
  max-width: 680px;
  display: flex;
  justify-content: center;
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