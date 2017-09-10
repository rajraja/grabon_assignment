'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Configuration = mongoose.model('Configuration'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, configuration;

/**
 * Configuration routes tests
 */
describe('Configuration CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new configuration
    user.save(function () {
      configuration = {
        title: 'Configuration Title',
        content: 'Configuration Content'
      };

      done();
    });
  });

  it('should be able to save an configuration if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new configuration
        agent.post('/api/configurations')
          .send(configuration)
          .expect(200)
          .end(function (configurationSaveErr, configurationSaveRes) {
            // Handle configuration save error
            if (configurationSaveErr) {
              return done(configurationSaveErr);
            }

            // Get a list of configurations
            agent.get('/api/configurations')
              .end(function (configurationsGetErr, configurationsGetRes) {
                // Handle configuration save error
                if (configurationsGetErr) {
                  return done(configurationsGetErr);
                }

                // Get configurations list
                var configurations = configurationsGetRes.body;

                // Set assertions
                (configurations[0].user._id).should.equal(userId);
                (configurations[0].title).should.match('Configuration Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an configuration if not logged in', function (done) {
    agent.post('/api/configurations')
      .send(configuration)
      .expect(403)
      .end(function (configurationSaveErr, configurationSaveRes) {
        // Call the assertion callback
        done(configurationSaveErr);
      });
  });

  it('should not be able to save an configuration if no title is provided', function (done) {
    // Invalidate title field
    configuration.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new configuration
        agent.post('/api/configurations')
          .send(configuration)
          .expect(400)
          .end(function (configurationSaveErr, configurationSaveRes) {
            // Set message assertion
            (configurationSaveRes.body.message).should.match('Title cannot be blank');

            // Handle configuration save error
            done(configurationSaveErr);
          });
      });
  });

  it('should be able to update an configuration if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new configuration
        agent.post('/api/configurations')
          .send(configuration)
          .expect(200)
          .end(function (configurationSaveErr, configurationSaveRes) {
            // Handle configuration save error
            if (configurationSaveErr) {
              return done(configurationSaveErr);
            }

            // Update configuration title
            configuration.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing configuration
            agent.put('/api/configurations/' + configurationSaveRes.body._id)
              .send(configuration)
              .expect(200)
              .end(function (configurationUpdateErr, configurationUpdateRes) {
                // Handle configuration update error
                if (configurationUpdateErr) {
                  return done(configurationUpdateErr);
                }

                // Set assertions
                (configurationUpdateRes.body._id).should.equal(configurationSaveRes.body._id);
                (configurationUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of configurations if not signed in', function (done) {
    // Create new configuration model instance
    var configurationObj = new Configuration(configuration);

    // Save the configuration
    configurationObj.save(function () {
      // Request configurations
      request(app).get('/api/configurations')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single configuration if not signed in', function (done) {
    // Create new configuration model instance
    var configurationObj = new Configuration(configuration);

    // Save the configuration
    configurationObj.save(function () {
      request(app).get('/api/configurations/' + configurationObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', configuration.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single configuration with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/configurations/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Configuration is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single configuration which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent configuration
    request(app).get('/api/configurations/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No configuration with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an configuration if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new configuration
        agent.post('/api/configurations')
          .send(configuration)
          .expect(200)
          .end(function (configurationSaveErr, configurationSaveRes) {
            // Handle configuration save error
            if (configurationSaveErr) {
              return done(configurationSaveErr);
            }

            // Delete an existing configuration
            agent.delete('/api/configurations/' + configurationSaveRes.body._id)
              .send(configuration)
              .expect(200)
              .end(function (configurationDeleteErr, configurationDeleteRes) {
                // Handle configuration error error
                if (configurationDeleteErr) {
                  return done(configurationDeleteErr);
                }

                // Set assertions
                (configurationDeleteRes.body._id).should.equal(configurationSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an configuration if not signed in', function (done) {
    // Set configuration user
    configuration.user = user;

    // Create new configuration model instance
    var configurationObj = new Configuration(configuration);

    // Save the configuration
    configurationObj.save(function () {
      // Try deleting configuration
      request(app).delete('/api/configurations/' + configurationObj._id)
        .expect(403)
        .end(function (configurationDeleteErr, configurationDeleteRes) {
          // Set message assertion
          (configurationDeleteRes.body.message).should.match('User is not authorized');

          // Handle configuration error error
          done(configurationDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Configuration.remove().exec(done);
    });
  });
});
