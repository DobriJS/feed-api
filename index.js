const express = require('express');
const morgan = require('morgan');
const connect = require('./config/db');
const createHttpError = require('http-errors');
const cors = require('cors');
const { swaggerUi, specs } = require('./swagger');

require('dotenv').config();

const routes = require('./routes');

const app = express();

const port = process.env.PORT || 4000;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('combined'));
app.use(express.json());

app.use(routes);

app.use((req, res, next) => {
  next(createHttpError(404, 'Endpoint not found'));
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

app.listen(port, async () => {
  await connect();
});
