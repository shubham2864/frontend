import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/router";
import { getCompanyDetails, getProfile } from "@/services/api";

interface User {
  email: string;
}
interface Company {
  _id: string;
  companyName: string;
  mobileNumber: string;
  streetAddress: string;
  streetAddress2?: string; // Optional
  city: string;
  state: string;
  zipCode: string;
  website?: string; // Optional
  taxId?: string; // Optional
  type?: string; // Optional
  jobTitle?: string; // Optional
  dateOfBirth?: string; // Optional
  socialSecurityNumber?: string; // Optional
  sAddress?: string; // Optional
  sCity?: string; // Optional
  sState?: string; // Optional
  sZipCode?: string; // Optional
  businessOwner?: Array<{
    firstName?: string; // Optional
    lastName?: string; // Optional
    email?: string; // Optional
    mobileNumber?: string; // Optional
  }>;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  authChecked: boolean;
  login: (email: string) => void;
  authenticate: () => void;
  logout: () => void;
  companyDetails: Company | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authChecked, setAuthChecked] = useState<boolean>(false); // New state to track auth check completion
  const [companyDetails, setCompanyDetails] = useState<Company | null>(null);
  const router = useRouter();

  useEffect(() => {
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");
    const otpVerified = localStorage.getItem("otpVerified");
    const currentPath = router.pathname;
    if (email && token) {
      setUser({ email });
      setIsAuthenticated(true);

      if (otpVerified === "true") {
        compDetails();
        if (currentPath === "/otp" || currentPath === "/login") {
          router.push("/dashboard");
        }
      } else {
        if (currentPath !== "/otp") {
          router.push("/otp");
        }
      }
    }
    setAuthChecked(true);
  }, []);

  const login = async (email: string) => {
    setUser({ email });
    localStorage.setItem("email", email);

    // Trigger company details fetch after login
    await compDetails();
  };

  const authenticate = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("otpVerified"); // Clear OTP verification flag
    router.push("/login");
  };

  const compDetails = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const data = await getProfile(token as string);
        const companyDetailsData = await getCompanyDetails(data.data.companyId);
        setCompanyDetails(companyDetailsData.data);
      } catch (error) {
        console.error("Failed to fetch company details:", error);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        authChecked,
        login,
        authenticate,
        logout,
        companyDetails,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
