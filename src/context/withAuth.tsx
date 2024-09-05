import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { NextPage } from "next";

const withAuth = <P extends object>(WrappedComponent: NextPage<P>) => {
  const ComponentWithAuth = (props: P) => {
    const { isAuthenticated, authChecked } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (authChecked && !isAuthenticated) {
        router.push("/login");
      }
    }, [authChecked, isAuthenticated, router]);

    if (!authChecked) {
      return null; // Optionally return a loading spinner or some placeholder
    }

    return <WrappedComponent {...props} />;
  };

  // Copy getInitialProps so it works with SSR/SSG pages
  if (WrappedComponent.getInitialProps) {
    ComponentWithAuth.getInitialProps = WrappedComponent.getInitialProps;
  }

  return ComponentWithAuth;
};

export default withAuth;
