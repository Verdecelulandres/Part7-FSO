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
    removeBlog: async (id) => {
      try {
        await blogService.deleteBlog(id);
        set((state) => ({ blogs: state.blogs.filter((b) => b.id !== id) }));
      } catch (error) {
        console.error(error);
      }
    },
    findBlog: (id) => get().blogs.find((b) => b.id === id),
  },
}));

const userStorageStr = "blogAppUser";

const useUserStore = create((set) => ({
  user: {},
  loadUser: () => {
    const storedUser = window.localStorage.getItem(userStorageStr);
    if (storedUser) {
      const user = JSON.parse(storedUser);
      blogService.setToken(user.token);
      set(() => ({ user }));
    }
  },
  actions: {},
}));

export const useNotification = () => useNotificationStore();
export const useBlogs = () => useBlogStore();
export const useBlogActions = () => useBlogStore((state) => state.actions);
export const useUser = () => useUserStore();
