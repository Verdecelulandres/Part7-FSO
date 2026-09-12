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

const useBlogStore = create((set, get) => ({
  blogs: [],
  initialize: async () => {
    const blogs = await blogService.getAll();
    set(() => ({ blogs }));
  },
  actions: {
    createBlog: async (newBlog) => {
      const savedBlog = await blogService.create(newBlog);
      set((state) => ({ blogs: [...state.blogs, savedBlog] }));
    },
    likeBlog: async (updatedBlog) => {
      try {
        const likedBlog = await blogService.like(updatedBlog);
        set((state) => ({
          blogs: state.blogs.map((b) =>
            b.id === likedBlog.id ? { ...b, likes: ++b.likes } : b,
          ),
        }));
      } catch (error) {
        console.error(error);
      }
    },
    findBlog: (id) => get().blogs.find((b) => b.id === id),
  },
}));

export const useNotification = () => useNotificationStore();
export const useBlogs = () => useBlogStore();
export const useBlogActions = () => useBlogStore((state) => state.actions);
