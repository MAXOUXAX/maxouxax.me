<template>
  <v-card-text class="text--primary text-center">
  	<h1 class="page-title"><slot></slot></h1>
  </v-card-text>
</template>

<script>
export default {
	name: 'page-title',
}
</script>

<style scoped>
.page-title{
  transition: 0.3s cubic-bezier(0.86, 0, 0.07, 1);
}
div .v-card__text {
  font-size: 4vw !important;
}
.page-title:hover {
  transform: scale(0.95, 0.95);
}
@media screen and (min-width: 1000px) {
  .page-title {
    font-size: 4rem;
  }
}
</style>