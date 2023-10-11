import MarvelService from '../../services/MarvelService';
import { Component } from 'react';
import ErrorMessage from '../errorMessage/errorMessage';
import Spinner from '../spinner/spinner';
import './charList.scss';
import PropTypes from 'prop-types';
class CharList extends Component {

	state = {
		charList: [],
		loading: true,
		error: false,
		newItemLoading: false,
		offset: 210,
		charEnded: false
	};

	marvelService = new MarvelService();

	componentDidMount() {
		this.onRequest();
	}

	componentWillUnmount() {

	}

	onRequest = (offset) => {
		this.onCharListLoading();
		this.marvelService.getAllCharacters(offset)
			.then(this.onCharListLoaded) // аргумент (результат запроса) автоматически подставляется в .then
			.catch(this.onError);
	};

	onCharListLoading = () => {
		this.setState({
			newItemLoading: true
		});
	};

	onCharListLoaded = (newCharList) => {
		let ended = false;
		if (newCharList.length < 9) {
			ended = true;
		}

		this.setState(({offset, charList}) => ({
			charList: [...charList, ...newCharList],
			loading: false,
			newItemLoading: false,
			offset: offset + 9,
			charEnded: ended
		}));
	};

	onError = () => {
		this.setState({
			error: true,
			loading: false
		});
	};

	itemRefs = [];

	setRef = (ref) => {
		this.itemRefs.push(ref);
	};

	focusOnItem = (id) => {
		this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
		this.itemRefs[id].classList.add('char__item_selected');
		this.itemRefs[id].focus();
	};

	renderItems(arr) {
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
				ref={this.setRef}
				onClick={() => {
					this.props.onCharSelected(char.id);
					this.focusOnItem(i);
				}}
				onKeyDown={(e) => {
					if (e.key === ' ' || e.key === 'Enter') {
						e.preventDefault();
						this.props.onCharSelected(char.id);
						this.focusOnItem(i);
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

	render() {

		const {charList, loading, error, offset, newItemLoading, charEnded} = this.state;

		const characters = this.renderItems(charList);

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
					onClick={() => this.onRequest(offset)}>
					<div className="inner">load more</div>
				</button>
			</div>
		);
	}
}

CharList.propTypes = {
	onCharSelected: PropTypes.func.isRequired
};

export default CharList;
