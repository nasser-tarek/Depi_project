import React, { useEffect, useState } from 'react'

function NoteRow({ note, onEditClick, onDelete }) {
  return (
    <div className="note-row">
      <div className="note-title">{note.title}</div>
      <div className="note-actions">
        <button onClick={() => onEditClick(note)} className="btn">Edit</button>
        <button onClick={() => onDelete(note.id)} className="btn btn-danger">Delete</button>
      </div>
    </div>
  )
}

export default function App() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [editing, setEditing] = useState(null) // note object or null
  const [form, setForm] = useState({ title: '', content: '' })

  useEffect(() => {
    loadNotes()
  }, [])

  async function loadNotes() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/notes')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setNotes(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function startCreate() {
    setEditing({})
    setForm({ title: '', content: '' })
  }

  function startEdit(note) {
    setEditing(note)
    setForm({ title: note.title || '', content: note.content || '' })
  }

  async function save() {
    try {
      const payload = { title: form.title, content: form.content }
      let res
      if (editing && editing.id) {
        res = await fetch(`/api/notes/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        res = await fetch('/api/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }
      if (!res.ok) throw new Error(`Save failed: ${res.status}`)
      await loadNotes()
      setEditing(null)
    } catch (e) {
      alert('Save error: ' + e.message)
    }
  }

  async function remove(id) {
    if (!confirm('Delete this note?')) return
    try {
      const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(`Delete failed ${res.status}`)
      await loadNotes()
    } catch (e) {
      alert('Delete error: ' + e.message)
    }
  }

  return (
    <div className="app">
      <header>
        <h1>Notes</h1>
        <div className="controls">
          <button onClick={startCreate} className="btn">New Note</button>
          <button onClick={loadNotes} className="btn">Refresh</button>
        </div>
      </header>

      {loading && <div className="status">Loading...</div>}
      {error && <div className="status error">{error}</div>}

      <div className="notes-list">
        {notes.length === 0 && !loading && <div className="empty">No notes yet.</div>}
        {notes.map(n => (
          <div key={n.id} className="note-card">
            <div className="note-card-inner">
              <h3>{n.title}</h3>
              <p>{n.content}</p>
              <div className="note-actions-inline">
                <button onClick={() => startEdit(n)} className="btn">Edit</button>
                <button onClick={() => remove(n.id)} className="btn btn-danger">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing !== null && (
        <div className="editor">
          <h2>{editing.id ? 'Edit note' : 'New note'}</h2>
          <label>Title</label>
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <label>Content</label>
          <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
          <div className="editor-actions">
            <button onClick={save} className="btn">Save</button>
            <button onClick={() => setEditing(null)} className="btn">Cancel</button>
          </div>
        </div>
      )}

      <footer>
        <small>DePi notes — edit feature</small>
      </footer>
    </div>
  )
}
