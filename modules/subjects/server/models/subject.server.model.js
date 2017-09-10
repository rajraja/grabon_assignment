'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Subject Schema
 */
var SubjectSchema = new Schema({
  subjectName: {
    type: String,
    default: '',
    trim: true,
    required: 'Subject cannot be blank'
  },
  marks: {
    type: Number,    
    required: 'Marks cannot be blank'
  },

  // common fields
  createdOn: {
    type: Date,
    default: Date.now
  },
  modifiedOn: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Subject', SubjectSchema);
