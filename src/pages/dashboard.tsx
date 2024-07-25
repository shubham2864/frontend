import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/Dashboard.module.css";

const Dashboard: React.FC = () => {
  const { user, isAuthenticated, authChecked } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authChecked) { // Wait for the auth check to complete
      const token = localStorage.getItem('token');
      if (!token || !isAuthenticated) {
        router.push("/login");
      }
    }
  }, [authChecked, isAuthenticated, router]);

  const navigateToProfile = () => {
    router.push("/profile");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Welcome to Your Dashboard</h1>
      {user && <p className={styles.userInfo}>Logged in as: {user.email}</p>}
    </div>
  );
};

export default Dashboard;
