import axios from 'axios';
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

const api = axios.create({ baseURL: API_BASE });

export function setToken(token) {
  api.defaults.headers.common.Authorization = token ? `Bearer ${token}` : '';
}

export default api;
