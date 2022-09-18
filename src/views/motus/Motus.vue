<template>
  <v-container class="d-flex align-center flex-column mt-8">
    <h1>Motus</h1>
    <v-divider width="20%" class="my-6"></v-divider>
    <transition name="fab-transition" mode="out-in">
      <router-view></router-view>
    </transition>
  </v-container>
</template>

<script>
export default{
  name: 'Motus',
}
</script>