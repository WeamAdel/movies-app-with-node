const express = require('express');
const admin = require('../middlewares/admin');
const auth = require('../middlewares/auth');
const {
	addNewMovie,
	rateMovie,
	getMovies,
	getMovieById,
	updateMovie,
} = require('../controllers/movies');

const router = express.Router();

router.get('/:id', (req, res) => {
	getMovieById(req, res);
});

router.get('/', (req, res) => {
	getMovies(req, res);
});

router.post('/:id', admin, (req, res) => {
	updateMovie(req, res);
});

router.post('/', admin, (req, res) => {
	addNewMovie(req, res);
});

router.post('/rate/:id', auth, (req, res) => {
	rateMovie(req, res);
});

module.exports = router;
