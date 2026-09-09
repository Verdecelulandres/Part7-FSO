import { Link } from 'react-router-dom';

const BlogList = ({ blogs }) => {

  return (
    <div>
      <h2>blogs</h2>
      <ul>
        {blogs
          .sort((a, b) => b.likes - a.likes)
          .map(blog => (
            <li className="blog-item" key={blog.id}>
              <Link className="blog-link" to={`/blogs/${blog.id}`}>{blog.title}</Link>
            </li>
          ))
        }
      </ul>

    </div>
  )
}

export default BlogList;