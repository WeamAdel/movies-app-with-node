function admin(req, res, next) {
	if (!req?.user?.isAdmin) {
		return res.status(403).send({ error: 'Please sign in as an admin.' });
	}

	next();
}

module.exports = admin;
