function auth(req, res, next) {
	if (!req.user) {
		return res.status(401).send({ error: 'Please sign in first.' });
	}

	next();
}

module.exports = auth;
