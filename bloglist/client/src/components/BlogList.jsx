import { Link } from "react-router-dom";
import { useBlogs } from "../store";
import { Typography } from "@mui/material";

const BlogList = () => {
  const { blogs } = useBlogs();

  return (
    <div>
      <Typography variant="h2" sx={{ fontSize: "32px", margin: "1rem 0" }}>
        blogs
      </Typography>
      {blogs.length === 0 ? (
        <p>No blogs</p>
      ) : (
        <ul>
          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <li className="blog-item" key={blog.id}>
                <Typography variant="body1">
                  <Link className="blog-link" to={`/blogs/${blog.id}`}>
                    {blog.title}
                  </Link>
                </Typography>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default BlogList;
