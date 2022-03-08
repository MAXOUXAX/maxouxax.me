const wordList = "https://framagit.org/JonathanMM/sutom/-/raw/main/data/mots.txt";

export async function onRequestPost(request) {
	let words = [];
	let response = {};
	await fetch(wordList, {
		cf: {
			cacheEverything: true,
			cacheTtl: "86400"
		}
	}).then(response => response.text()).then(data => {
		data.slice(0, -1).split("\n").forEach(word => {
			words.push(word);
		});
	});
	words = words.map(word => word.toLowerCase())
		.map(word => word.normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
		.map(word => word.trim());
	if (request.body instanceof FormData) {
		let word = request.body.get("word");
		if (word) {
			response.push({
				valid: words.includes(word) ? true : false,
				word: word
			});
		}else{
			response.push({
				valid: false,
				errorMessage: "No word provided",
				word: ""
			});
		}
	}else{
		response.push({
			valid: false,
			errorMessage: "Body does not match valid type",
			word: ""
		});
	}
	let json = JSON.stringify(response, null, 2);
	return new Response(json, {
		headers: {
			'content-type': 'application/json;charset=UTF-8',
		},
	});
}
