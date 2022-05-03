const express = require('express');
// eslint-disable-next-line
const router = express.Router();

const tasks = require('./tasks/routes');
const users = require('./users/routes');

router.use('/tasks', tasks);
router.use('/users', users);

module.exports = router;
