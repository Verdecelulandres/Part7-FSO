import { useState } from "react";
import { useNotification, useBlogActions } from "../store";
import { useNavigate } from "react-router-dom";
import { TextField, Button } from "@mui/material";

const CreateBlogForm = () => {
  const [blogTitle, setBlogTitle] = useState("");
  const [blogAuthor, setBlogAuthor] = useState("");
  const [blogUrl, setBlogUrl] = useState("");

  const { displayNotification } = useNotification();
  const { createBlog } = useBlogActions();

  const navigate = useNavigate();

  const handleBlogChange = (event) => {
    const { name, value } = event.target;
    if (name === "blogTitle") {
      setBlogTitle(value);
    } else if (name === "blogAuthor") {
      setBlogAuthor(value);
    } else if (name === "blogUrl") {
      setBlogUrl(value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const newBlog = {
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl,
    };
    try {
      createBlog(newBlog);
      setBlogTitle("");
      setBlogAuthor("");
      setBlogUrl("");
      displayNotification(
        `a new blog ${blogTitle} by ${blogAuthor} added`,
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
            type="text"
            onChange={handleBlogChange}
            value={blogTitle}
            name="blogTitle"
            style={inputSpacing}
          />
        </div>
        <div>
          <TextField
            label="author:"
            type="text"
            onChange={handleBlogChange}
            value={blogAuthor}
            name="blogAuthor"
            style={inputSpacing}
          />
        </div>
        <div>
          <TextField
            label="url:"
            type="text"
            onChange={handleBlogChange}
            value={blogUrl}
            name="blogUrl"
            style={inputSpacing}
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
