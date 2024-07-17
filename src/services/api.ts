import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const signUp = async (userData: {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
 const h = await api.post("/user/signup", userData);
 console.log("signup done23" + h)
 return h
};

export const login = async (credentials: {
  email: string;
  password: string;
}) => {
  return await api.post("/auth/login", credentials);
};

export const verifyEmail = async (token: string) => {
  console.log("VERIFY EMAIL CALLING");
  try {
    console.log("This is your token :" + token)
    // localStorage.setItem('token',token);
    await api.get(`/user/verify-email?token=${token}`);
    console.log("USER VERIFIED SUCCESSFULLY")
  } catch (error) {
    console.error('Verification failed', error);
    throw new Error('Verification failed');
  }
}

export const getProfile = async () => {
  return await api.get("/user/profile");
};

export const updateProfile = async (userData: {
  fullName: string;
  username: string;
  email: string;
}) => {
  return await api.put("/user/profile", userData);
};

export const requestOtp = async () => {
  return await api.post("/auth/request-otp");
};

export const verifyOtp = async (otp: string, email: string) => {
  return await api.post("/auth/verify-otp", { otp , email});
};