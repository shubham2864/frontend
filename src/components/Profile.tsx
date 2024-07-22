import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getProfile } from "../services/api";
import styles from "../styles/ProfileForm.module.css";

const Profile = () => {
  const [profile, setProfile] = useState({
    userName: "",
    email: "",
    address: "",
    mobileNo: "",
    dateOfBirth: "",
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
        <div><strong>Username:</strong> {profile.userName}</div>
        <div><strong>Email:</strong> {profile.email}</div>
        <div><strong>Address:</strong> {profile.address}</div>
        <div><strong>Mobile No:</strong> {profile.mobileNo}</div>
        <div><strong>Date of Birth:</strong> {profile.dateOfBirth}</div>
      </div>
      <div className={styles.buttonContainer}>
        <button onClick={handleConfirm} className={styles.confirmButton}>Confirm</button>
        <button onClick={handleEdit} className={styles.editButton}>Edit Profile</button>
      </div>
    </div>
  );
};

export default Profile;
