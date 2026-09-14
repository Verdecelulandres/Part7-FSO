import { useField } from "../hooks/index";
import { useNotification, useBlogActions } from "../store";
import { useNavigate } from "react-router-dom";
import { TextField, Button } from "@mui/material";

const CreateBlogForm = () => {
  const title = useField("text");
  const author = useField("text");
  const url = useField("text");

  const { displayNotification } = useNotification();
  const { createBlog } = useBlogActions();

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    const newBlog = {
      title: title.value,
      author: author.value,
      url: url.value,
    };
    try {
      createBlog(newBlog);
      displayNotification(
        `a new blog ${title.value} by ${author.value} added`,
        "success",
      );
    } catch (error) {
      console.error(error);
      displayNotification(error.response.data.error, "error");
    } finally {
      navigate("/");
    }
  };
  const inputSpacing = { marginBottom: 10 };

  return (
    <>
      <h3>Create new</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            label="title:"
            name="blogTitle"
            style={inputSpacing}
            {...title.spreadable}
          />
        </div>
        <div>
          <TextField
            label="author:"
            name="blogAuthor"
            style={inputSpacing}
            {...author.spreadable}
          />
        </div>
        <div>
          <TextField
            label="url:"
            name="blogUrl"
            style={inputSpacing}
            {...url.spreadable}
          />
        </div>
        <div>
          <Button type="submit" variant="contained">
            create
          </Button>
        </div>
      </form>
    </>
  );
};

export default CreateBlogForm;
