'use strict';

var _ = require('lodash');
var Module = require('./module.model');

// Get list of modules
exports.index = function(req, res) {
  Module.find(function (err, modules) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(modules);
  });
};

// Get a single module
exports.show = function(req, res) {
  Module.findById(req.params.id, function (err, module) {
    if(err) { return handleError(res, err); }
    if(!module) { return res.status(404).send('Not Found'); }
    return res.json(module);
  });
};

// Creates a new module in the DB.
exports.create = function(req, res) {
  Module.create(req.body, function(err, module) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(module);
  });
};

// Updates an existing module in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Module.findById(req.params.id, function (err, module) {
    if (err) { return handleError(res, err); }
    if(!module) { return res.status(404).send('Not Found'); }
    var updated = _.merge(module, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(module);
    });
  });
};

// Deletes a module from the DB.
exports.destroy = function(req, res) {
  Module.findById(req.params.id, function (err, module) {
    if(err) { return handleError(res, err); }
    if(!module) { return res.status(404).send('Not Found'); }
    module.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}