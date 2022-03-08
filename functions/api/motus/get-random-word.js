export async function onRequestGet(context) {
	let words = [];
	await fetch("https://framagit.org/JonathanMM/sutom/-/raw/main/data/mots.txt").then(response => response.text()).then(data => {
		data.slice(0, -1).split("\n").forEach(word => {
			words.push(word);
		});
	});
	words.map(word => word.toLowerCase())
		.map(word => word.normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
		.map(word => word.trim());
	return new Response(words[Math.floor(Math.random() * words.length)]);
}
