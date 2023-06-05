const pick = require('lodash.pick');
const { Genre, validateGenre } = require('../models/genre');
const { extractJoiErrors } = require('../utils/validation-errors');

async function addNewGenre(req, res) {
	const { name } = req.body;
	const genreData = { name: name.trim() };

	try {
		await validateGenre(genreData);
		const genre = await createGenre(genreData, res);
		res.status(200);
		res.send(pick(genre, ['id', 'name']));
	} catch (err) {
		console.log(err);
		const errors = extractJoiErrors(err);
		res.status(500);
		res.send({ errors });
	}
}

function createGenre(genreData) {
	return Genre.create(genreData)
		.then((genre) => {
			return genre;
		})
		.catch((err) => {
			console.log(err);
			throw Error('Something went wrong');
		});
}

async function updateGenre(req, res) {
	const { id } = req.params;
	const { name } = req.body;
	const genreData = { name: name.trim() };

	try {
		await validateGenre(genreData, id);
		saveGenreUpdates(id, genreData, res);
	} catch (err) {
		console.log(err);
		const errors = extractJoiErrors(err);
		return res.status(422).send({ message: 'Invalid data', errors });
	}
}

function saveGenreUpdates(id, genreData, res) {
	Genre.findByIdAndUpdate(id, genreData, { new: true })
		.then((genre) => {
			return res.status(200).send({ message: 'Genre updated successfully', genre });
		})
		.catch((err) => {
			console.log(err);
			return res.status(500).send({ message: 'Something went wrong while updating the genre' });
		});
}

async function getGenres(_req, res) {
	try {
		const genres = await Genre.find({}, 'name _id');
		if (!genres.length) {
			return res.status(404).send({ message: 'No genres were added yet!' });
		}

		return res.status(200).send({ genres });
	} catch (err) {
		res.status(500).send({ message: 'Something went wrong' });
	}
}

async function getGenreById(req, res) {
	const { id } = req.params;

	try {
		const genre = await Genre.findById(id);
		return res.status(200).send(genre);
	} catch (err) {
		console.log(err);
		return res.status(500).send({ message: 'Something went wrong' });
	}
}

module.exports = {
	getGenres,
	addNewGenre,
	getGenreById,
	updateGenre,
};
