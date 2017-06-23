var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://shachopin:davidnight@ds137340.mlab.com:37340/notes-gomix');

module.exports = {mongoose};