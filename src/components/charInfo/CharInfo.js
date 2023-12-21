import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/errorMessage';
import Skeleton from '../skeleton/Skeleton';
import './charInfo.scss';

const CharInfo = (props) => {

  const [char, setChar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

	const marvelService = new MarvelService();

  useEffect(() => {
    updateChar();
  }, [props.charId]);

	const updateChar = () => {
		const {charId} = props;
		if (!charId) {
			return;
		}

		onCharLoading();
		marvelService
			.getCharacter(charId)
			.then(onCharLoaded)
			.catch(onError);
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

		const skeleton = char || loading || error ? null : <Skeleton />;
		const errorMessage = error ? <ErrorMessage /> : null;
		const spinner = loading ? <Spinner /> : null;
		const content = !(loading || error || !char) ? <View char={char} /> : null;

		return (
			<div className="char__info">
				{skeleton}
				{errorMessage}
				{spinner}
				{content}
			</div>
		);

}

const View = ({char}) => {
	const {name, description, thumbnail, homepage, wiki, comics} = char;

	const notFoundImg = 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg';

	const isNotFoundImg = (thumbnail) => {
		if (thumbnail === notFoundImg) {
			return {'objectFit' : 'unset'};
		}
		return {'objectFit' : 'cover'};
	};

	return (
		<>
			<div className="char__basics">
				<img src={thumbnail} alt="abyss" style={isNotFoundImg(thumbnail)}/>
				<div>
					<div className="char__info-name">{name}</div>
					<div className="char__btns">
						<a href={homepage} className="button button__main">
							<div className="inner">homepage</div>
						</a>
						<a href={wiki} className="button button__secondary">
							<div className="inner">Wiki</div>
						</a>
					</div>
				</div>
			</div>
			<div className="char__descr">
				{description}
			</div>

			<div className="char__comics">Comics:</div>
			<ul className="char__comics-list">
				{comics.length > 0 ? null : 'There is no comics with this character'}
				{comics.slice(0, 9).map((item, i) =>
					<li key={i} className="char__comics-item">
						<a href={item.resourceURI}>{item.name}</a>
					</li>)}
			</ul>
		</>
	);
};

CharInfo.propTypes = {
	charId: PropTypes.number
};

View.propTypes = {
	char: PropTypes.object
};

export default CharInfo;
