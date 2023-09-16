import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './components/app/App';
import MarvelService from './services/MarvelService';
import './style/style.scss';

const marvelService = new MarvelService();

marvelService.getAllCharacters().then(res => console.log(res.data.results.forEach(item => item.name)));

const root = createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);

