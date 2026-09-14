import { useField } from "../hooks/index";
import { useNotification, useUserActions } from "../store";
import { TextField, Button, Typography } from "@mui/material";
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
      <Typography variant="h2" sx={{ margin: "1rem 0", fontSize: "32px" }}>Login to application</Typography>
      <form onSubmit={handleLogin}>
        <div>
          <TextField
            label="username"
            {...username.spreadable}
          />
        </div>
        <div>
          <TextField
            label="password"
            style={{ marginTop: 10 }}
            {...password.spreadable}
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
