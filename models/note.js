var mongoose = require('mongoose');

var Note = mongoose.model('Note', {
  title: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true
  },
  body: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  }
});

module.exports = {Note};