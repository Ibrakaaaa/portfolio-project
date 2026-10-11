const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  date: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
        const d = new Date(v + 'T00:00:00.000Z');
        return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
      },
      message: (props) => `${props.value} is not a valid date (expected YYYY-MM-DD)`,
    },
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