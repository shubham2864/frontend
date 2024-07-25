import React, { useState } from "react";
import { signUp } from "../services/api";
import { useRouter } from "next/router";
import styles from "../styles/RegisterForm.module.css";

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    mobileNumber: "",
    website: "",
    streetAddress: "",
    streetAddress2: "",
    city: "",
    state: "",
    zipCode: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    termsAccepted: false,
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const {
      companyName,
      mobileNumber,
      streetAddress,
      city,
      state,
      zipCode,
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      phoneNumber,
      termsAccepted,
    } = formData;

    if (
      !companyName ||
      !mobileNumber ||
      !streetAddress ||
      !city ||
      !state ||
      !zipCode ||
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !phoneNumber
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (!termsAccepted) {
      alert("Please accept the terms and conditions.");
      return;
    }

    try {
      const response = await signUp(formData);
      console.log("Registration successful:", response.data);
      localStorage.setItem("email", email);
      alert(
        "Registration successful. Please check your email for the verification link."
      );
      router.push("/login");
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className={styles.loginPageBackground}>
      <div className={styles.authContainer}>
        <h2>Create an Account</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h3>Tell us about your Insurance Agency:</h3>
          <input
            name="companyName"
            placeholder="Company Name"
            value={formData.companyName}
            onChange={handleChange}
            className={styles.inputField}
            required
          />
          <input
            name="mobileNumber"
            placeholder="Mobile Number"
            value={formData.mobileNumber}
            onChange={handleChange}
            className={styles.inputField}
            required
          />
          <input
            name="website"
            placeholder="Website (Optional)"
            value={formData.website}
            onChange={handleChange}
            className={styles.inputField}
          />
          <input
            name="streetAddress"
            placeholder="Street Address"
            value={formData.streetAddress}
            onChange={handleChange}
            className={styles.inputField}
            required
          />
          <input
            name="streetAddress2"
            placeholder="Street Address 2 (Optional)"
            value={formData.streetAddress2}
            onChange={handleChange}
            className={styles.inputField}
          />
          <input
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className={styles.inputField}
            required
          />
          <input
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            className={styles.inputField}
            required
          />
          <input
            name="zipCode"
            placeholder="Zip Code"
            value={formData.zipCode}
            onChange={handleChange}
            className={styles.inputField}
            required
          />
          <h3>Tell us about yourself:</h3>
          <input
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className={styles.inputField}
            required
          />
          <input
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className={styles.inputField}
            required
          />
          <input
            name="email"
            placeholder="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={styles.inputField}
            required
          />
          <input
            name="password"
            placeholder="Password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className={styles.inputField}
            required
          />
          <input
            name="confirmPassword"
            placeholder="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={styles.inputField}
            required
          />
          <input
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            className={styles.inputField}
            required
          />
          <label className={styles.termsLabel}>
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
            />
            I accept the terms and conditions
          </label>
          <button type="submit" className={styles.submitButton}>
            Submit
          </button>
          <div className={styles.linkContainer}>
            <a href="/login" className={styles.link}>
              Sign In
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
