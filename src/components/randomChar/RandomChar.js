import { Component } from 'react';
import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';
import MarvelService from '../../services/MarvelService';
import { Id } from '../../utils/constants';
import { getRandomNumInRange } from '../../utils/utils';
// import { getRandomIndexFromArray, getCharacter } from '../../utils/utils';
class RandomChar extends Component {
	constructor(props) {
		super(props);
		this.updateChar(); // так делать не правильно!
	}

	state = {
		char: {}
	};

	marvelService = new MarvelService();

	updateChar = () => {
		// this.marvelService
		// 	.getAllCharacters()
		// 	.then(res => {
		// 		const array = res;
		// 		const number = getRandomIndexFromArray(array);
		// 		const character = getCharacter(array, number);
		// 		const {name, description, thumbnail, homepage, wiki} = character;

		// 		this.setState({
		// 			name: name,
		// 			description: description,
		// 			thumbnail: thumbnail,
		// 			homepage: homepage,
		// 			wiki: wiki
		// 		});
		// 	});


		/* вариант из урока*/

		const id = getRandomNumInRange(Id.MAX, Id.MIN);
		this.marvelService
			.getCharacter(id)
			.then(this.onCharLoaded); // аргумент автоматически подставляется в .then
	};

	onCharLoaded = (char) => {
		this.setState({char});
	};

	render() {
		const {char: {name, description, thumbnail, homepage, wiki}} = this.state;

		return (
			<div className="randomchar">
				<div className="randomchar__block">
					<img src={thumbnail} alt="Random character" className="randomchar__img"/>
					<div className="randomchar__info">
						<p className="randomchar__name">{name}</p>
						<p className="randomchar__descr">
							{description}
						</p>
						<div className="randomchar__btns">
							<a href={homepage} className="button button__main">
								<div className="inner">homepage</div>
							</a>
							<a href={wiki} className="button button__secondary">
								<div className="inner">Wiki</div>
							</a>
						</div>
					</div>
				</div>
				<div className="randomchar__static">
					<p className="randomchar__title">
                      Random character for today!<br/>
                      Do you want to get to know him better?
					</p>
					<p className="randomchar__title">
                      Or choose another one
					</p>
					<button className="button button__main">
						<div className="inner">try it</div>
					</button>
					<img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
				</div>
			</div>
		);
	}
}

export default RandomChar;
