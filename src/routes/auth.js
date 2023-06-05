const router = require('express').Router();
const noAuth = require('../middlewares/no-auth');
const { signUp, signIn, signOut } = require('../controllers/auth');

router.post('/sign-up', noAuth, (req, res, next) => {
	signUp(req, res, next);
});

router.post('/sign-in', noAuth, (req, res, next) => {
	signIn(req, res, next);
});

router.post('/sign-out', (req, res, next) => {
	signOut(req, res, next);
});

module.exports = router;
