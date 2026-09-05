import { useField } from "../hooks";
import { useNavigate } from "react-router-dom"

const CreateNew = ({ addNew }) => {
  const content = useField('text');
  const author = useField('text');
  const info = useField('text');
  const navigate = useNavigate();

  // const spreadWithoutReset = (fieldState) => {
  //   const spreadable = {reset, ...fieldState};
  //   return spreadable
  // }

  // const inputContent = {reset, ...content};

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAnecdote = {
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    }
    addNew(newAnecdote);
    navigate("/")
  }

  const handleReset = () => {
    content.reset();
    author.reset();
    info.reset();
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input
            name="content"
            {...content.spreadable}
          />
        </div>
        <div>
          author
          <input
            name="author"
            {...author.spreadable}
          />
        </div>
        <div>
          url for more info
          <input
            name="info"
            {...info.spreadable}
          />
        </div>
        <button type="submit">create</button>
        <button type="button" onClick={handleReset}>reset</button>
      </form>
    </div>
  )
}

export default CreateNew
