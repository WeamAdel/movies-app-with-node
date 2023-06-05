const express = require('express');
const router = require('./routes/index');
const { connect } = require('./db');
const { setCurrentUser } = require('./middlewares');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Pass data to all views
app.use(setCurrentUser);
app.use('/', router);

connect();
app.listen(3000);
