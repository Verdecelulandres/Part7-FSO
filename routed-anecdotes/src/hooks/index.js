import { useState, useEffect } from "react";
import anecdoteService from '../services/anecdotes';

const useField = (type) => {
  const [value, setValue] = useState('');

  const onChange = (event) => {
    setValue(event.target.value);
  }

  const reset = () => {
    setValue('');
  }

  const spreadable = { type, value, onChange }

  return {
    type,
    value,
    onChange,
    reset,
    spreadable
  }
}

const useAnecdotes = () => {
  const [anecdotes, setAnecdotes] = useState([]);
  useEffect(() => {
    anecdoteService.getAll().then(data => setAnecdotes(data));
  }, []);
  
  const addAnecdote = (anecdote) => {
    const newAnecdote = anecdoteService.createNew(anecdote);
    if (newAnecdote) {
      setAnecdotes(anecdotes.concat(newAnecdote));
    }
  }

  const deleteAnecdote = (id) => {
    console.log(id);
    const del = anecdoteService.remove(id);
    console.log(del);
    
    if (del) {
      setAnecdotes(anecdotes.filter(a => a.id !== id));
    }
  }
  
  return { anecdotes, addAnecdote, deleteAnecdote }

}

export { useField, useAnecdotes }