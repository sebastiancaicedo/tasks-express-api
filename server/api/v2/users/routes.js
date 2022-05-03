const express = require('express');
// eslint-disable-next-line
const router = express.Router();

const controller = require('./controller');

router.route('/').get(controller.all).post(controller.create);

router.param('id', controller.findById);

router
  .route('/:id')
  .get(controller.read)
  .put(controller.update)
  .patch(controller.activation);

module.exports = router;
