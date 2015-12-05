'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DefinitionSchema = new Schema({
  type: String,
  url: String,
  handles: [
    {
      module: String,
      x: Number,
      y: Number,
      config: Schema.Types.Mixed
    }
  ]
});

module.exports = mongoose.model('Definition', DefinitionSchema);