<template>
    <v-container>
        <v-row v-for="i in 8" :key="i">
            <v-col v-for="i in 8" :key="i">
                <p>TEST {{ n }} x {{ i }}</p>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: 'Motus'
}
</script>

<style>

</style>