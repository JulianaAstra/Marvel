import { DESCRIPTION_MAX_LENGTH } from '../utils/constants';
import { useHttp } from '../hooks/http.hook';

const  useMarvelService = () => {
  const {loading, request, error} = useHttp();

	const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
	const _apiKey = 'apikey=8c6835281072553d27512c94876408b1';
	const _limit = 9;
	const _baseOffset = 210;

	// getResource = async (url) => {
	// 	let res = await fetch(url);

	// 	if (!res.ok) {
	// 		throw new Error(`Could not fetch ${url}, status: ${res.status}`);
	// 	}

	// 	return await res.json();
	// };

	const getAllCharacters = async (offset = _baseOffset) => {
		const res = await request(`${_apiBase}characters?limit=${_limit}&offset=${offset}&${_apiKey}`);
		return res.data.results.map(_transformCharacter);
	};

	const getCharacter = async (id) => {
		const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
		return _transformCharacter(res.data.results[0]);
	};

	const _transformCharacter = (char) => {
		return {
			id: char.id,
			name: (char.name.length > 22) ? `${char.name.slice(0, 22)}...` : char.name,
			description: char.description ?
				`${char.description.slice(0, DESCRIPTION_MAX_LENGTH)}...` :
				'There is no description for this character',
			thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
			homepage: char.urls[0].url,
			wiki: char.urls[1].url,
			comics: char.comics.items
		};
	};

  return {loading, error, getAllCharacters, getCharacter}
}

export default useMarvelService;
