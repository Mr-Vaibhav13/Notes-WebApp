import '../App.css'

import Show from './Show'
import React, { useEffect, useState } from 'react'

const App = () => {
   
   
  const [notes, setNotes] = useState([]) 

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  
  const [select , setSelect] = useState(null);

  const handleAddNote = async (event)=>{
    event.preventDefault();

    // no need as now Database is using
    // const newNote = {
    //   id:notes.length +1,
    //   title: title,
    //   content: content
    // }
    
    // as now data came from DB thus it save after reload as well
    try {
      const data = await fetch(
        "http://localhost:5000/api/notes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            content,
          }),
        }
      );

      const newNote = await data.json();

      setNotes([newNote, ...notes]);
      setTitle("");
      setContent("");
    } catch (e) {
      console.log(e);
    }
    
  };


  const handleClickNote = (note) => {
    setSelect(note)
    setTitle(note.title)
    setContent(note.content)
  };


  const HandleUpdateNote = async (event) =>{

    event.preventDefault();

    if(!select){
      return;
    }

    // const updateNote = {
    //   id : select.id,
    //   title: title,
    //   content : content
    // }

    try{

      const data = await fetch(`http://localhost:5000/api/notes/${select.id}`,
      {
        method:"PUT",
        headers:{
          "Content-Type": "application/json"
        },
        body:JSON.stringify({
          title,
          content,
        })

      })

      const updateNote = await data.json();
      

      const notesList = notes.map((note)=>(
        note.id===select.id ? updateNote : note
      ))
  
      setNotes(notesList)
      setTitle("")
      setContent("")
      setSelect(null)

    } catch(error){
      console.log(error)
    }

    
  };

  const handleCancel = ()=>{
    setSelect(null)
    setTitle("")
    setContent("")
  }

  const deleteNote = async (event, noteId)=>{
    event.stopPropagation(); // used when multiple event in same container
 
    try {
      await fetch(`http://localhost:5000/api/notes/${noteId}`,
      {
        method:"DELETE",
      }
      );

      const updateList = notes.filter(
        (note) => note.id!==noteId
      )
  
      setNotes(updateList)
      
    } catch (error) {
      console.log(error)
    }
     
    
  };



  const fetchApi = async()=>{
    try{
      const data = await fetch('http://localhost:5000/api/notes')
      const json = await data.json()

      setNotes(json)
    } catch(error){
      console.log(error);
    }
  }


  useEffect(()=>{
    fetchApi()
  },[])

  return (
    <div className='app-container'>
      
      <form className='notes-form' onSubmit={
        (event)=> select ? HandleUpdateNote(event) : handleAddNote(event)}>

        <input
        value={title}
        onChange={(event)=>{setTitle(event.target.value)}} 
        placeholder='title' required></input>

        <textarea
        className='notes-textarea'
        value={content}
        onChange={(event)=>{setContent(event.target.value)}} 
        placeholder='Content' rows={10} required></textarea>
        
        {select ? 
        (<div className='edit-buttons'>
          <button className='save' type='submit'>Save</button>
          <button className='cancel' onClick={handleCancel}>Cancel</button>
        </div>) : 
        (<button className='add' type='submit'>Add Note</button>)}


        
      </form>
      
      <Show notes={notes} handleClickNote={handleClickNote} deleteNote={deleteNote} />
    </div>
  )
}

export default App