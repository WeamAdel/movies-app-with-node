function noAuth(req, res, next) {
	if (req.user) {
		return res.status(401).send({ error: 'Already signed in.' });
	}

	next();
}

module.exports = noAuth;
