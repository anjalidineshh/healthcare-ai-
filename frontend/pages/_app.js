/**
 * Main App Wrapper
 * Location: frontend/pages/_app.js
 */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import '../styles/globals.css';
import { getStoredToken } from '../utils/api';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const publicRoutes = ['/', '/login', '/register'];
  const isPublicRoute = publicRoutes.includes(router.pathname);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const token = getStoredToken();

    if (!token && !isPublicRoute) {
      router.replace('/login');
      return;
    }

    if (token && isPublicRoute) {
      router.replace('/dashboard');
      return;
    }

    setIsReady(true);
  }, [router.pathname]);

  if (!isReady) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;
  }

  if (isPublicRoute) {
    return <Component {...pageProps} />;
  }

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
