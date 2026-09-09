import { useState, useEffect } from 'react';
import { Routes, Route, Link, useMatch, useNavigate } from 'react-router-dom';
import { Container, AppBar, Toolbar, Button, Typography } from '@mui/material';
import blogService from './services/blogs';
import loginService from './services/login';
import BlogList from './components/BlogList';
import Blog from './components/Blog';
import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
import CreateBlogForm from './components/CreateBlogForm';


const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [notificationMsg, setNotificationMsg] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, []);

  const navigate = useNavigate();

  const userStorageStr = 'blogAppUser';


  useEffect(() => {
    const storedUser = window.localStorage.getItem(userStorageStr);
    if (storedUser) {
      const loggedInUser = JSON.parse(storedUser);
      blogService.setToken(loggedInUser.token);
      setUser(loggedInUser);
    }
  }, []);

  const handleLogin = async loginData => {
    try {
      const JSONusr = await loginService.login(loginData);
      if (JSONusr) {
        setUser(JSONusr);
        window.localStorage.setItem(userStorageStr, JSON.stringify(JSONusr));
        blogService.setToken(JSONusr.token);
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      setIsError(true);
      displayNotification('wrong username or password');
    }
  }

  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem(userStorageStr);
    navigate('/');
  }

  const handleNewBlog = async newBlog => {
    try {
      const savedBlog = await blogService.create(newBlog);
      const userId = savedBlog.user;
      savedBlog.user = { id: userId, name: user.name, username: user.username };
      setBlogs(blogs.concat(savedBlog));

      displayNotification(`a new blog ${savedBlog.title} by ${savedBlog.author} added`);
      navigate('/');
    } catch (error) {
      console.error(error);
      setIsError(true);
      displayNotification(error.response.data.error);
    }
  }

  const likeBlog = async (updatedBlog) => {
    try {
      const likedBlog = await blogService.like(updatedBlog);

      setBlogs(blogs.map(b => {
        if (b.id === updatedBlog.id) {
          const fullUser = b.user;
          b = likedBlog;
          b.user = fullUser;
        }
        return b;
      }));
    } catch (error) {
      console.log(error);
    }
  }

  const removeBlog = async (blogToDelete) => {
    const { title, id, author } = blogToDelete;
    if (!window.confirm(`Remove blog ${title} by ${author}?`)) {
      return;
    }
    try {
      await blogService.deleteBlog(id);
      setBlogs(blogs.filter(b => b.id !== id));
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  }

  const displayNotification = (msg) => {
    setNotificationMsg(msg);

    setTimeout(() => {
      setNotificationMsg('');
      setIsError(false);
    }, 5000);
  }
  const singleBlogMatch = useMatch('/blogs/:id');
  const selectedBlog = singleBlogMatch
    ? blogs.find(b => b.id === singleBlogMatch.params.id)
    : null

  const style = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }
  return (
    <Container>
      <AppBar position='static'>
        <Toolbar className='navbar'>
          <div>
            <Typography className='appTitle' style={{ fontSize: 20 }}>
              Blog App
            </Typography>
          </div>
          <div>
            <Button
              color='inherit'
              component={Link}
              to='/'
              sx={style}
            >
              Blogs
            </Button>
            {user &&
              <Button color='inherit' component={Link} to='/create' sx={style}>
                new blog
              </Button>
            }
            {user
              ? <Button color='inherit' onClick={handleLogout} sx={style}>logout</Button>
              : <Button color='inherit' component={Link} to="/login" sx={style}>login</Button>
            }
          </div>
        </Toolbar>
      </AppBar>
      {notificationMsg &&
        <Notification
          message={notificationMsg}
          isError={isError}
        />
      }
      <Routes>
        <Route path="/" element={
          <BlogList blogs={blogs} />
        } />
        <Route path="/create" element={
          <CreateBlogForm createNewBlog={handleNewBlog} />
        } />
        <Route path="/login" element={
          <LoginForm
            login={handleLogin}
          />
        } />
        <Route path="/blogs/:id" element={
          <Blog
            blog={selectedBlog}
            likeBlog={likeBlog}
            removeBlog={removeBlog}
            loggedUser={user}
          />
        } />
      </Routes>
    </Container>
  )
}

export default App