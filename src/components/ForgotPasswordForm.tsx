import React, { useState } from "react";
import { forgotPassword } from "../services/api";
import styles from "../styles/ForgotPasswordForm.module.css";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      alert("A reset password link has been sent to email.");
    } catch (error) {
      console.error(error);
      alert("Failed to send reset password email");
    }
  };

  return (
    <div className={styles.authContainer}>
      <h2 className={styles.header}>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.inputField}
        />
        <button type="submit" className={styles.submitButton}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
