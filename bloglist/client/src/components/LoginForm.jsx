import { useState } from "react";
import { useNotification, useUserActions } from "../store";
import { TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { displayNotification } = useNotification();
  const { login } = useUserActions();

  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    try {
      login({ username, password });
      setUsername("");
      setPassword("");
      navigate("/");
    } catch (error) {
      console.error(error);
      displayNotification("wrong username or password", "error");
    }
  };

  return (
    <>
      <h2>Login to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          <TextField
            label="username"
            type="text"
            onChange={({ target }) => setUsername(target.value)}
            value={username}
          />
        </div>
        <div>
          <TextField
            label="password"
            type="password"
            onChange={({ target }) => setPassword(target.value)}
            value={password}
            style={{ marginTop: 10 }}
          />
        </div>
        <div>
          <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
            login
          </Button>
        </div>
      </form>
    </>
  );
};

export default LoginForm;
