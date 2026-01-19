import API from "./api";

const register = async (userData) => {
  const response = await API.post("/auth/register", userData);
  return response.data;
};

const login = async (credentials) => {
  const response = await API.post("/auth/login", credentials);
  return response.data;
};

export { register, login };
