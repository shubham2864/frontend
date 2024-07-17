// src/components/Navbar.tsx
import Link from "next/link";
import styles from "../styles/Navbar.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = async () => {
    // await logout();
    setIsLoggedIn(false);
    router.push('/login');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <a href="/">
          <img src="/icon.jpg" alt="Website Logo" style={{ width: 50 }} />
        </a>
      </div>
      <ul className={styles.navLinks}>
        <li>
          <Link href="/login">Login</Link>
        </li>
        <li>
          <Link href="/register">Register</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
