var bcrypt = require('bcrypt');

function encode(value, saltRounds = 12) {
	return bcrypt.hash(value, saltRounds);
}

module.exports = { encode };
