const router = require('express').Router();
const genresRouter = require('./genres');
const authRouter = require('./auth');
const moviesRouter = require('./movies');

router.use('/auth', authRouter);
router.use('/genres', genresRouter);
router.use('/movies', moviesRouter);

module.exports = router;
