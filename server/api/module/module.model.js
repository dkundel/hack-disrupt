'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ModuleSchema = new Schema({
  id: String,
  name: String,
  type: String,
  category: String,
  logo: String,
  config: [Schema.Types.Mixed]
});

module.exports = mongoose.model('Module', ModuleSchema);