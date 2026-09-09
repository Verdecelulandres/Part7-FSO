import { Typography, Button, Paper, Link } from '@mui/material';

const Blog = ({ blog, likeBlog, removeBlog, loggedUser }) => {

  if (!blog) {
    return null;
  }

  const handleLike = () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id
    }
    likeBlog(updatedBlog);
  }

  const madeByUser = (loggedUser && loggedUser.name === blog.user.name);

  return (
    <Paper className="blog" elevation={4}>
      <Typography
        className='blog-full-title'
        variant='h4'
      >
        <span className='blog-title'>{blog.title}</span>
      </Typography>

      <Typography
        variant='subtitle1'
        style={{ marginTop: 10, color: 'grey' }}
      >
        <span className='blog-author'>by {blog.author}</span>
      </Typography>


      <Link className='blog-url' href={blog.url} >
        {blog.url}
      </Link>

      <Typography
        className='blog-user'
        variant='subtitle2'
        style={{ marginTop: 10, color: 'grey' }}
      >
        Added by {blog.user.name}
      </Typography>

      <div className='blog-buttons-container'>
        <Typography
          className='blog-likes'
          variant='h6'
        >
          likes {blog.likes}
        </Typography>
        {loggedUser &&
          <Button
            className='blog-like-btn'
            onClick={handleLike}
            variant='outlined'
          >
            like
          </Button>
        }
        {madeByUser &&
          <Button
            className="blog-remove-btn"
            onClick={() => removeBlog(blog)}
            variant='outlined'
            color='error'
          >
            remove
          </Button>
        }
      </div>
    </Paper>
  )
}

export default Blog