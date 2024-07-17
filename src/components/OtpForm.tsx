import { useState } from "react";
import { useRouter } from "next/router";
import { verifyOtp } from "../services/api";
import styles from "../styles/OtpForm.module.css";

const OtpForm = () => {
  const [otp, setOtp] = useState("");
  const [chances, setChances] = useState(0)
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const email = localStorage.getItem("email");
      const token = localStorage.getItem("token")
      
      if (!email) {
        throw new Error("Email not found");
      }
      const response = await verifyOtp(otp, email);
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      setChances(chances+1);
      alert(`Wrong Otp. ${3-chances} chances left` );
      if(chances > 2){
        localStorage.removeItem("token")
        localStorage.removeItem("email")
        router.push("login")
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
