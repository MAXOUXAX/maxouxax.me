<template>
	<v-container class="d-flex justify-center align-center flex-column">
		<h1>Motus</h1>
		<h2 class="text-caption my-0">Le jeu</h2>
		<v-divider width="20%" class="my-6"></v-divider>
		<div class="motus-grid" @click="openKeyboard">
			<v-row v-for="i in 6" :key="i" class="my-0 mx-0">
				<v-col class="pa-0" :width="widthClass()" v-for="l in motusWord.word.length" :key="l">
					<motus-letter :ref="'row' + i"></motus-letter>
				</v-col>
			</v-row>
		</div>
		<input hidden type="text" ref="fakeTextInput">
	</v-container>
</template>

<script>
import MotusLetter from "../components/MotusLetter.vue";

export default {
	name: "Motus",
	data() {
		return {
			cursor: Number,
			currentRow: Number,
			motusWord: {
				word: "",
				letterCount: {},
				letterCountClone: {},
				contains: function(letter) {
					return this.letterCountClone[letter] > 0;
				},
				setWord: function(word){
					this.word = word;
					this.letterCount = word.split('').reduce((total, letter) => {
  						total[letter] ? total[letter]++ : total[letter] = 1;
  						return total;
  					}, {});
					this.letterCountClone = Object.assign({}, this.letterCount);
				},
				getWord: function(){
					return word;
				},
				removeLetter: function(letter){
					if(this.letterCountClone[letter]){
						this.letterCountClone[letter]--;
					}
				},
				resetLetterCount: function(){
					this.letterCountClone = this.letterCount;
				},
			},
			partyOngoing: Boolean,
		};
	},
	components: {
		"motus-letter": MotusLetter,
	},
	mounted() {
		this.startGame();
		this.$nextTick(() => {
			this.moveRow(1);
		});
		document.addEventListener("keydown", (e) => {
			e.stopPropagation();
			let key = e.key;
			if (key == "Enter") {
				this.validateRow();
			}else if(key == "Backspace"){
				this.moveCursor(-1);
				this.writeToCurrentCursor(".");
			} else if(/^[A-Z]$/.test(key.toUpperCase())) {
				this.writeToCurrentCursor(key);
				this.moveCursor(1);
			}
		});
	},
	methods: {
		startGame: function(){
			this.motusWord.setWord("maxouxax");
			this.partyOngoing = true;
		},
		moveRow: function(row){
			this.cursor = 0;
			this.currentRow = row;
			this.$refs["row" + this.currentRow].forEach(row => {
				row.setCurrentRow(true);
			});
		},
		moveCursor: function(direction){
			let newCursor = this.cursor + direction;
			if(newCursor < 0){
				newCursor = 0;
			}
			if(newCursor > this.motusWord.word.length){
				newCursor = this.motusWord.word.length;
			}
			this.cursor = newCursor;
		},
		validateRow: async function(){
			if(this.cursor < this.motusWord.word.length)return;
			this.partyOngoing = false;
			let animation = [];
			this.$refs["row" + this.currentRow].forEach((motusLetter, i) => {
				animation.push(new Promise(resolve => {
					setTimeout(() => {
						let letter = motusLetter.getLetter().toLowerCase();
						if(this.motusWord.word[i] == letter){
            			    motusLetter.setWellPlaced(true);
            			}else if(this.motusWord.contains(letter)){
            			    motusLetter.setWronglyPlaced(true);
							this.partyOngoing = true;
            			}
						this.motusWord.removeLetter(letter);
						resolve();
					}, i * 250);
				}))
			});
			await Promise.all(animation);
			if(this.partyOngoing){
				this.moveRow(this.currentRow + 1);
				this.motusWord.resetLetterCount();
			}
		},
		writeToCurrentCursor: function(letter){
			if(this.cursor >= this.motusWord.word.length)return;
			let motusLetter = this.$refs["row" + this.currentRow][this.cursor];
			if(!motusLetter.currentRow){
				motusLetter.setCurrentRow(true);
			}
			motusLetter.setLetter(letter);
		},
		openKeyboard: function(){
			this.$refs.fakeTextInput.focus();
		},
		widthClass: function(){
			switch (this.$vuetify.breakpoint.name) {
                case 'xs': return "80vw"
                default: return "374px"
            }
		}
	}
};
</script>

<style scoped>
.col {
	border: 0.5px solid white;
	width: 96px;
	height: 96px;
	flex-basis: initial !important;
	flex-grow: initial !important;
}
@media screen and (max-width: 960px) {
	.col {
		width: 10vw;
		height: 10vw;
	}
}
</style>