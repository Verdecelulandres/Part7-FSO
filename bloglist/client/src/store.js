import { create } from "zustand";
import blogService from "./services/blogs";

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

const useBlogStore = create((set) => ({
  blogs: [],
  initialize: async () => {
    const blogs = await blogService.getAll();
    console.log(blogs);
    set(() => ({ blogs }));
  },
  actions: {},
}));

export const useNotification = () => useNotificationStore();
export const useBlogs = () => useBlogStore();
