import { Alert } from '@mui/material';

const Notification = ({ message, isError }) => {
  // const baseClass = `notification ${isError ? 'error' : 'success'}`;
  const severity = isError ? 'error' : 'success';
  return (
    <Alert severity={severity}>{message}</Alert>
  );
}

export default Notification;