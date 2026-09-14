import { Button, TextField } from "@mui/material";
import { useField } from "../hooks";
import commentService from "../services/comments";

const CommentForm = ({ blogid }) => {
  const content = useField("text");

  const createComment = async (event) => {
    event.preventDefault();
    const newComment = {
      content: content.value,
      blog: blogid,
    };

    // TODO: make comment service to communicate with backend.
    await commentService.create(newComment);
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
