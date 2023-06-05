const mongoose = require('mongoose');

let db;
function connect() {
	if (!db) {
		return mongoose
			.connect(process.env.DATABASE_URL)
			.then((client) => {
				db = client;
				console.log('Connected to movies-db successfully...');
			})
			.catch((err) => console.log(err));
	}
}

function getDatabase() {
	return db;
}

module.exports = { connect, getDatabase };
