const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB konektovan, baza:', mongoose.connection.name))
  .catch(err => console.error('MongoDB greška:', err));
const express = require('express');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: '10kb' }));

app.get('/', (req, res) => {
  res.send('API radi!');
});

const eventsRouter = require('./routes/events');
app.use('/api/events', eventsRouter);

// express.json() calls next(err) on malformed JSON or an oversized body --
// without this, Express's default error handler would respond with HTML
// (and a stack trace outside production) instead of JSON.
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large' || err.status === 413) {
    return res.status(413).json({ message: 'Request body is too large.' });
  }
  if (err.type === 'entity.parse.failed' || err instanceof SyntaxError) {
    return res.status(400).json({ message: 'Invalid JSON in request body.' });
  }
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Something went wrong. Please try again later.' });
});

app.listen(PORT, () => {
  console.log(`Server sluša na portu ${PORT}`);
});

