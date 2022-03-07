export async function onRequestPost(request) {
	let words = [];
	await fetch("https://framagit.org/JonathanMM/sutom/-/raw/main/data/mots.txt").then(response => response.text()).then(data => {
		data.slice(0, -1).split("\n").forEach(word => {
			words.push(word);
		});
	});
	//check if the words array contains request.
	words.forEach(word => {
		if (word === request.body) {
			return new Response(true);
		}
	});
	return new Response(false);
}
