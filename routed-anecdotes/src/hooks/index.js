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
  
  
  return {anecdotes, setAnecdotes}

}

export { useField, useAnecdotes }