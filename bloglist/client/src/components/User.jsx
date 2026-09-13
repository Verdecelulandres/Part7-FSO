import { useMatch } from "react-router-dom";
import { useUserActions } from "../store";
import { Typography } from "@mui/material";

const User = () => {
  const { findUser } = useUserActions();
  const userMatch = useMatch("users/:id");

  const user = findUser(userMatch.params.id);

  const headerStyle = {
    margin: "1rem 0"
  }

  return (
    <div>
      <Typography variant="h5" sx={headerStyle}>{user.name}</Typography>
      <Typography variant="h6" sx={headerStyle}>added blogs</Typography>
      <ul>
        {user.blogs.map((b) => (
          <li key={b.id}>{b.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default User;
