import { useField } from "../hooks/index";
import { useNotification, useUserActions } from "../store";
import { TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {

  const username = useField("text");
  const password = useField("password");

  const { displayNotification } = useNotification();
  const { login } = useUserActions();

  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    try {
      login({ username: username.value, password: password.value });
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
            {...username}
          />
        </div>
        <div>
          <TextField
            label="password"
            style={{ marginTop: 10 }}
            {...password}
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
