<template>
  <div class="raymond-teacher d-flex justify-center align-center flex-column">
    <h2 class="mb-16">Professeur</h2>
    <div class="d-flex justify-center align-center mx-10">
      <raymond-teacher-search></raymond-teacher-search>
    </div>
    <transition name="slide-x-reverse-transition" mode="out-in" appear>
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import RaymondTeacherSearch from "@/components/raymond/RaymondTeacherSearch";

export default {
  name: 'RaymondTeacher',
  components: { RaymondTeacherSearch },
}
</script>