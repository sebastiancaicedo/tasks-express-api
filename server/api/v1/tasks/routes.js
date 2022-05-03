const express = require('express');
// eslint-disable-next-line
const router = express.Router();

const controller = require('./controller');

router.route('/').get(controller.all).post(controller.create);

router.param('id', controller.findById);
// router
//   .route('/:id')
//   .get(controller.findById)
//   .put(controller.findById)
//   .delete(controller.findById);

router
  .route('/:id')
  .get(controller.read)
  .put(controller.update)
  .delete(controller.delete);

module.exports = router;
