const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const pizzas = require('./api/pizzas.route');
const users = require('./api/users.route');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/pizzas', pizzas);
app.use('/user', users);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    message: err.message,
    error: err,
  });
});

module.exports = app;
