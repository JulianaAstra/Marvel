import MarvelService from '../../services/MarvelService';
import { Component } from 'react';
import ErrorMessage from '../errorMessage/errorMessage';
import Spinner from '../spinner/spinner';
import './charList.scss';

class CharList extends Component {

	state = {
		charList: [],
		loading: true,
		error: false
	};

	marvelService = new MarvelService();

	componentDidMount() {
		this.marvelService
			.getAllCharacters()
			.then(this.onCharListLoaded)
			.catch(this.onError);
	}

	onCharListLoaded = (charList) => {
		this.setState({
			charList,
			loading: false
		});
	};

	onError = () => {
		this.setState({
			error: true,
			loading: false
		});
	};

	renderItems(arr) {
		const notFoundImg = 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg';
		const isNotFoundImg = (thumbnail) => {
			if (thumbnail === notFoundImg) {
				return {'objectFit' : 'unset'};
			}
			return {'objectFit' : 'cover'};
		};

		const characters = arr.map((char) =>
			<li key={char.id}
				className="char__item"
				onClick={() => this.props.onCharSelected(char.id)}>
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

		const {charList, loading, error} = this.state;
		const characters = this.renderItems(charList);
		const errorMessage = error ? <ErrorMessage/> : null;
		const spinner = loading ? <Spinner/> : null;
		const content = !(loading || error) ? characters : null;

		return (
			<div className="char__list">
				{errorMessage}
				{spinner}
				{content}
				<button className="button button__main button__long">
					<div className="inner">load more</div>
				</button>
			</div>
		);
	}
}

export default CharList;
