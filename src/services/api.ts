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
 return await api.post("/user/signup", userData);
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
    await api.get(`/user/verify-email?token=${token}`);
  } catch (error) {
    console.error('Verification failed', error);
    throw new Error('Verification failed');
  }
}

export const requestOtp = async () => {
  return await api.post("/auth/request-otp");
};

export const verifyOtp = async (otp: string, email: string) => {
  return await api.post("/auth/verify-otp", { otp , email});
};

export const getProfile = async (token: any) => {
  console.log("hello`21233"+ token)
  return await api.get(`/user/profile`,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateProfile = async (userData: {
  userName?: string;
  address?: string;
  mobileNo?: string;
  dateOfBirth?: string;
},token: any) => {
  return await api.put("/user/profile", userData);
};


export const forgotPassword = async (email: string) => {
  return await api.post("/auth/forgot-password", { email });
};

export const resetPassword = async (token: string, newPassword: string) => {
  return await api.post("/auth/reset-password", { token, newPassword });
};