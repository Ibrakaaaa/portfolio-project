const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// 400 for invalid input (validation/cast errors), 500 for everything else
// (database/server errors), with the real error logged server-side only.
function handleError(res, err) {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(400).json({ message: err.message });
  }
  console.error('Event route error:', err);
  return res.status(500).json({ message: 'Something went wrong. Please try again later.' });
}

// GET svi eventi
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    handleError(res, err);
  }
});

// GET jedan event po id
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event nije pronađen' });
    }
    res.json(event);
  } catch (err) {
    handleError(res, err);
  }
});

// POST novi event
router.post('/', async (req, res) => {
  try {
    const newEvent = await Event.create({ title: req.body.title, date: req.body.date });
    res.status(201).json(newEvent);
  } catch (err) {
    handleError(res, err);
  }
});

// PUT izmjena eventa
router.put('/:id', async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title, date: req.body.date },
      { new: true, runValidators: true, context: 'query' }
    );
    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event nije pronađen' });
    }
    res.json(updatedEvent);
  } catch (err) {
    handleError(res, err);
  }
});

// DELETE event
router.delete('/:id', async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event nije pronađen' });
    }
    res.status(204).send();
  } catch (err) {
    handleError(res, err);
  }
});

module.exports = router;
