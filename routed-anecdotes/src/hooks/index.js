import { useState } from "react";

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

export { useField }