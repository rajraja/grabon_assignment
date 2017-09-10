'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

  /**
   * Key value subdocument
   */
  var keyval = new Schema({
    key: {
      type: String,
      default: '',
      trim: true,
      required: 'Please fill name'
    },
    value: {
      type: String,
      default: '',
      trim: true,
      required: 'Please fill code'
    },
    seq_id: {
      type: String,
      trim: true
    },
    resourceBundle: [{
      languageCode: {
        type: String,
        default: 'en',
        trim: true,
        required: 'Please fill the langugage code for the item'
      },
      displayName: {
        type: String
      },
      description: {
        type: String
      }
    }],
    resource: {
      type: String
    }
  });

/**
 * Configuration Schema
 */
var ConfigurationSchema = new Schema({
  configName: {
    type: String,
    default: '',
    trim: true,
    required: 'Please fill the unique name for the configuraiton item'
  },
  resourceBundle:[{
    languageCode: {
      type: String,
      default: 'en',
      trim: true,
      required: 'Please fill the langugage code for the item'
    },
    configDisplayName: {
      type: String,
      default: '',
      trim: true,
      required: 'Please fill the display name for the configuration item'
    },
    configDescription: {
      type: String,
      default: '',
      trim: true,
      required: 'Please fill the description'
    }
  }
  ],

  list: [keyval],

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

mongoose.model('Configuration', ConfigurationSchema);
