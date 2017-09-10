'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Subject = mongoose.model('Subject'),
  _ = require('lodash'),
  User = mongoose.model('User'),
  constants = require(path.resolve('./modules/common/server/constants')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a subject
 */
exports.create = function (req, res) {
  var subject = new Subject(req.body);
  subject.user = req.user;

  subject.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(subject);
    }
  });
};

/**
 * Show the current subject
 */
exports.read = function (req, res) {
  res.json(req.subject);
};

/**
 * Update a subject
 */
exports.update = function (req, res) {
  var subject = req.subject;

  // subject.title = req.body.title;
  // subject.content = req.body.content;

  subject = _.extend(subject , req.body);

  subject.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(subject);
    }
  });
};

/**
 * Delete an subject
 */
exports.delete = function (req, res) {
  var subject = req.subject;

  subject.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(subject);
    }
  });
};

/**
 * List of Subjects
 */
exports.list = function (req, res) {
  Subject.find().sort('-created').populate('user', 'displayName').exec(function (err, subjects) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(subjects);
    }
  });
};

/**
 * Subject middleware
 */
exports.subjectByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Subject is invalid'
    });
  }

  Subject.findById(id).populate('user', 'displayName').exec(function (err, subject) {
    if (err) {
      return next(err);
    } else if (!subject) {
      return res.status(404).send({
        message: 'No subject with that identifier has been found'
      });
    }
    req.subject = subject;
    next();
  });
};

exports.getUserByUserId = function(req, res) {
  var userId = req.body.userId;
  if(_.isEmpty(userId)){
    return res.status(400).send({
      message: 'userId is mandatory'
    });
  }
  var query = {};
  query._id = mongoose.Types.ObjectId(userId);
  User.findOne(query)
  .exec(function(err, user) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    res.json(user);
  });
};

exports.getSubjectListByUserId = function(req, res) {
  var userId = req.body.userId;
  if(_.isEmpty(userId)){
    return res.status(400).send({
      message: 'userId is mandatory'
    });
  }
  var query = {};
  query.user = mongoose.Types.ObjectId(userId);
  Subject.find(query)
  .exec(function(err, subject) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    res.json(subject);
  });
};

exports.addSubjectByAdmin = function(req, res) {
  var userId = req.body.user;
  if(_.isEmpty(userId)){    
    return res.status(400).send({
      message: 'userId is mandatory'
    });
  }

  var subject = new Subject(req.body);
  subject.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(subject);
    }
  });
};
