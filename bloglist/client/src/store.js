import { create } from "zustand";
import blogService from "./services/blogs";
import loginService from "./services/login";
import localUserService from "./services/persistentUser";

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

const useUserStore = create((set) => ({
  user: null,
  loadUser: () => {
    const storedUser = localUserService.getUser();
    if (storedUser) {
      const user = JSON.parse(storedUser);
      blogService.setToken(user.token);
      set(() => ({ user }));
    }
  },
  actions: {
    login: async (loginData) => {
      const user = await loginService.login(loginData);
      localUserService.saveUser(user);
      blogService.setToken(user.token);
      set(() => ({ user }));
    },
    logout: () => {
      localUserService.removeUser();
      blogService.setToken("");
      set(() => ({ user: null }));
    },
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
      const { username, name } = useUserStore.getState().user;
      const id = savedBlog.user;
      savedBlog.user = { id, username, name };
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

export const useNotification = () => useNotificationStore();
export const useBlogs = () => useBlogStore();
export const useBlogActions = () => useBlogStore((state) => state.actions);
export const useUser = () => useUserStore();
export const useUserActions = () => useUserStore((state) => state.actions);
