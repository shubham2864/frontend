import React, { useState } from "react";
import { useRouter } from "next/router";
import { login as apiLogin } from "../services/api";
import styles from "../styles/LoginForm.module.css";
import { useAuth } from "@/context/AuthContext";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiLogin({ email, password });
      if (response.data.access_token) {
        localStorage.setItem("email", email);
        localStorage.setItem("token", response.data.access_token);
        login(email);
        setIsOtpSent(true);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to login");
    }
  };

  // Redirect to OTP page
  if (isOtpSent) {
    router.push("/otp");
  }

  return (
    <div className={styles.loginPageBackground}>
      <div className={styles.authContainer}>
        <h2 className={styles.header}>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.inputField}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.inputField}
          />
          <button type="submit" className={styles.submitButton}>
            Login
          </button>
          <div className={styles.linkContainer}>
            <a href="forgot-password" className={styles.link}>
              Forgot Password
            </a>
          </div>
          <div className={styles.linkContainer}>
            <a href="register" className={styles.link}>
              Sign Up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
