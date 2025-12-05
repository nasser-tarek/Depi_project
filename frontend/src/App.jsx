import React, { useEffect, useState } from 'react'

const API = '/api';
export default function App(){
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)

  // store id of expanded note (or null)
  const [expandedId, setExpandedId] = useState(null)

  useEffect(()=>{ fetchNotes() }, [])

  async function fetchNotes(){
    setLoading(true)
    try {
      const res = await fetch(`${API}/notes`)
      const data = await res.json()
      setNotes(data)
    } catch (err) {
      console.error('fetchNotes error', err)
    } finally {
      setLoading(false)
    }
  }

  async function addNote(e){
    e.preventDefault()
    if (!body) return
    try {
      await fetch(`${API}/notes`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ title, body })
      })
      setTitle('')
      setBody('')
      fetchNotes()
    } catch (err) {
      console.error('addNote error', err)
    }
  }

  async function deleteNote(id){
    if (!confirm('Delete this note?')) return
    try {
      await fetch(`${API}/notes/${id}`,{ method:'DELETE' })
      // if deleted note was expanded, collapse
      if (expandedId === id) setExpandedId(null)
      fetchNotes()
    } catch (err) {
      console.error('deleteNote error', err)
    }
  }

  function toggleExpand(id){
    setExpandedId(prev => (prev === id ? null : id))
  }

  return (
    <div className="app-container">
      <h1>Notes — DevOps Test App</h1>
      <p className="muted">Simple three-tier notes app for testing pipelines & deployments.</p>

      <form onSubmit={addNote} className="note-form">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title (optional)" />
        <textarea value={body} onChange={e=>setBody(e.target.value)} placeholder="Write your note" />
        <div style={{display:'flex', gap:8}}>
          <button className="btn-primary">Add Note</button>
        </div>
      </form>

      {loading ? <p className="muted">Loading...</p> : null}

      <ul className="note-list">
        {notes.map(note=> {
          const isOpen = expandedId === note.id
          return (
            <li key={note.id} className="note-card">
              <div className="note-header">
                <div style={{display:'flex', gap:12, alignItems:'center'}}>
                  {/* expand icon button */}
                  <button
                    aria-label={isOpen ? 'Collapse note' : 'Expand note'}
                    className="expand-btn"
                    onClick={() => toggleExpand(note.id)}
                    type="button"
                  >
                    {isOpen ? '▾' : '▸'}
                  </button>

                  <div>
                    <div className="note-title">{note.title || 'Untitled'}</div>
                    <div className="note-meta">{new Date(note.created_at).toLocaleString()}</div>
                  </div>
                </div>

                <div>
                  <button className="btn-danger" onClick={()=>deleteNote(note.id)}>Delete</button>
                </div>
              </div>

              {/* note body only rendered when expanded */}
              {isOpen && (
                <div className="note-body" role="region" aria-live="polite">
                  {note.body}
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
