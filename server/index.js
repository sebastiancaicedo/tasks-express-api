const express = require('express');
const api = require('./api/v1');
const api2 = require('./api/v2');

const app = express();

app.use(express.json());

app.use('/api/v1', api);
app.use('/api/v2', api2);

app.use((req, res, next) => {
  next({
    message: '404 Not found',
    statusCode: 404,
  });
});

// For handling Logic errors
app.use((err, req, res, next) => {
  const { message = 'Internal Error' } = err;
  let { statusCode = 500 } = err;

  if (err.name === 'ValidationError') {
    statusCode = 400;
  }
  res.status(statusCode);
  res.json({
    message,
  });
});

module.exports = app;
