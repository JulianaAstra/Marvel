const getRandomIndexFromArray = (array) => {
	return Math.floor(Math.random() * ((array.length) - 0));
};

const getCharacter = (array, number) => {
	console.log(number);
	return array.filter((elem, index) => {
		if (index === number) {
			return elem;
		}
	})[0];
};

const getRandomNumInRange = (max, min) => {
	return Math.floor(Math.random() * (max - min) + min);
};

export { getRandomIndexFromArray, getCharacter, getRandomNumInRange };
