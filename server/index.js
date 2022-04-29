const express = require('express');
const api = require('./api/v1');

const app = express();

app.use(express.json());

app.use('/api/v1', api);

app.use((req, res, next) => {
  next({
    message: 'Not found',
    statusCode: 404,
  });
});

// For handling Logic errors
app.use((err, req, res, next) => {
  const { message = 'Internal Error', statusCode = 500 } = err;

  res.status(statusCode);
  res.json({
    message,
  });
});

module.exports = app;
