const userStorageStr = "blogAppUser";

const getUser = () => window.localStorage.getItem(userStorageStr);
const saveUser = (user) => {
  window.localStorage.setItem(userStorageStr, JSON.stringify(user));
};
const removeUser = () => {
  window.localStorage.removeItem(userStorageStr);
};

export default { getUser, saveUser, removeUser };
