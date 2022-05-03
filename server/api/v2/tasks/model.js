const mongoose = require('mongoose');

const fields = {
  description: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 255,
  },
  author: {
    type: String,
    required: false,
    maxlength: 32,
  },
};

const task = new mongoose.Schema(fields, {
  timestamps: true,
});

module.exports = { fields, Model: mongoose.model('task', task) };
