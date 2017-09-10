'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Subject = mongoose.model('Subject'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, subject;

/**
 * Subject routes tests
 */
describe('Subject CRUD tests', function () {

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

    // Save a user to the test db and create new subject
    user.save(function () {
      subject = {
        title: 'Subject Title',
        content: 'Subject Content'
      };

      done();
    });
  });

  it('should be able to save an subject if logged in', function (done) {
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

        // Save a new subject
        agent.post('/api/subjects')
          .send(subject)
          .expect(200)
          .end(function (subjectSaveErr, subjectSaveRes) {
            // Handle subject save error
            if (subjectSaveErr) {
              return done(subjectSaveErr);
            }

            // Get a list of subjects
            agent.get('/api/subjects')
              .end(function (subjectsGetErr, subjectsGetRes) {
                // Handle subject save error
                if (subjectsGetErr) {
                  return done(subjectsGetErr);
                }

                // Get subjects list
                var subjects = subjectsGetRes.body;

                // Set assertions
                (subjects[0].user._id).should.equal(userId);
                (subjects[0].title).should.match('Subject Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an subject if not logged in', function (done) {
    agent.post('/api/subjects')
      .send(subject)
      .expect(403)
      .end(function (subjectSaveErr, subjectSaveRes) {
        // Call the assertion callback
        done(subjectSaveErr);
      });
  });

  it('should not be able to save an subject if no title is provided', function (done) {
    // Invalidate title field
    subject.title = '';

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

        // Save a new subject
        agent.post('/api/subjects')
          .send(subject)
          .expect(400)
          .end(function (subjectSaveErr, subjectSaveRes) {
            // Set message assertion
            (subjectSaveRes.body.message).should.match('Title cannot be blank');

            // Handle subject save error
            done(subjectSaveErr);
          });
      });
  });

  it('should be able to update an subject if signed in', function (done) {
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

        // Save a new subject
        agent.post('/api/subjects')
          .send(subject)
          .expect(200)
          .end(function (subjectSaveErr, subjectSaveRes) {
            // Handle subject save error
            if (subjectSaveErr) {
              return done(subjectSaveErr);
            }

            // Update subject title
            subject.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing subject
            agent.put('/api/subjects/' + subjectSaveRes.body._id)
              .send(subject)
              .expect(200)
              .end(function (subjectUpdateErr, subjectUpdateRes) {
                // Handle subject update error
                if (subjectUpdateErr) {
                  return done(subjectUpdateErr);
                }

                // Set assertions
                (subjectUpdateRes.body._id).should.equal(subjectSaveRes.body._id);
                (subjectUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of subjects if not signed in', function (done) {
    // Create new subject model instance
    var subjectObj = new Subject(subject);

    // Save the subject
    subjectObj.save(function () {
      // Request subjects
      request(app).get('/api/subjects')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single subject if not signed in', function (done) {
    // Create new subject model instance
    var subjectObj = new Subject(subject);

    // Save the subject
    subjectObj.save(function () {
      request(app).get('/api/subjects/' + subjectObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', subject.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single subject with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/subjects/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Subject is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single subject which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent subject
    request(app).get('/api/subjects/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No subject with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an subject if signed in', function (done) {
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

        // Save a new subject
        agent.post('/api/subjects')
          .send(subject)
          .expect(200)
          .end(function (subjectSaveErr, subjectSaveRes) {
            // Handle subject save error
            if (subjectSaveErr) {
              return done(subjectSaveErr);
            }

            // Delete an existing subject
            agent.delete('/api/subjects/' + subjectSaveRes.body._id)
              .send(subject)
              .expect(200)
              .end(function (subjectDeleteErr, subjectDeleteRes) {
                // Handle subject error error
                if (subjectDeleteErr) {
                  return done(subjectDeleteErr);
                }

                // Set assertions
                (subjectDeleteRes.body._id).should.equal(subjectSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an subject if not signed in', function (done) {
    // Set subject user
    subject.user = user;

    // Create new subject model instance
    var subjectObj = new Subject(subject);

    // Save the subject
    subjectObj.save(function () {
      // Try deleting subject
      request(app).delete('/api/subjects/' + subjectObj._id)
        .expect(403)
        .end(function (subjectDeleteErr, subjectDeleteRes) {
          // Set message assertion
          (subjectDeleteRes.body.message).should.match('User is not authorized');

          // Handle subject error error
          done(subjectDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Subject.remove().exec(done);
    });
  });
});
