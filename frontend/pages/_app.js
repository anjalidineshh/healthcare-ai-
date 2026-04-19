/**
 * Main App Wrapper
 * Location: frontend/pages/_app.js
 */

import React from 'react';
import Layout from '../components/Layout';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
