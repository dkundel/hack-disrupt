'use strict';

var _ = require('lodash');
var Definition = require('./definition.model');

// Get list of definitions
exports.index = function(req, res) {
  Definition.find(function (err, definitions) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(definitions);
  });
};

// Get a single definition
exports.show = function(req, res) {
  Definition.findById(req.params.id, function (err, definition) {
    if(err) { return handleError(res, err); }
    if(!definition) { return res.status(404).send('Not Found'); }
    return res.json(definition);
  });
};

// Creates a new definition in the DB.
exports.create = function(req, res) {
  Definition.create(req.body, function(err, definition) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(definition);
  });
};

// Updates an existing definition in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Definition.findById(req.params.id, function (err, definition) {
    if (err) { return handleError(res, err); }
    if(!definition) { return res.status(404).send('Not Found'); }
    var updated = _.merge(definition, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(definition);
    });
  });
};

// Deletes a definition from the DB.
exports.destroy = function(req, res) {
  Definition.findById(req.params.id, function (err, definition) {
    if(err) { return handleError(res, err); }
    if(!definition) { return res.status(404).send('Not Found'); }
    definition.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}