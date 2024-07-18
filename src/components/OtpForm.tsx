// src/pages/otp.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { verifyOtp } from "../services/api";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/OtpForm.module.css";

const OtpForm = () => {
  const [otp, setOtp] = useState("");
  const [chances, setChances] = useState(0);
  const router = useRouter();
  const { user, authenticate, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    // Timeout to redirect to login page if OTP not verified within 40 seconds
    timeoutId = setTimeout(() => {
      if (!localStorage.getItem("otpVerified")) {
        alert("OTP expired. Please login again.");
        logout(); // Logout user and clear authentication state
        router.push("/login"); // Redirect to login page
      }
    }, 40000); // 40 seconds timeout

    // Cleanup timeout on component unmount or rerender
    return () => clearTimeout(timeoutId);
  }, [logout, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const email = localStorage.getItem("email");
      if (!email) {
        throw new Error("Email not found");
      }

      const response = await verifyOtp(otp, email);
      localStorage.setItem("otpVerified", "true"); // Set OTP verification flag
      authenticate(); // Set isAuthenticated to true
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      setChances(chances + 1);
      alert(`Wrong OTP. ${3 - chances} chances left`);
      if (chances >= 2) {
        // If chances exceed 2, clear token and email and logout
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        logout();
      }
    }
  };

  return (
    <div className={styles.authContainer}>
      <h2>Enter OTP</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className={styles.inputField}
        />
        <button type="submit" className={styles.submitButton}>
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default OtpForm;
