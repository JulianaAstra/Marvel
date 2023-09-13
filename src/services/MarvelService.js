class MarvelService {
	getResource = async (url) => {
		let res = await fetch(url);

		if (!res.ok) {
			throw new Error(`Could not fetch ${url}, status: ${res.status}`);
		}

		return await res.json();
	};

	getAllCharacters = () => {
		return this.getResource('https://gateway.marvel.com:443/v1/public/characters?apikey=8c6835281072553d27512c94876408b1');
	};
}

export default MarvelService;
