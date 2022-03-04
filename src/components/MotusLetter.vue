<template>
    <div class="motus-letter">
        <span>{{ letter ? letter : '.' }}</span>
        <div v-if="wellPlaced" class="red-square"></div>
        <div v-if="wronglyPlaced" class="yellow-circle"></div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            letter: ".",
            wellPlaced: false,
            wronglyPlaced: false
        }
    },
    name: 'MotusLetter'
}
</script>

<style scoped>
.motus-letter{
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
}
.motus-letter span{
    font-size: 4rem;
    z-index: 2;
}
.motus-letter .red-square{
    width: 100%;
    height: 100%;
    z-index: 1;
    background-color: red;
}
.motus-letter .yellow-circle{
    width: 100%;
    height: 100%;
    border-radius: 50%;
    z-index: 1;
    background-color: yellow;
}
</style>