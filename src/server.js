const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB konektovan'))
  .catch(err => console.error('MongoDB greška:', err));
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API radi!');
});

const eventsRouter = require('./routes/events');
app.use('/api/events', eventsRouter);

app.listen(PORT, () => {
  console.log(`Server sluša na portu ${PORT}`);
});

