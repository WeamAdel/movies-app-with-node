const joi = require('joi');
const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		maxlength: 255,
		trim: true,
		unique: true,
	},
	genre: {
		type: [mongoose.Schema.Types.ObjectId],
		ref: 'Genre',
		required: true,
		default: [],
	},
	desc: {
		type: String,
		required: true,
		maxlength: 1024,
		trim: true,
	},
	releaseDate: {
		type: Date,
		required: true,
	},
	rate: {
		type: Number,
		required: true,
		min: 0,
		max: 10,
		default: 0,
	},
	ratedUsers: {
		type: [mongoose.Schema.Types.ObjectId],
		required: true,
		ref: 'User',
		default: [],
	},
	poster: {
		type: String,
		required: true,
		maxlength: 1024,
		trim: true,
	},
});

const Movie = mongoose.model('Movie', movieSchema);

const validateMovie = (movie) => {
	const schema = joi.object({
		title: joi.string().max(255).required().external(uniqueMovieValidator),
		genre: joi.array().items(joi.string()).required(),
		desc: joi.string().max(1024).required(),
		releaseDate: joi.date().max(new Date()).required(),
		poster: joi.string().max(1024).required(),
	});

	const result = schema
		.validateAsync(movie)
		.then((movie) => {
			return { value: movie };
		})
		.catch((err) => {
			return { error: err };
		});

	return result;
};

function validateRate(rate, movie) {
	const schema = joi.object({
		rate: joi.number().min(0).max(10).required(),
		userId: joi.string().required().external(alreadyRatedValidator),
	});

	function alreadyRatedValidator(value, { message }) {
		const isRated = movie.ratedUsers.find((id) => {
			return id.toString() === value;
		});

		if (isRated) {
			return message({ external: `You already rated this movie!` });
		}

		return value;
	}

	return schema
		.validateAsync(rate)
		.then((rate) => {
			return { value: rate };
		})
		.catch((err) => {
			return { error: err };
		});
}

async function uniqueMovieValidator(value, { message }) {
	const movie = await Movie.findOne({ title: { $regex: new RegExp(value.trim(), 'i') } });

	if (movie) {
		return message({ external: `${value} movie already exists!` });
	}

	return value;
}

module.exports = { Movie, validateMovie, validateRate };
