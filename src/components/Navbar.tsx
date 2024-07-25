import Link from "next/link";
import { useState } from "react";
import styles from "../styles/Navbar.module.css";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faFileInvoiceDollar,
  faPlusCircle,
  faBars,
  faSignOutAlt,
  faTimes,
  faBackward,
  faArrowCircleLeft,
} from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const hideNavbarRoutes = ["/otp", "/login", "/register"];
  const hideNavbar = hideNavbarRoutes.includes(router.pathname);

  if (hideNavbar) {
    return null;
  }

  return (
    <nav className={styles.navbar}>
      {isAuthenticated && user ? (
        <>
          <div
            className={`${styles.sidebar} ${sidebarOpen ? styles.open : ""}`}
          >
            <div className={styles.sidebarContent}>
              <button
                className={styles.closeBtn}
                onClick={() => setSidebarOpen(false)}
              >
                <FontAwesomeIcon icon={faArrowCircleLeft} style={{color: "black"}} />
              </button>
              <Link href="/dashboard" onClick={() => setSidebarOpen(false)}>
                <div className={styles.sidebarLink}>
                  <FontAwesomeIcon icon={faTachometerAlt} />
                  Dashboard
                </div>
              </Link>
              <Link href="/dashboard" onClick={() => setSidebarOpen(false)}>
                <div className={styles.sidebarLink}>
                  <FontAwesomeIcon icon={faFileInvoiceDollar} />
                  Accounting
                </div>
              </Link>
              <Link href="/dashboard" onClick={() => setSidebarOpen(false)}>
                <div className={styles.sidebarLink}>
                  <FontAwesomeIcon icon={faPlusCircle} />
                  Create
                </div>
              </Link>
              <button onClick={logout} className={styles.logoutButton}>
                <FontAwesomeIcon icon={faSignOutAlt} />
                Logout
              </button>
            </div>
          </div>
          <div
            className={styles.sidebarToggle}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FontAwesomeIcon icon={faBars} />
          </div>
          <div
            className={styles.brand}
            onClick={() => router.push("/dashboard")}
          >
            <p style={{ color: "white", cursor: "pointer" }}>ABC Insurance</p>
          </div>
          <div
            className={styles.profileIcon}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <img
              src="/userIcon.png"
              alt="User Profile"
              className={styles.profileImage}
            />
            {dropdownOpen && (
              <div className={styles.dropdownMenu}>
                <Link href="/profile" className={styles.dropdownLink}>
                  Profile
                </Link>
                <Link href="/dashboard" className={styles.dropdownLink}>
                  Dashboard
                </Link>
                <button onClick={logout} className={styles.dropdownLink}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className={styles.logo}>
            <Link href="/">
              <img src="/icon.jpg" alt="Website Logo" />
            </Link>
          </div>
          <ul className={styles.navLinks}>
            <Link href="/login" className={styles.navLink}>
              Login
            </Link>
            <Link href="/register" className={styles.navLink}>
              Sign Up
            </Link>
          </ul>
        </>
      )}
    </nav>
  );
};

export default Navbar;
