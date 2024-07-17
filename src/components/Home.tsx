// src/components/Home.tsx
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
      <h1>Welcome {userName ? `, ${userName}` : ''}</h1>
      <p>This is the home page.</p>
    </div>
  );
};

export default Home;
