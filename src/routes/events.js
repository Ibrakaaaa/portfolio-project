const express = require('express');
const router = express.Router();

const events = [
  { id: 1, title: 'React Meetup Munich', date: '2026-09-10' },
  { id: 2, title: 'DevOps Workshop', date: '2026-09-15' },
];

router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const event = events.find(e => e.id === id);

  if (!event) {
    return res.status(404).json({ message: 'Event nije pronađen' });
  }

  res.json(event);
});

router.post('/', (req, res) => {
  const newEvent = {
    id: events.length + 1,
    title: req.body.title,
    date: req.body.date,
  };

  events.push(newEvent);
  res.status(201).json(newEvent);
});

router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const event = events.find(e => e.id === id);

  if (!event) {
    return res.status(404).json({ message: 'Event nije pronađen' });
  }

  event.title = req.body.title;
  event.date = req.body.date;

  res.json(event);
});

router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = events.findIndex(e => e.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Event nije pronađen' });
  }

  events.splice(index, 1);
  res.status(204).send();
});


module.exports = router; 