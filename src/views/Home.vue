<template>
  <div class="home">
    <div class="about">
      <h1>MAXOUXAX</h1>
      <h2>Étudiant en première année</h2>
      <h3>BUT Informatique</h3>
    </div>
    <div class="buttons">
      <router-link to="/projects">
        <v-btn x-large color="blue" dark>
          <v-icon left> mdi-bookshelf </v-icon>
          Projets
        </v-btn>
      </router-link>
      <!--<router-link to="/contact">-->
      <!--  <v-btn outlined x-large color="blue" dark>-->
      <!--    <v-icon left> mdi-email </v-icon>-->
      <!--    Contact-->
      <!--  </v-btn>-->
      <!--</router-link>-->
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