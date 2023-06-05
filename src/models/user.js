const mongoose = require('mongoose');
const joi = require('joi');
const pick = require('lodash.pick');

const userSchema = mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true, minlength: 8, maxlength: 1024 },
	isAdmin: { type: Boolean, default: false },
	token: { type: String },
});

userSchema.methods.getFields = function (fields = ['id', 'name', 'email', 'isAdmin', 'token']) {
	return pick(this, fields);
};

const User = mongoose.model('User', userSchema);

function validateUser(user) {
	const schema = joi.object({
		name: joi.string().max(75).required(),
		email: joi.string().email().max(125).required(),
		password: joi.string().min(8).max(255).required(),
	});

	return schema.validate(user);
}

module.exports = { User, validateUser };
