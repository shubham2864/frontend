import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';

const Home = () => {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    // Fetch user's name from local storage
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  return (
    <div className={styles.homeContainer}>
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <h1 className={styles.welcomeMessage}>
          Welcome{userName ? `, ${userName}` : ''}
        </h1>
        <p className={styles.description}>This is the home page.</p>
        <button className={styles.exploreButton}>Explore</button>
      </div>
    </div>
  );
};

export default Home;
