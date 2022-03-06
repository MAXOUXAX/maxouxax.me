<template>
    <div class="motus-letter">
        <span class="white--text">{{ currentRow ? letter : ''}}</span>
        <div v-if="wellPlaced" class="red-square abs"></div>
        <div v-if="wronglyPlaced" class="yellow-circle abs"></div>
        <div class="background abs"></div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            letter: ".",
            currentRow: false,
            wellPlaced: false,
            wronglyPlaced: false
        }
    },
    name: 'MotusLetter',
    methods: {
        setCurrentRow: function(currentRow){
            this.currentRow = currentRow;
        },
        getLetter: function(){
            return this.letter;
        },
        setLetter: function(letter){
            this.letter = letter;
        },
        setWellPlaced: function(wellPlaced){
            this.wellPlaced = wellPlaced;
        },
        setWronglyPlaced: function(wronglyPlaced){
            this.wronglyPlaced = wronglyPlaced;
        },
    }
}
</script>

<style scoped>
.abs{
    position: absolute;
    top: 0;
    left: 0;
}
.motus-letter{
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
    width: 100%;
    height: 100%;
    user-select: none;
}
.motus-letter .background{
    width: 100%;
    height: 100%;
    z-index: 1;
    background-color: #0077c7;
    z-index: 1;
}
.motus-letter span{
    text-transform: uppercase;
    font-size: 5rem;
    z-index: 3;
}
@media screen and (max-width: 960px) {
	.motus-letter span {
		font-size: 8vw;
	}
}
.motus-letter .red-square{
    width: 100%;
    height: 100%;
    z-index: 2;
    background-color: #e7002a;
}
.motus-letter .yellow-circle{
    width: 100%;
    height: 100%;
    border-radius: 50%;
    z-index: 2;
    background-color: #ffbd00;
}
</style>