const express = require('express');
// eslint-disable-next-line
const router = express.Router();

const tasks = require('./tasks/routes');

router.use('/tasks', tasks);

module.exports = router;
