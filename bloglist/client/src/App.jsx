import { useState, useEffect } from "react";
import { useNotification } from "./store";
import { Routes, Route, Link, useMatch, useNavigate } from "react-router-dom";
import { Container, AppBar, Toolbar, Button, Typography } from "@mui/material";
import blogService from "./services/blogs";
import loginService from "./services/login";
import ErrorBoundary from "./ErrorBoundary";
import BlogList from "./components/BlogList";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import CreateBlogForm from "./components/CreateBlogForm";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);

  const { displayNotification } = useNotification();

  const navigate = useNavigate();

  const userStorageStr = "blogAppUser";

  useEffect(() => {
    const storedUser = window.localStorage.getItem(userStorageStr);
    if (storedUser) {
      const loggedInUser = JSON.parse(storedUser);
      blogService.setToken(loggedInUser.token);
      setUser(loggedInUser);
    }
  }, []);

  const handleLogin = async (loginData) => {
    try {
      const JSONusr = await loginService.login(loginData);
      if (JSONusr) {
        setUser(JSONusr);
        window.localStorage.setItem(userStorageStr, JSON.stringify(JSONusr));
        blogService.setToken(JSONusr.token);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      displayNotification("wrong username or password", "error");
    }
  };

  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem(userStorageStr);
    navigate("/");
  };

  const likeBlog = async (updatedBlog) => {
    try {
      const likedBlog = await blogService.like(updatedBlog);

      setBlogs(
        blogs.map((b) => {
          if (b.id === updatedBlog.id) {
            const fullUser = b.user;
            b = likedBlog;
            b.user = fullUser;
          }
          return b;
        }),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const removeBlog = async (blogToDelete) => {
    const { title, id, author } = blogToDelete;
    if (!window.confirm(`Remove blog ${title} by ${author}?`)) {
      return;
    }
    try {
      await blogService.deleteBlog(id);
      setBlogs(blogs.filter((b) => b.id !== id));
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const singleBlogMatch = useMatch("/blogs/:id");
  const selectedBlog = singleBlogMatch
    ? blogs.find((b) => b.id === singleBlogMatch.params.id)
    : null;

  const style = { "&:hover": { bgcolor: "rgba(255,255,255,0.3)" } };
  return (
    <Container>
      <AppBar position="static">
        <Toolbar className="navbar">
          <div>
            <Typography className="appTitle" style={{ fontSize: 20 }}>
              Blog App
            </Typography>
          </div>
          <div>
            <Button color="inherit" component={Link} to="/" sx={style}>
              Blogs
            </Button>
            {user && (
              <Button color="inherit" component={Link} to="/create" sx={style}>
                new blog
              </Button>
            )}
            {user ? (
              <Button color="inherit" onClick={handleLogout} sx={style}>
                logout
              </Button>
            ) : (
              <Button color="inherit" component={Link} to="/login" sx={style}>
                login
              </Button>
            )}
          </div>
        </Toolbar>
      </AppBar>

      <Notification />

      <Routes>
        <Route
          path="/"
          element={
            <ErrorBoundary>
              <BlogList />
            </ErrorBoundary>
          }
        />
        <Route
          path="/create"
          element={
            <ErrorBoundary>
              <CreateBlogForm />
            </ErrorBoundary>
          }
        />
        <Route
          path="/login"
          element={
            <ErrorBoundary>
              <LoginForm login={handleLogin} />
            </ErrorBoundary>
          }
        />
        <Route
          path="/blogs/:id"
          element={
            <ErrorBoundary>
              <Blog
                blog={selectedBlog}
                likeBlog={likeBlog}
                removeBlog={removeBlog}
                loggedUser={user}
              />
            </ErrorBoundary>
          }
        />
        {/* Catchall unspecified requests */}
        <Route
          path="/*"
          element={
            <ErrorBoundary>
              <h1>404 - Page not found</h1>
            </ErrorBoundary>
          }
        />
      </Routes>
    </Container>
  );
};

export default App;
