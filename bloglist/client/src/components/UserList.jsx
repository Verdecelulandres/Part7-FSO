import {
  Typography,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
} from "@mui/material";

const UserList = () => {
  const headerStyle = {
    margin: "1.5rem 0",
  };
  return (
    <div>
      <Typography className="page-title" variant="h4" sx={headerStyle}>
        Users
      </Typography>
      <Table>
        <TableHead></TableHead>
        <TableBody></TableBody>
      </Table>
    </div>
  );
};

export default UserList;
