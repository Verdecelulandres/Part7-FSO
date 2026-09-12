import { Link } from "react-router-dom";
import { useBlogs } from "../store";

const BlogList = () => {
  const { blogs } = useBlogs();

  return (
    <div>
      <h2>blogs</h2>
      {blogs.length === 0 ? (
        <p>No blogs</p>
      ) : (
        <ul>
          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <li className="blog-item" key={blog.id}>
                <Link className="blog-link" to={`/blogs/${blog.id}`}>
                  {blog.title}
                </Link>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default BlogList;
