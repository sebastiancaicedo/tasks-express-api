const express = require('express');
// eslint-disable-next-line
const router = express.Router();

const controller = require('./controller');
const { sanitizers } = require('./model');

router.route('/').get(controller.all).post(sanitizers, controller.create);

router.param('id', controller.findById);

router
  .route('/:id')
  .get(controller.read)
  .put(sanitizers, controller.update)
  .patch(controller.activation);

module.exports = router;
