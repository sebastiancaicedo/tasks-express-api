const mongoose = require('mongoose');
const { body } = require('express-validator');

const fields = {
  description: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 255,
  },
};

const references = {
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
};

const sanitizers = [body('description').escape()];

const task = new mongoose.Schema(Object.assign(fields, references), {
  timestamps: true,
});

module.exports = {
  fields,
  Model: mongoose.model('task', task),
  references,
  sanitizers,
};
