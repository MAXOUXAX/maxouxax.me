export async function onRequestGet(context) {
	const {
		request,
		env,
		params,
		waitUntil,
		next,
		data,
	} = context;

	let words = [];
	await fetch("https://framagit.org/JonathanMM/sutom/-/raw/main/data/mots.txt").then(response => response.text()).then(data => {
		data.slice(0, -1).split("\n").forEach(word => {
			words.push(word);
		});
	});
	return new Response(words[0]);
}
