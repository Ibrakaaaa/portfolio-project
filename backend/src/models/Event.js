const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    // TTL index: MongoDB's background job (runs ~every 60s) deletes a
    // document once this field is this many seconds old. Only applies to
    // documents that have createdAt set -- see scripts/backfill-created-at.js
    // for existing documents that predate this field.
    expires: 60 * 60 * 24,
  },
});

module.exports = mongoose.model('Event', eventSchema);