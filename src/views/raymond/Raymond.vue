<template>
  <div class="raymond">
    <h1 class="mb-16">Raymond</h1>
    <transition
        name="slide-x-reverse-transition"
        mode="out-in"
        appear
    >
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: "Raymond",
}
</script>

<style scoped>
.raymond {
  width: 100%;
  height: 100%;
}
</style>