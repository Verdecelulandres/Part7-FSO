import { useState } from 'react';
import { TextField, Button } from '@mui/material';

const LoginForm = ({ login }) => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = event => {
    event.preventDefault();
    login({ username, password });
    setUsername('');
    setPassword('');
  }

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
}

export default LoginForm;