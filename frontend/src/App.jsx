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
      // PUT — izmjena postojećeg eventa
      fetch(`http://localhost:5000/api/events/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, date }),
      })
        .then(res => res.json())
        .then(updatedEvent => {
          setEvents(
            events.map(event =>
              event._id === editingId ? updatedEvent : event
            )
          )

          setTitle('')
          setDate('')
          setEditingId(null)
        })
        .catch(err => console.error('Greška:', err))
    } else {
      // POST — novi event
      fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />
      </div>

      <main className="relative mx-auto max-w-5xl px-6 py-12">

        {/* Header */}
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-indigo-400">
            Dashboard
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Event Management
          </h1>

          <p className="mt-3 max-w-xl text-slate-400">
            Create, manage and organize your upcoming events.
          </p>
        </div>

        {/* Form Card */}
        <div className="mb-10 rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">

          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {editingId ? 'Edit event' : 'Create new event'}
            </h2>

            {editingId && (
              <span className="rounded-full bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-400">
                Editing
              </span>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-4 sm:grid-cols-[1fr_180px_auto]"
          >

            {/* Event title */}
            <input
              type="text"
              placeholder="Event name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none placeholder:text-slate-500 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />

            {/* Event date */}
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />

            {/* Submit */}
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold transition hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95"
            >
              {editingId ? 'Save changes' : 'Add event'}
            </button>
          </form>

          {/* Cancel edit */}
          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="mt-4 text-sm text-slate-400 transition hover:text-white"
            >
              ← Cancel editing
            </button>
          )}
        </div>

        {/* Events section */}
        <div>

          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Upcoming events
            </h2>

            <span className="rounded-full bg-white/5 px-3 py-1 text-sm text-slate-400">
              {events.length}{' '}
              {events.length === 1 ? 'event' : 'events'}
            </span>
          </div>

          {/* No events */}
          {events.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">

              <div className="mb-4 text-4xl">
                📅
              </div>

              <h3 className="text-lg font-semibold">
                No events yet
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Create your first event using the form above.
              </p>

            </div>
          ) : (

            /* Event list */
            <ul className="space-y-3">
              {events.map(event => (

                <li
                  key={event._id}
                  className="group flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-indigo-500/30 hover:bg-white/[0.06] sm:flex-row sm:items-center sm:justify-between"
                >

                  {/* Event info */}
                  <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-xl">
                      📅
                    </div>

                    <div>
                      <h3 className="font-semibold text-white">
                        {event.title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {event.date}
                      </p>
                    </div>

                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2">

                    <button
                      onClick={() => handleEditClick(event)}
                      className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:text-indigo-400"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(event._id)}
                      className="rounded-lg border border-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
                    >
                      Delete
                    </button>

                  </div>

                </li>
              ))}
            </ul>
          )}

        </div>

      </main>
    </div>
  )
}

export default App