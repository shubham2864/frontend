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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If the token has expired, log the user out
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("otpVerified");
      // Redirect to login
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const signUp = async (formData: any) => {
  const {
    companyName,
    mobileNumber,
    website,
    streetAddress,
    streetAddress2,
    city,
    state,
    zipCode,
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    confirmPassword,
  } = formData;

  let companyId = null;
  // Step 1: Register the company
  try {
    // Step 1: Register the company
    const companyResponse = await api.post("/companies/register", {
      companyName,
      mobileNumber,
      website,
      streetAddress,
      streetAddress2,
      city,
      state,
      zipCode,
      adminEmail: email,
    });

    companyId = companyResponse.data._id;

    // Step 2: Register the user with the returned companyId
    const userResponse = await api.post("/user/signup", {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      confirmPassword,
      companyId,
    });

    return userResponse;
  } catch (error) {
    console.error("Error during registration:", error);

    // If user registration fails, delete the company to roll back
    if (companyId) {
      await api.delete(`/companies/${companyId}`);
      console.log(`Rolled back company creation with ID: ${companyId}`);
    }

    // Rethrow the error to be handled by the caller
    throw error;
  }
};

export const newUser = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  role: string;
  companyId: string;
}) => {
  console.log("newUser Signup is " + userData.firstName);
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
    console.error("Verification failed", error);
    throw new Error("Verification failed");
  }
};

export const requestOtp = async () => {
  return await api.post("/auth/request-otp");
};

export const verifyOtp = async (otp: string, email: string) => {
  return await api.post("/auth/verify-otp", { otp, email });
};

export const getProfile = async (token: any) => {
  console.log("hello3" + token);
  return await api.get(`/user/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getCompanyDetails = async (companyId: string) => {
  console.log("CompanyId" + companyId);
  return await api.get(`/companies/${companyId}`);
};

export const getSingleProfile = async (email: any) => {
  console.log("helloEMAILLL " + email);
  const response = await api.get(`/user/${email}`);
  console.log("Customer details: ", response);
  return response.data;
};

export const updateProfile = async (
  userData: {
    companyName?: string;
    mobileNumber?: string;
    website?: string;
    streetAddress?: string;
    streetAddress2?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    firstName?: string;
    lastName?: string;
    // email?: string;
    password?: string;
    confirmPassword?: string;
    phoneNumber?: string;
  },
  token?: any
) => {
  console.log("ITSSSSS USER DATTATATA", userData);
  return await api.put("/user/profile", userData);
};

export const forgotPassword = async (email: string) => {
  return await api.post("/auth/forgot-password", { email });
};

export const resetPassword = async (token: string, newPassword: string) => {
  return await api.post("/auth/reset-password", { token, newPassword });
};

export const getUsers = async (token: string) => {
  console.log("getUsers function called");
  try {
    const response = await api.get("/admin/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:");
    throw error;
  }
};

export const deleteUser = async (userId: string) => {
  return await api.delete(`/admin/users/${userId}`);
};

export const fetchCustomerSuggestions = async (email: string) => {
  console.log(email);
  const response = await api.get(`/user?email=${email}`);
  return response.data;
};

export const fetchCustomerDetails = async (email: string) => {
  console.log(email);
  const response = await api.get(`/user/${email}`);
  console.log(response + "hello");
  return response.data;
};

export const updateCompanyDetails = async (
  orgDetails: {
    companyName?: string;
    mobileNumber?: string;
    website?: string;
    streetAddress?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    taxId?: string;
    type?: string;
    businessOwner?: Array<{
      firstName?: string;
      lastName?: string;
      email?: string;
      mobileNumber?: string;
      jobTitle?: string;
      dateOfBirth?: string;
      socialSecurityNumber?: string;
      sAddress?: string;
      sCity?: string;
      sState?: string;
      sZipCode?: string;
    }>;
  },
  companyId: string
) => {
  try {
    const response = await api.put(`/companies/${companyId}`, orgDetails);
    return response.data;
  } catch (error) {
    console.error("Error updating company details:", error);
    throw error;
  }
};

export const registerBankDetails = async (
  bankDetails: {
    accountTypeOperational: string;
    operationalAccountHolderName: string;
    operationalAccountNumber: string;
    operationalRoutingNumber: string;
    accountTypeTrust: string;
    trustAccountHolderName: string;
    trustAccountNumber: string;
    trustRoutingNumber: string;
    sameAsOperational: boolean;
    oneTimePaymentAccount: string;
  },
  companyId: string
) => {
  try {
    console.log(bankDetails);
    const response = await api.post(`/bank-details/${companyId}`, bankDetails);
    return response.data;
  } catch (error) {
    console.error("Error updating company details:", error);
    throw error;
  }
};

export const getBankDetails = async (companyId: any) => {
  try {
    const response = await api.get(`/bank-details/${companyId}`)
    console.log(response.data , "ITS BANK DETAILS RESPONSE FROM GET API")
    return response.data;
  } catch (error) {
    console.error("Error getting company details:", error);
    throw error;
  }
}
