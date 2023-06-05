const { User } = require('../models/user');

async function setCurrentUser(req, res, next) {
	try {
		const token = req.header('Authorization').replace('Bearer ', '');
		const user = await User.findOne({ token });

		if (user) {
			req.user = user;
		}

		next();
	} catch (err) {
		res.status(401).send({ error: 'Authentication Error' });
	}
}

module.exports = { setCurrentUser };
