import { useEffect } from "react";
import { useBlogs, useUser, useUserActions } from "./store";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { Container, AppBar, Toolbar, Button, Typography } from "@mui/material";
import ErrorBoundary from "./ErrorBoundary";
import BlogList from "./components/BlogList";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import CreateBlogForm from "./components/CreateBlogForm";
import UserList from "./components/UserList";
import User from "./components/User";

const App = () => {
  const { initialize } = useBlogs();
  const { loadUserFromStorage, user, loadAllUsers } = useUser();
  const { logout } = useUserActions();

  useEffect(() => {
    initialize();
    loadUserFromStorage();
    loadAllUsers();
  }, [initialize, loadUserFromStorage, loadAllUsers]);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

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
              <Button color="inherit" component={Link} to="/users" sx={style}>
                users
              </Button>
            )}
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
          path="/users"
          element={
            <ErrorBoundary>
              <UserList />
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
              <LoginForm />
            </ErrorBoundary>
          }
        />
        <Route
          path="/blogs/:id"
          element={
            <ErrorBoundary>
              <Blog />
            </ErrorBoundary>
          }
        />
        <Route
          path="/users/:id"
          element={
            <ErrorBoundary>
              <User />
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
