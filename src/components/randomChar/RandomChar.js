import { useState, useEffect } from 'react';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/errorMessage';
import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';
import MarvelService from '../../services/MarvelService';
import { Id } from '../../utils/constants';
import { getRandomNumInRange } from '../../utils/utils';
import PropTypes from 'prop-types';

const RandomChar = () => {

  const [char, setChar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

	const marvelService = new MarvelService();

  useEffect(() => {
    updateChar();
    const timerId = setInterval(updateChar, 60000);
    return () => {
      clearInterval(timerId);
    }
  }, []);

	const updateChar = () => {
		const id = getRandomNumInRange(Id.MAX, Id.MIN);
		onCharLoading();
		marvelService
			.getCharacter(id)
			.then(onCharLoaded)
			.catch(onError); // аргумент автоматически подставляется в .then
	};

	const onError = () => {
    setLoading(false);
    setError(true);
	};

	const onCharLoaded = (char) => {
    setChar(char);
    setLoading(false);
    setError(false);
	};

	const onCharLoading = () => {
    setLoading(true);
	};

		const errorMessage = error ? <ErrorMessage /> : null;
		const spinner = loading ? <Spinner /> : null;
		const content = !(loading || error) ? <View char={char} /> : null;

		return (
			<div className="randomchar">
				{errorMessage}
				{spinner}
				{content}
				<div className="randomchar__static">
					<p className="randomchar__title">
                      Random character for today!<br/>
                      Do you want to get to know him better?
					</p>
					<p className="randomchar__title">
                      Or choose another one
					</p>
					<button className="button button__main">
						<div className="inner" onClick={updateChar}>try it</div>
					</button>
					<img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
				</div>
			</div>
		);

}

const View = ({char}) => {
	const {name, description, thumbnail, homepage, wiki} = char;
	let imgStyle = {'objectFit' : 'cover'};
	if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
		imgStyle = {'objectFit' : 'contain'};
	}

	return (
		<div className="randomchar__block">
			<img src={thumbnail} alt="Random character" className="randomchar__img" style={imgStyle}/>
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
	);
};

View.propTypes = {
	char: PropTypes.object
};

export default RandomChar;
