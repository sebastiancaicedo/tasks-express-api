const mongoose = require('mongoose');

const fields = {
  firstName: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 32,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 32,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    maxlength: 255,
  },
};

const protected = {
  enabled: {
    type: Boolean,
    default: true,
    required: true,
  },
};

const user = new mongoose.Schema(Object.assign({}, fields, protected), {
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
});

user.virtual('fullName').get(function () {
  return this.firstName + ' ' + this.lastName;
});

module.exports = { fields, Model: mongoose.model('user', user) };
