// ============================================================
// api.js — Pokkher central HTTP client
// Ei file e Axios diye ekta configured instance toiri kora hoyeche.
// Sob frontend component ekhon theke api.get(), api.post() etc call kore.
// Direct fetch use kora hoy ni — ekhane interceptor diye error handle kora soja hoy.
// ============================================================

import axios from 'axios';

// Base URL ta .env theke newa hocche (VITE_API_URL).
// Local development e http://localhost:8000/api/v1 use hobe.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  withCredentials: true, // Cookie based auth er jonno eta must — nahole session kaje asbena
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor — sob response er age ek jayga e error check kora hocche.
// Jodi backend theke error ashe (401, 403, 500 etc), ekhane message ta extract hobe.
api.interceptors.response.use(
  (response) => response, // Success hole sudhu response pass thru koro
  (error) => {
    // Full error object re-throw kora hocche, tai component gulo error.response.status check korte parbe
    const message = error.response?.data?.message || error.message || "Something went wrong";
    error.message = message; // message update kora hocche, kinto full error object keep korchi
    return Promise.reject(error);
  }
);

export default api;

