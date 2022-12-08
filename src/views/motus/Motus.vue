<template>
  <v-container class="d-flex align-center flex-column mt-8">
    <page-title>Motus</page-title>
    <v-divider width="20%" class="my-6"></v-divider>
    <transition name="fab-transition" mode="out-in">
      <router-view></router-view>
    </transition>
  </v-container>
</template>

<script>
import PageTitle from "@/components/PageTitle";

export default{
  name: 'Motus',
  components: {
    PageTitle
  }
}
</script>