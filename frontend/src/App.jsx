import React, { useEffect, useState } from 'react'


const API = 'http://localhost:5000/api'; // when running with docker-compose backend exposed on 5000


export default function App(){
const [items, setItems] = useState([])
const [name, setName] = useState('')


useEffect(()=>{ fetchItems() }, [])


async function fetchItems(){
const res = await fetch(`${API}/items`)
const data = await res.json()
setItems(data)
}


async function addItem(e){
e.preventDefault()
if (!name) return
await fetch(`${API}/items`,{
method:'POST',
headers:{'Content-Type':'application/json'},
body: JSON.stringify({ name })
})
setName('')
fetchItems()
}


return (
<div style={{fontFamily:'Inter, system-ui, Arial', padding:24, maxWidth:720, margin:'auto'}}>
<h1 style={{fontSize:28, marginBottom:8}}>DevOps Test App</h1>
<p style={{color:'#666'}}>Simple three-tier app for testing pipelines & deployments.</p>


<form onSubmit={addItem} style={{display:'flex', gap:8, marginTop:16}}>
<input value={name} onChange={e=>setName(e.target.value)} placeholder="New item name" style={{flex:1, padding:8, borderRadius:8, border:'1px solid #ddd'}} />
<button style={{padding:'8px 12px', borderRadius:8, border:'none', background:'#111', color:'#fff'}}>Add</button>
</form>


<ul style={{marginTop:20, padding:0, listStyle:'none'}}>
{items.map(it=> (
<li key={it.id} style={{padding:12, border:'1px solid #eee', borderRadius:8, marginTop:8}}>
<div style={{fontWeight:600}}>{it.name}</div>
<div style={{fontSize:12, color:'#666'}}>{new Date(it.created_at).toLocaleString()}</div>
</li>
))}
</ul>
</div>
)
}