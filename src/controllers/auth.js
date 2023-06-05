const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, validateUser } = require('../models/user');
const { encode } = require('../utils/hash');
const { extractJoiErrors } = require('../utils/validation-errors');
const { getUserByEmail } = require('./users');

async function signIn(req, res) {
	try {
		const { email, password } = req.body;
		const user = await getUserByEmail(email);
		const validPassword = user && (await bcrypt.compare(password, user._doc.password));

		if (user && validPassword) {
			const token = jwt.sign({ id: user._id, email }, process.env.JWT_KEY, { expiresIn: '1d' });
			user.token = token;
			await user.save();
			return res.status(200).send({ user: user.getFields() });
		}

		res.status(401).send({ error: 'Invalid email or password' });
	} catch (err) {
		console.log(err);
		res.status(500);
		res.send({ error: 'Something went wrong' });
	}
}

async function signUp(req, res) {
	const { name, email, password } = req.body;
	const user = { name, email, password };
	const { error } = validateUser(user);

	if (error) {
		const errors = extractJoiErrors(error);
		return res.status(422).send({ message: 'Invalid inputs', errors });
	}

	const existingUser = await getUserByEmail(email);

	if (existingUser) {
		return res.status(422).send({
			message: 'Duplicate user',
			errors: { email: 'User already exists, try another email or sign in instead.' },
		});
	}

	const encodedPassword = await encode(password);

	User.create({ name, email, password: encodedPassword })
		.then((user) => {
			return res.status(201).send({ message: 'User created successfully', user });
		})
		.catch((err) => {
			console.log(err);
			return res.status(500).send({ message: 'Something went wrong, please try again later.' });
		});
}

function signOut(req, res) {
	req.user.token = null;
	req.user
		.save()
		.then(() => {
			return res.status(200).send({ message: 'User signed out successfully' });
		})
		.catch((err) => {
			console.log(err);
			return res.status(500).send({ message: 'Something went wrong, please try again later.' });
		});
}

module.exports = { signIn, signUp, signOut };
