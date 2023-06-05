const { extractJoiErrors } = require('../utils/validation-errors');
const { Movie, validateMovie, validateRate } = require('../models/movie');

async function addNewMovie(req, res) {
	const { title, genre, desc, releaseDate, poster } = req.body;
	const movie = { title, genre, desc, releaseDate, poster };
	const { error } = await validateMovie(movie);

	if (error) {
		return res.status(422).send({ message: 'Invalid data', errors: extractJoiErrors(error) });
	}

	return Movie.create(movie)
		.then((movie) => {
			res.status(201).send({ message: `Movie ${movie.title} was created successfully`, movie });
		})
		.catch((err) => {
			console.log(err);
			return res.status(500).send({ message: 'Something went wrong while creating the movie' });
		});
}

async function getMovies(_req, res) {
	return Movie.find()
		.populate('genre')
		.then((movies) => {
			if (!movies.length) {
				return res.status(404).send({ message: 'No movies were added yet!' });
			}

			res.status(200).send({ movies });
		})
		.catch((err) => {
			console.log(err);
			res.status(500).send({ message: 'Something went wrong while getting the movies' });
		});
}

async function getMovieById(req, res) {
	return Movie.findById(req.params.id)
		.populate('genre')
		.then((movie) => {
			if (!movie) {
				return res.status(404).send({ message: `Movie with ID ${req.params.id} was not found!` });
			}

			return res.status(200).send({ movie });
		})
		.catch((err) => {
			console.log(err);
			return res.status(500).send({ message: 'Something went wrong while getting the movie' });
		});
}

async function updateMovie(req, res) {
	Movie.findByIdAndUpdate(req.params.id, req.body, { new: true, populate: 'genre' })
		.then((movie) => {
			if (!movie) {
				return res.status(404).send({ message: `Movie with ID ${req.params.id} was not found!` });
			}

			return res.status(200).send({ message: 'Movie updated successfully', movie });
		})
		.catch((err) => {
			console.log(err);
			return res.status(500).send({ message: 'Something went wrong while updating the movie' });
		});
}

async function rateMovie(req, res) {
	const { id } = req.params;
	const rate = +req.body.rate;
	const user = req.user;

	try {
		const movie = await Movie.findById(id).populate('genre');
		if (!movie) {
			return res.status(404).send({ message: `Movie with ID ${id} was not found!` });
		}

		const { error } = await validateRate({ rate, userId: user.id }, movie);

		if (error) {
			return res.status(422).send({ message: 'Invalid data', errors: extractJoiErrors(error) });
		}

		const newRate = calculateRate({ rate, movie });
		movie.rate = newRate;
		movie.ratedUsers.push(user.id);

		await movie.save();
		return res.status(200).send({ message: 'Rated Successfully', movie });
	} catch (err) {
		console.log(err);
		return res.status(500).send({ message: 'Something went wrong while rating the movie' });
	}
}

function calculateRate({ movie, rate }) {
	let prevRatesCount = movie.ratedUsers.length;
	let newRate = (movie.rate + rate) / (prevRatesCount + 1);

	return newRate;
}

module.exports = {
	addNewMovie,
	getMovies,
	rateMovie,
	getMovieById,
	updateMovie,
};
