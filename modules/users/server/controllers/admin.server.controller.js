'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  _ = require('lodash'),
  paginate = require('node-paginate-anything'),
  constants = require(path.resolve('./modules/common/server/constants')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Show the current user
 */
exports.read = function (req, res) {
  res.json(req.model);
};

/**
 * Update a User
 */
exports.update = function (req, res) {
  var user = req.model;

  //For security purposes only merge these parameters
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.displayName = user.firstName + ' ' + user.lastName;
  user.roles = req.body.roles;

  user.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user);
  });
};

/**
 * Delete a user
 */
exports.delete = function (req, res) {
  var user = req.model;

  user.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user);
  });
};

/**
 * List of Users
 */
exports.list = function (req, res) {
  User.find({}, '-salt -password').sort('-created').populate('user', 'displayName').exec(function (err, users) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(users);
  });
};

/**
 * User middleware
 */
exports.userByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'User is invalid'
    });
  }

  User.findById(id, '-salt -password').exec(function (err, user) {
    if (err) {
      return next(err);
    } else if (!user) {
      return next(new Error('Failed to load user ' + id));
    }

    req.model = user;
    next();
  });
};


/**
 * Counts the number of objects - needed for pagination
 */
exports.countUsers = function(req, res, next) {

  var userEmail = req.query.userEmail;
  var userName = req.query.userName;
  var userRoles=[];
  var query = {};

  //TODO: userEmail query - should they be only in email and name? for now, in username
  if(!_.isEmpty(userEmail)){
    // case insensitive email search
    query['email'] = userEmail.toLowerCase();
  }

  if(!_.isEmpty(userName)){
    // case insensitive user name search
    query['displayName'] = {'$regex': userName,$options:'i'};
  }

  if(!_.isEmpty(req.query.userRoles)){
    userRoles = req.query.userRoles.split(',');
    query['roles'] = {$in: userRoles}
  }

  req.query = query;//This will be used in the next function.
  //Get the list of all users of the division for this tenant
  User.count(query,function(err, count) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {      
      req.count = count;
      next();
    }
  });
};
/**
 * Details of all the users to whom this content will be sent or has been sent
 */
exports.loadUsers = function(req, res, next) {
  var totalItems = req.count;
  var maxRangeSize = constants.MAX_RANGE_SIZE_FOR_PAGINATION;
  // var maxRangeSize = 10;

  var queryParameters = paginate(req, res, totalItems, maxRangeSize);
  if(totalItems == 0){
      res.status(200).json({});
  }
  else{
    var query = req.query;
    //Get the list of all users of the division for this tenant
    User.find(query)
    .select({ password: 0, salt: 0, signupTimestamp:0,previousLoginIp:0,currentLoginIp:0,currentLoginTime:0,provider:0,emailVerificationTimestamp:0,last_password_change:0,last_login:0,previousLoginTime:0,failedLoginAttempts:0 })
    .limit(queryParameters.limit)
    .skip(queryParameters.skip)
    .exec(function(err, availableUserList) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.send(availableUserList);
      }
    });
  }
};
