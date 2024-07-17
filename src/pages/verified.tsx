import { useRouter } from 'next/router';

const VerifiedPage: React.FC = () => {
  const router = useRouter();

  const handleLoginRedirect = () => {
    router.push('/login');
  };

  return (
    <div>
      <h2>Your email has been verified!</h2>
      <button onClick={handleLoginRedirect}>Go to Login</button>
    </div>
  );
};

export default VerifiedPage;
