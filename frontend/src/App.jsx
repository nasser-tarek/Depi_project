import React, { useEffect, useState } from 'react'

const API = '/api';
export default function App(){
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)

  // store id of expanded note (or null)
  const [expandedId, setExpandedId] = useState(null)

  // EDITING state (minimal)
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editBody, setEditBody] = useState('')

  // Modal / confirmation state
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmNoteId, setConfirmNoteId] = useState(null)

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

  // Open confirmation modal (replaces native confirm)
  function confirmDelete(id){
    setConfirmNoteId(id)
    setConfirmOpen(true)
    // optionally trap focus or manage focus here if you add more accessibility features
  }

  // Perform actual delete after user confirms in modal
  async function performDelete(){
    const id = confirmNoteId
    if (!id) {
      setConfirmOpen(false)
      setConfirmNoteId(null)
      return
    }
    try {
      await fetch(`${API}/notes/${id}`,{ method:'DELETE' })
      // if deleted note was expanded, collapse
      if (expandedId === id) setExpandedId(null)
      fetchNotes()
    } catch (err) {
      console.error('deleteNote error', err)
    } finally {
      setConfirmOpen(false)
      setConfirmNoteId(null)
    }
  }

  function cancelDelete(){
    setConfirmOpen(false)
    setConfirmNoteId(null)
  }

  function toggleExpand(id){
    setExpandedId(prev => (prev === id ? null : id))
  }

  function startEditing(note) {
    setEditingId(note.id)
    setEditTitle(note.title)
    setEditBody(note.body)
  }

  async function saveEdit(id) {
    try {
      await fetch(`${API}/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle, body: editBody })
      })
      setEditingId(null)
      fetchNotes()
    } catch (err) {
      console.error("saveEdit error", err)
    }
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
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn-edit" onClick={() => startEditing(note)}>Edit</button>
                    {/* open modal instead of using window.confirm */}
                    <button className="btn-danger" onClick={() => confirmDelete(note.id)}>Delete</button>
                  </div>
                </div>
              </div>

              {/* note body only rendered when expanded */}
              {isOpen && (
                <div className="note-body" role="region" aria-live="polite">
                  {editingId === note.id ? (
                    <div className="edit-form">
                      <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Edit title"
                      />
                      <textarea
                        value={editBody}
                        onChange={(e) => setEditBody(e.target.value)}
                        placeholder="Edit body"
                      />

                      <div style={{ display:'flex', gap:8, marginTop:8 }}>
                        <button className="btn-primary" onClick={() => saveEdit(note.id)}>Save</button>
                        <button className="btn-danger" onClick={() => setEditingId(null)}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    note.body
                  )}
                </div>
              )}
            </li>
          )
        })}
      </ul>

      {/* Confirmation Modal (in-app) */}
      {confirmOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="confirmTitle">
          <div className="modal">
            <h2 id="confirmTitle">🗑️ Delete note</h2>
            <p>This action is permanent and cannot be undone.</p>
            <p className="muted">Are you sure you want to delete this note?</p>

            <div style={{ display:'flex', gap:8, marginTop:12, justifyContent:'flex-end' }}>
              <button className="btn-cancel" onClick={cancelDelete}>Cancel</button>
              <button className="btn-danger" onClick={performDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
