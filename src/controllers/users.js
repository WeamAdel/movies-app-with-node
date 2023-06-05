const { User } = require('../models/user');

async function getUserByEmail(email) {
	return User.findOne({
		email: email,
	});
}

module.exports = { getUserByEmail };
