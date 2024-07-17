import React, { useState } from "react";
import { useRouter } from "next/router";
import { login } from "../services/api";
import styles from "../styles/LoginForm.module.css";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login({ email, password });
      if (response.data.access_token) {
        localStorage.setItem("email", email);
        localStorage.setItem("token", response.data.access_token);
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
        <div style={{ textAlign: "right", margin: 10 }}>
          <a href="register" style={{ color: "black" }}>
            SignUp
          </a>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
