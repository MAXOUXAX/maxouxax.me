<template>
	<v-container class="d-flex justify-center align-center flex-column">
		<h1>Motus</h1>
		<h2 class="text-caption my-0">Le jeu</h2>
		<v-divider width="20%" class="my-6"></v-divider>
		<div class="motus-grid">
			<v-row v-for="i in 6" :key="i" class="my-0 mx-0">
				<v-col class="pa-0" v-for="l in word.length" :key="l">
					<motus-letter :ref="'row' + i"></motus-letter>
				</v-col>
			</v-row>
		</div>
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
			word: String,
			partyOngoing: Boolean,
		};
	},
	components: {
		"motus-letter": MotusLetter,
	},
	mounted() {
		this.startGame();
		this.$nextTick(() => {
			console.log("-------------------");
			this.$refs.row1.forEach(element => {
				console.log(element);
			});
			console.log("-------------------");
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
			this.word = "maxouxax";
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
			if(newCursor > this.word.length){
				newCursor = this.word.length;
			}
			this.cursor = newCursor;
		},
		validateRow: async function(){
			if(this.cursor < this.word.length)return;
			this.partyOngoing = false;
			let animation = [];
			this.$refs["row" + this.currentRow].forEach((motusLetter, i) => {
				animation.push(new Promise(resolve => {
					setTimeout(() => {
						if(!motusLetter.validate(this.word[i], this.word))this.partyOngoing = true;
						resolve();
					}, i * 250);
				}))
			});
			await Promise.all(animation);
			if(this.partyOngoing){
				this.moveRow(this.currentRow + 1);
			}
		},
		writeToCurrentCursor: function(letter){
			if(this.cursor >= this.word.length)return;
			let motusLetter = this.$refs["row" + this.currentRow][this.cursor];
			if(!motusLetter.currentRow){
				motusLetter.setCurrentRow(true);
			}
			motusLetter.setLetter(letter);
		}
	}
};

function validateRow() {
	console.log("TODO: Validate row");
}
</script>

<style scoped>
.col {
	border: 0.5px solid white;
	width: 64px;
	height: 64px;
	flex-basis: initial !important;
	flex-grow: initial !important;
}
</style>