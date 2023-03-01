const express = require('express');
const morgan = require('morgan');
const connect = require('./config/db');
const createHttpError = require('http-errors');
require('dotenv').config();

const routes = require('./routes');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(morgan('combined'));
app.use(express.json());

app.use(routes);

app.use((req, res, next) => {
  next(createError(404, 'Endpoint not found'));
});

app.use((error, req, res, next) => {
  console.error(error);
  let errorMessage = 'An unknown error occurred';
  let statusCode = 500;
  if (createHttpError.isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  res.status(statusCode).json({ error: errorMessage });
});

app.listen(4000, async () => {
  await connect();
});
