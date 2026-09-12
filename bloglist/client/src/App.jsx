import { useState, useEffect } from "react";
import { useBlogs, useNotification } from "./store";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
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
  const [user, setUser] = useState(null);
  const { initialize } = useBlogs();
  const { displayNotification } = useNotification();

  useEffect(() => {
    initialize();
  }, [initialize]);

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

  // const handleNewBlog = async (newBlog) => {
  //   try {
  //     const savedBlog = await blogService.create(newBlog);
  //     const userId = savedBlog.user;
  //     savedBlog.user = { id: userId, name: user.name, username: user.username };
  //     setBlogs(blogs.concat(savedBlog));

  //     displayNotification(
  //       `a new blog ${savedBlog.title} by ${savedBlog.author} added`,
  //       "success",
  //     );
  //     navigate("/");
  //   } catch (error) {
  //     console.error(error);
  //     displayNotification(error.response.data.error, "error");
  //   }
  // };

  // const likeBlog = async (updatedBlog) => {
  //   try {
  //     const likedBlog = await blogService.like(updatedBlog);

  //     setBlogs(
  //       blogs.map((b) => {
  //         if (b.id === updatedBlog.id) {
  //           const fullUser = b.user;
  //           b = likedBlog;
  //           b.user = fullUser;
  //         }
  //         return b;
  //       }),
  //     );
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

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
