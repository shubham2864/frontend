import Link from "next/link";
import styles from "../styles/Navbar.module.css";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleProfileClick = () => {
    router.push("/profile");
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        {isAuthenticated && user ? (
          <img src="/icon.jpg" alt="Website Logo" style={{ width: 50 }} />
        ) : (
          <Link href="/">
              <img src="/icon.jpg" alt="Website Logo" style={{ width: 50 }} />
          </Link>
        )}
      </div>
      <ul className={styles.navLinks}>
        {isAuthenticated && user ? (
          <>
            <Link href="/profile" className={styles.navLink} onClick={handleProfileClick}>Profile
            </Link>
            <button onClick={logout} className={styles.logoutButton}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className={styles.navLink}> 
              Login
            </Link>
            <Link href="/register" className={styles.navLink}>Sign Up
            </Link>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
