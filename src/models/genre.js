const mongoose = require('mongoose');
const joi = require('joi');

const genreSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		maxlength: 75,
		unique: true,
		trim: true,
	},
});

const Genre = mongoose.model('Genre', genreSchema);

async function validateGenre(genre) {
	const schema = joi.object({
		name: joi.string().max(75).required().external(uniqueGenreValidator),
	});

	return schema.validateAsync(genre);
}

async function uniqueGenreValidator(value, { message }) {
	const genre = await Genre.findOne({ name: { $regex: new RegExp(value, 'i') } });

	if (genre) {
		return message({ external: `${value} genre already exists` });
	}

	return value;
}

module.exports = { Genre, validateGenre };
