import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { verifyEmail } from '@/services/api';

const VerifyEmail: React.FC = () => {
  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    const verifyUserEmail = async () => {
      try {
        if (token) {
            console.log("1")
          await verifyEmail(token as string);
          router.push('/verified');
        }
      } catch (error) {
        console.error('Verification failed', error);
        alert('Verification failed. Please try again.');
      }
    };

    verifyUserEmail();
  }, [token]);

  return (
    <div>
      <h2>Verifying your email...</h2>
    </div>
  );
};

export default VerifyEmail;
