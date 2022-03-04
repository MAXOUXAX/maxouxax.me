<template>
    <v-container>
        <v-row v-for="i in 8" :key="i">
            <v-col width="64px" height="64px" class="pa-0" v-for="i in 8" :key="i">
                <motus-letter></motus-letter>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import MotusLetter from '../components/MotusLetter.vue'

export default {
    name: 'Motus',
    components: {
        'motus-letter': MotusLetter
    }
}

</script>

<style scoped>
.col{
    border: 0.5px solid white;
}
</style>