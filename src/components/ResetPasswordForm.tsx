import React, { useState } from "react";
import { useRouter } from "next/router";
import { resetPassword } from "../services/api";
import styles from "../styles/ResetPasswordForm.module.css";

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const { token } = router.query;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await resetPassword(token as string, password);
      alert("Password reset successfully");
      router.push("/login");
    } catch (error) {
      console.error(error);
      alert("Failed to reset password");
    }
  };

  return (
    <div className={styles.authContainer}>
      <h2 className={styles.header}>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.inputField}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={styles.inputField}
        />
        <button type="submit" className={styles.submitButton}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
