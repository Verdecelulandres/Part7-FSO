import { useNotification } from "../store";
import { Alert } from "@mui/material";

const Notification = () => {
  const { message, severity } = useNotification();

  if (message === "") {
    return <></>;
  }
  return <Alert severity={severity}>{message}</Alert>;
};

export default Notification;
