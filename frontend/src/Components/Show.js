import React from 'react'

const Show = ({ notes, handleClickNote, deleteNote }) => {


    
  return (
    <div className='notes-grid'>

        {notes.map((note)=>(
          <div className='notes-item' key={note.id} 
          onClick={()=>{handleClickNote(note)}}>
          <div className='notes-header'>
            <button onClick={(event)=> deleteNote(event, note.id)}>X</button>
          </div>
          <h2>{note.title}</h2>
          <p>{note.content}</p>
        </div>
      ))}
      </div>
  )
}

export default Show