import MarvelService from '../../services/MarvelService';
import { useState, useRef, useEffect } from 'react';
import ErrorMessage from '../errorMessage/errorMessage';
import Spinner from '../spinner/spinner';
import './charList.scss';
import PropTypes from 'prop-types';
const CharList = (props) => {

  const [charList, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(210);
  const [charEnded, setCharEnded] = useState(false);

	const marvelService = new MarvelService();

  useEffect(() => {
    onRequest();
  }, []);

	const onRequest = (offset) => {
		onCharListLoading();
		marvelService.getAllCharacters(offset)
			.then(onCharListLoaded) // аргумент (результат запроса) автоматически подставляется в .then
			.catch(onError);
	};

	const onCharListLoading = () => {
		setNewItemLoading(true);
	};

	const onCharListLoaded = (newCharList) => {
		let ended = false;
		if (newCharList.length < 9) {
			ended = true;
		}

    setList(charList => [...charList, ...newCharList]);
    setLoading(false);
    setNewItemLoading(newItemLoading => false);
    setOffset(offset => offset + 9);
    setCharEnded(charEnded => ended);
	};

	const onError = () => {
    setError(true);
    setLoading(false);
	};

	const itemRefs = useRef([]);

	const focusOnItem = (id) => {
		itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
		itemRefs.current[id].classList.add('char__item_selected');
		itemRefs.current[id].focus();
	};

	function renderItems(arr) {
		const notFoundImg = 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg';
		const isNotFoundImg = (thumbnail) => {
			if (thumbnail === notFoundImg) {
				return {'objectFit' : 'unset'};
			}
			return {'objectFit' : 'cover'};
		};

		const characters = arr.map((char, i) =>
			<li key={char.id}
				className="char__item"
				tabIndex={0}
				ref={el => itemRefs.current[i] = el}
				onClick={() => {
					props.onCharSelected(char.id);
					focusOnItem(i);
				}}
				onKeyDown={(e) => {
					if (e.key === ' ' || e.key === 'Enter') {
						e.preventDefault();
						props.onCharSelected(char.id);
						focusOnItem(i);
					}
				}}>
				<img src={char.thumbnail}
					alt={char.name}
					style={isNotFoundImg(char.thumbnail)}/>
				<div className="char__name">{char.name}</div>
			</li>);

		return (
			<ul className="char__grid">
				{characters}
			</ul>
		);
	}

		const characters = renderItems(charList);

		const errorMessage = error ? <ErrorMessage/> : null;
		const spinner = loading ? <Spinner/> : null;
		const content = !(loading || error) ? characters : null;

		return (
			<div className="char__list">
				{errorMessage}
				{spinner}
				{content}
				<button
					className="button button__main button__long"
					disabled={newItemLoading}
					style={{'display': charEnded ? 'none' : 'block'}}
					onClick={() => onRequest(offset)}>
					<div className="inner">load more</div>
				</button>
			</div>
		);
}

CharList.propTypes = {
	onCharSelected: PropTypes.func.isRequired
};

export default CharList;
