import { PendingCompanies } from "@/types/types";
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
  orgDetails: any,
  companyId: string
) => {
  const {
    companyName,
    mobileNumber,
    website,
    streetAddress,
    city,
    state,
    zipCode,
    taxId,
    type,
    businessOwner,
    isVerified,
  } = orgDetails;

  try {
    // Update organization details first
    await api.put(`/companies/${companyId}`, {
      companyName,
      mobileNumber,
      website,
      streetAddress,
      city,
      state,
      zipCode,
      taxId,
      type,
      isVerified,
    });

    // Update or create business owner details
    for (const owner of businessOwner) {
      try {
        // Attempt to find and update the user by email
        await api.put(`/user/${owner.email}`, {
          firstName: owner.firstName,
          lastName: owner.lastName,
          email: owner.email,
          mobileNumber: owner.mobileNumber,
          jobTitle: owner.jobTitle,
          dateOfBirth: owner.dateOfBirth,
          socialSecurityNumber: owner.socialSecurityNumber,
          sAddress: owner.sAddress,
          sCity: owner.sCity,
          sState: owner.sState,
          sZipCode: owner.sZipCode,
          companyId: companyId,
        });
      } catch (error) {
        if (error instanceof Error) {
          // If user is not found, create a new user
          await api.post(`/user/newUser`, {
            firstName: owner.firstName,
            lastName: owner.lastName,
            email: owner.email,
            phoneNumber: owner.mobileNumber,
            jobTitle: owner.jobTitle,
            dateOfBirth: owner.dateOfBirth,
            socialSecurityNumber: owner.socialSecurityNumber,
            sAddress: owner.sAddress,
            sCity: owner.sCity,
            sState: owner.sState,
            sZipCode: owner.sZipCode,
            password: "Shubham@2003",
            confirmPassword: "Shubham@2003",
            companyId: companyId,
          });
        } else {
          console.error(
            `Failed to update or create user ${owner.email}:`,
            error
          );
        }
      }
    }
  } catch (error) {
    console.error("Error updating details:", error);
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
    const response = await api.get(`/bank-details/${companyId}`);
    console.log(response.data, "ITS BANK DETAILS RESPONSE FROM GET API");
    return response.data;
  } catch (error) {
    console.error("Error getting company details:", error);
    throw error;
  }
};

export const editBankDetails = async (companyId: any, formData: FormData) => {
  try {
    const response = await api.put(`/bank-details/${companyId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating bank details:", error);
    throw error;
  }
};

export const getPendingCompanies = async (): Promise<PendingCompanies> => {
  try {
    console.log("");
    const response = await api.get("/companies/pending");
    console.log(response.data + "its all companies till date");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch pending companies", error);
    throw new Error("Failed to fetch pending companies");
  }
};

export const verifyCompany = async (companyId: string) => {
  try {
    const response = await api.put(`/companies/${companyId}`, {
      isVerified: true,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to verify company", error);
    throw new Error("Failed to verify company");
  }
};

export const sendApprovalRequest = async (formData: any) => {
  try {
    const response = await api.post(`/admin/approval`, formData);
    return response.data; // Assuming response data contains approval status
  } catch (error) {
    console.error("Error sending approval request:", error);
    throw error;
  }
};

export const getAgreementByEmail = async (email: string) => {
  try {
    const response = await api.get(`/agreement/${email}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching agreement by email", error);
    throw error;
  }
};

export const sendTemplateEmail = async (id: any) => {
  try {
    const response = await api.post(`/agreement/templateEmail/${id}`);
    alert("email sent successfully!!!");
    return response.data;
  } catch (error) {
    console.error("Error fetching agreement by email", error);
    throw error;
  }
};

export const fetchAgreementData = async (userId: string) => {
  try {
    const response = await api.get(`/agreement/id/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const getPDF = async (userData: any) => {
  const response = await api.post("/pdf", userData, { responseType: "blob" }); // Set responseType to 'blob'
  return response; // This response will now contain the Blob data
};
