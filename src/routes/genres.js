const express = require('express');
const admin = require('../middlewares/admin');
const { addNewGenre, getGenreById, updateGenre, getGenres } = require('../controllers/genre');

const router = express.Router();

router.post('/', admin, (req, res) => {
	addNewGenre(req, res);
});

router.post('/:id', admin, (req, res) => {
	updateGenre(req, res);
});

router.get('/:id', admin, (req, res) => {
	getGenreById(req, res);
});

router.get('/', admin, (req, res) => {
	getGenres(req, res);
});

module.exports = router;
