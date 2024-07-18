import styles from '../styles/ProfileForm.module.css';

const ProfilePage = () => {

  return (
    <div className={styles.profileContainer}>
      <h2>Profile</h2>
      <form >
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          className={styles.inputField}
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          className={styles.inputField}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
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
