<template>
    <v-container>
        <v-row :ref="'row' + i" v-for="i in 8" :key="i">
            <v-col :ref="'letter' + i" class="pa-0" v-for="i in 8" :key="i">
                <motus-letter></motus-letter>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import MotusLetter from '../components/MotusLetter.vue'

export default {
    name: 'Motus',
    data: {
        cursor: MotusLetter
    },
    components: {
        'motus-letter': MotusLetter
    },
    mounted(){
        this.cursor = this.$refs.letter1;
    }
}

function validateRow() {
    console.log("TODO: Validate row");
}

document.addEventListener("keydown", (e) => {
    if(e.key = 'enter'){
        validateRow();
    }else{
        this.cursor.setLetter(e.key);
    }
});

</script>

<style scoped>
.col{
    border: 0.5px solid white;
    width: 64px;
    height: 64px;
}
</style>