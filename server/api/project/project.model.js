'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ProjectSchema = new Schema({
  name: String,
  env: [{
    name: String,
    value: String
  }],
  settings: [{
    name: String,
    value: String
  }]
});

module.exports = mongoose.model('Project', ProjectSchema);