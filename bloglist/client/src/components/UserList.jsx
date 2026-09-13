import {
  Typography,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
} from "@mui/material";

import { useUser } from "../store";
import { Link } from "react-router-dom";

const UserList = () => {
  const { userList } = useUser();

  const headerStyle = {
    margin: "1.5rem 0",
  };

  const tableStyle = {
    minWidth: "650px",
  };

  const tableHeaderStyle = {
    fontWeight: "bold",
  };

  if (userList.length === 0) {
    return <p>No users yet</p>;
  }

  return (
    <div>
      <Typography className="page-title" variant="h4" sx={headerStyle}>
        Users
      </Typography>
      <Table sx={tableStyle}>
        <TableHead sx={tableHeaderStyle}>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Blogs created</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {userList.map((u) => (
            <TableRow key={u.id}>
              <TableCell>
                <Link className="user-link" to={`/users/${u.id}`}>
                  {u.name}
                </Link>
              </TableCell>
              <TableCell>{u.username}</TableCell>
              <TableCell>{u.blogs.length}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserList;
