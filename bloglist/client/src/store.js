import { create } from "zustand";

const useNotificationStore = create((set) => ({
  message: "",
  severity: "info",
  displayNotification: (message, severity) => {
    set(() => ({ message, severity }));
    setTimeout(() => {
      set(() => ({ message: "", severity: "info" }));
    }, 5000);
  },
}));

export const useNotification = () => useNotificationStore();
