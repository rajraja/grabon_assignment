'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Configuration = mongoose.model('Configuration'),
  _ = require('lodash'),
  User = mongoose.model('User'),
  constants = require(path.resolve('./modules/common/server/constants')),  
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a configuration
 */
exports.create = function (req, res) {
  var configuration = new Configuration(req.body);
  configuration.user = req.user;

  configuration.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(configuration);
    }
  });
};

/**
 * Show the current configuration
 */
exports.read = function (req, res) {
  res.json(req.configuration);
};

/**
 * Update a configuration
 */
exports.update = function (req, res) {
  var configuration = req.configuration;

  // configuration.title = req.body.title;
  // configuration.content = req.body.content;

  configuration = _.extend(configuration , req.body);

  configuration.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(configuration);
    }
  });
};

/**
 * Delete an configuration
 */
exports.delete = function (req, res) {
  var configuration = req.configuration;

  configuration.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(configuration);
    }
  });
};

/**
 * List of Configurations
 */
exports.list = function (req, res) {
  Configuration.find().sort('-created').populate('user', 'displayName').exec(function (err, configurations) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(configurations);
    }
  });
};

/**
 * Configuration middleware
 */
exports.configurationByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Configuration is invalid'
    });
  }

  Configuration.findById(id).populate('user', 'displayName').exec(function (err, configuration) {
    if (err) {
      return next(err);
    } else if (!configuration) {
      return res.status(404).send({
        message: 'No configuration with that identifier has been found'
      });
    }
    req.configuration = configuration;
    next();
  });
};
