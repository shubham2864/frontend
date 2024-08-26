import Link from "next/link";
import { useEffect, useState } from "react";
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
  faArrowAltCircleLeft,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "./Modal";
import { getCompanyDetails, getProfile } from "@/services/api";

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, companyDetails } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const hideNavbarRoutes = ["/otp", "/login", "/register"];
  const hideNavbar = hideNavbarRoutes.includes(router.pathname);

  const handleCreateClick = () => {
    setModalOpen(true);
  };
  
  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleModalSelect = (option: string) => {
    setModalOpen(false);
    if (option === "agreement") {
      router.push("/create");
    } else if (option === "subscription") {
      router.push("/subscription");
    } else if (option === "invoice") {
      router.push("/invoice");
    }
    setSidebarOpen(false);
  };

  if (hideNavbar) {
    return null;
  }

  return (
    <>
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
                  <FontAwesomeIcon
                    icon={faArrowAltCircleLeft}
                    style={{ color: "white" }}
                  />
                </button>
                <Link
                  href="/dashboard"
                  className={styles.sidebarLink}
                  onClick={() => setSidebarOpen(false)}
                >
                  <FontAwesomeIcon icon={faTachometerAlt} />
                  &nbsp;Dashboard
                </Link>
                <Link
                  href="/accounting"
                  className={styles.sidebarLink}
                  onClick={() => setSidebarOpen(false)}
                >
                  <FontAwesomeIcon icon={faFileInvoiceDollar} />
                  &nbsp;Accounting
                </Link>
                <div onClick={handleCreateClick} className={styles.sidebarLink}>
                  <FontAwesomeIcon icon={faPlusCircle} />
                  &nbsp;Create
                </div>
                <button onClick={logout} className={styles.logoutButton}>
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  &nbsp;Logout
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
              <p style={{ color: "white", cursor: "pointer" }}>
                {companyDetails?.companyName}
              </p>
            </div>
            <div className={styles.profileIcons}>
              <div className={styles.settingsIcon}>
                <img
                  src="/settings.png"
                  alt="Settings"
                  className={styles.settingsImage}
                  onClick={() => router.push("/settings")}
                />
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
            </div>
          </>
        ) : (
          <>
            <ul className={styles.navLinks}>
              <Link href="/login" className={styles.navLink}>
                Login
              </Link>
              <Link href="/register" className={styles.navLink}>
                Register
              </Link>
            </ul>
          </>
        )}
      </nav>
      <Modal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onSelect={handleModalSelect}
      />
    </>
  );
};

export default Navbar;
