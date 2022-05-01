export async function onRequestGet(context) {
	let url = new URL(context.request.url);
	let { searchParams } = url;
	if (searchParams.has("search")) {
		let search = searchParams.get("search");
		let info = await getInfo(search);
		if (info == null) {
			return new Response("No result", { status: 404 });
		}
		return new Response(JSON.stringify(info), { headers: { "Content-Type": "application/json" }, status: 200 });
	} else {
		return new Response("Invalid request", { status: 400 });
	}
}
async function getInfo(search) {
	let item = await fetch(
		"https://annuaire-web.univ-lorraine.fr/rest/ldapsearch?valeur=" +
		search +
		"&selectedid=&filtervalue=null&withvac=undefined",
		{
			referrer: "https://annuaire-web.univ-lorraine.fr/",
			referrerPolicy: "strict-origin-when-cross-origin",
			body: null,
			method: "GET",
			mode: "cors",
			credentials: "include",
		})
		.then(response => response.json())
		.then(data => {
			return data.items[0];
		});
	let image = await fetch("https://annuaire-web.univ-lorraine.fr/rest/getphoto?valeur=" + item.empid, {
		"referrer": "https://annuaire-web.univ-lorraine.fr/",
		"referrerPolicy": "strict-origin-when-cross-origin",
		"body": null,
		"method": "GET",
		"mode": "cors",
		"credentials": "include"
	}).then(response => response.json()).then(data => data.url);
	item.image = image;
	return item;
}
