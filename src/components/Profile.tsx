import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getProfile } from "../services/api";
import styles from "../styles/ProfileForm.module.css";

const Profile = () => {
  const [profile, setProfile] = useState({
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
    phoneNumber: ""
  });
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      const response = await getProfile(token as string);
      setProfile(response.data);
    };

    fetchProfile();
  }, []);

  const handleEdit = () => {
    router.push("edit-profile");
  };

  const handleConfirm = () => {
    router.push("/dashboard");
  };

  return (
    <div className={styles.authContainer}>
      <h1 className={styles.header}>Profile</h1>
      <div className={styles.profileDetails}>
        <div>
          <strong>Company Name:</strong> {profile.companyName}
        </div>
        <div>
          <strong>mobileNumber:</strong> {profile.mobileNumber}
        </div>
        <div>
          <strong>website:</strong> {profile.website}
        </div>
        <div>
          <strong>streetAddress:</strong> {profile.streetAddress}
        </div>
        <div>
          <strong>streetAddress2:</strong> {profile.streetAddress2}
        </div>
        <div>
          <strong>city:</strong> {profile.city}
        </div>
        <div>
          <strong>state:</strong> {profile.state}
        </div>
        <div>
          <strong>zipCode:</strong> {profile.zipCode}
        </div>
        <div>
          <strong>firstName:</strong> {profile.firstName}
        </div>
        <div>
          <strong>lastName:</strong> {profile.lastName}
        </div>
        <div>
          <strong>email:</strong> {profile.email}
        </div>
        <div>
          <strong>phoneNumber:</strong> {profile.phoneNumber}
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <button onClick={handleConfirm} className={styles.confirmButton}>
          Confirm
        </button>
        <button onClick={handleEdit} className={styles.editButton}>
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;
