import { useState, useEffect } from 'react'

function App() {
  const [events, setEvents] = useState([])
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    fetch('http://localhost:5000/api/events')
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error('Greška:', err))
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (editingId) {
      // PUT — izmjena postojećeg
      fetch(`http://localhost:5000/api/events/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, date }),
      })
        .then(res => res.json())
        .then(updatedEvent => {
          setEvents(events.map(event =>
            event._id === editingId ? updatedEvent : event
          ))
          setTitle('')
          setDate('')
          setEditingId(null)
        })
        .catch(err => console.error('Greška:', err))
    } else {
      // POST — novi event
      fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, date }),
      })
        .then(res => res.json())
        .then(newEvent => {
          setEvents([...events, newEvent])
          setTitle('')
          setDate('')
        })
        .catch(err => console.error('Greška:', err))
    }
  }

  const handleDelete = (id) => {
    fetch(`http://localhost:5000/api/events/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setEvents(events.filter(event => event._id !== id))
      })
      .catch(err => console.error('Greška:', err))
  }

  const handleEditClick = (event) => {
    setEditingId(event._id)
    setTitle(event.title)
    setDate(event.date)
  }

  const handleCancelEdit = () => {
  setEditingId(null)
  setTitle('')
  setDate('')
}

  return (
    <div>
      <h1>Event Management</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Naziv eventa"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <button type="submit">
          {editingId ? 'Sačuvaj izmjenu' : 'Dodaj event'}
        </button>
        {editingId && (
  <button type="button" onClick={handleCancelEdit}>Otkaži</button>
)}
      </form>

      <ul>
        {events.map(event => (
          <li key={event._id}>
            {event.title} — {event.date}
            <button onClick={() => handleDelete(event._id)}>Obriši</button>
            <button onClick={() => handleEditClick(event)}>Izmijeni</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App