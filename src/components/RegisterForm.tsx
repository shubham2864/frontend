import { useState } from 'react';
import { useRouter } from 'next/router';
import { signUp } from '@/services/api';
import styles from '../styles/RegisterForm.module.css';

const RegisterForm: React.FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    if (!acceptTerms) {
      alert('You must accept the terms and conditions');
      return;
    }
    try {
      const data = await signUp({ userName, email, password, confirmPassword });
      console.log(data)
      alert('Verification email sent. Please check your inbox.');
      router.push('/login');
    } catch (error) {
      console.error(error);
      alert('Failed to sign up');
    }
  };

  return (
    <div className={styles.authContainer}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="User Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className={styles.inputField}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.inputField}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.inputField}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={styles.inputField}
          required
        />
        <div className={styles.inputGroup}>
          <label>
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
            />
            I accept the terms and conditions
          </label>
        </div>
        <button type="submit" className={styles.submitButton}>
          Register
        </button>
        <div style={{ textAlign: 'right', margin: 10 }}>
          <a href='login' style={{ color: "black" }}>SignIN</a>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
