import axios from 'axios';

// Prefer explicit backend URL via env in all environments; fallback to same-origin '/api'
const API_BASE = import.meta.env.VITE_REACT_APP_BACKEND_URL
  ? `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api`
  : '/api';

export const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});