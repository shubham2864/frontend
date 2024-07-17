import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getProfile, updateProfile } from '../services/api';
import styles from '../styles/ProfileForm.module.css';

const ProfilePage = () => {
  const [profileData, setProfileData] = useState({
    fullName: '',
    username: '',
    email: '',
    // Add other fields as necessary
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        setProfileData(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        router.push('/login');
      }
    };
    fetchProfile();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(profileData);
      alert('Profile updated successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to update profile');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <h2>Profile</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={profileData.fullName}
          onChange={handleChange}
          className={styles.inputField}
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={profileData.username}
          onChange={handleChange}
          className={styles.inputField}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={profileData.email}
          onChange={handleChange}
          className={styles.inputField}
        />
        <button type="submit" className={styles.submitButton}>
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
