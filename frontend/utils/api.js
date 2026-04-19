import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const DEMO_EMAIL = 'demo@healthai.local';
const DEMO_PASSWORD = 'Demo@123456';

export const ensureSession = async () => {
  if (typeof window === 'undefined') return null;

  let token = localStorage.getItem('token');
  if (token) return token;

  try {
    const loginRes = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
    });

    token = loginRes.data?.token;
  } catch (loginError) {
    await axios.post(`${API_BASE_URL}/api/auth/register`, {
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      firstName: 'Demo',
      lastName: 'User',
    });

    const loginRes = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
    });

    token = loginRes.data?.token;
  }

  if (token) {
    localStorage.setItem('token', token);
  }

  return token;
};

export const getApiClient = async () => {
  const token = await ensureSession();

  return axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};
