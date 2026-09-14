import { Button, TextField } from "@mui/material";
import { useField } from "../hooks";
import { useBlogActions } from "../store";


const CommentForm = ({ blogid }) => {
  const content = useField("text");
  const { comment } = useBlogActions();

  const createComment = async (event) => {
    event.preventDefault();
    const newComment = {
      content: content.value,
      blog: blogid,
    };
    comment(newComment);
    content.reset();
  };

  const buttonStyle = {
    height: "100%",
    marginLeft: "10px",
    padding: "16px",
  };

  return (
    <form className="comment-form" onSubmit={createComment}>
      <TextField placeholder="add a comment" {...content.spreadable} />
      <Button type="submit" variant="contained" sx={buttonStyle}>
        Add comment
      </Button>
    </form>
  );
};

export default CommentForm;
