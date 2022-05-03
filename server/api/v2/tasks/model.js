const mongoose = require('mongoose');

const fields = {
  description: {
    type: String,
  },
  author: {
    type: String,
  },
};

module.exports = { fields, Model: mongoose.model('task', fields) };
