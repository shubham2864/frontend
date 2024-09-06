import '../styles/globals.css';
import type { AppProps } from "next/app";
import { AuthProvider } from "../context/AuthContext";
import withAuth from "../context/withAuth";
import Navbar from "../components/Navbar";
import { useRouter } from "next/router";
import { NextPage } from 'next';

const MyApp: NextPage<AppProps> = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const publicPaths = ["/login", "/register",  "/otp", "/verify-email", "/verified", "/"]; // Add public routes here
  const isPublicPage = publicPaths.includes(router.pathname);

  const ProtectedComponent = isPublicPage ? Component : withAuth(Component);

  return (
    <AuthProvider>
      <Navbar />
      <ProtectedComponent {...pageProps} />
    </AuthProvider>
  );
};

export default MyApp;
