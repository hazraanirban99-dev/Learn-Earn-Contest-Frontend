// ============================================================
// api.js — Pokkher central HTTP client
// Ei file e Axios diye ekta configured instance toiri kora hoyeche.
// Sob frontend component ekhon theke api.get(), api.post() etc call kore.
// Direct fetch use kora hoy ni — ekhane interceptor diye error handle kora soja hoy.
// ============================================================

import axios from 'axios';

// Base URL ta .env theke newa hocche (VITE_API_URL).
// Local development e http://localhost:8000/api/v1 use hobe.
const fallbackUrl = `${window.location.protocol}//${window.location.hostname}:8000/api/v1`;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || fallbackUrl,
  withCredentials: true, // Cookie based auth er jonno eta must — nahole session kaje asbena
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor — sob response er age ek jayga e error check kora hocche.
// Jodi backend theke error ashe (401, 403, 500 etc), ekhane message ta extract hobe.
// 401 Unauthorized hole access token expired dhore niye refresh token use kore automatic new token anar logic.

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// REQUEST INTERCEPTOR — Token localStorage theke niye sob request e inject kora hocche.
// Mobile browsers often block cross-origin httpOnly cookies, so we send the token
// via Authorization header as a reliable fallback that works on ALL devices.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token && !config.headers['Authorization']) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response, // Success hole sudhu response pass thru koro
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 (Unauthorized), we haven't retried this request yet, and it's NOT the login request!
    // Also check if the request explicitly asks to skip redirection (useful for session checks)
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/users/login' && !originalRequest._skipRedirect) {
      if (originalRequest.url === '/users/refresh-token') {
        const currentPath = window.location.pathname;
        if (currentPath !== '/login' && currentPath !== '/register' && !currentPath.startsWith('/password/reset')) {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // If already refreshing, wait for it to finish and then retry
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Refresh token er endpoint hit kore new tokens (HTTP Only Cookies) niye ashar request
        await api.post('/users/refresh-token');

        // Tokens asha successful hole queue the pending request gulo clear koro o original request retry dao
        processQueue(null);
        return api(originalRequest);
      } catch (err) {
        processQueue(err);
        // Refresh fail korle obosshoi abar login korte hobe (unless already on auth pages)
        const currentPath = window.location.pathname;
        if (currentPath !== '/login' && currentPath !== '/register' && !currentPath.startsWith('/password/reset')) {
          window.location.href = '/login';
        }
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // Default error handling for non-401 errors
    // Full error object re-throw kora hocche, tai component gulo error.response.status check korte parbe
    const message = error.response?.data?.message || error.message || "Something went wrong";
    error.message = message; // message update kora hocche, kinto full error object keep korchi
    return Promise.reject(error);
  }
);

export default api;
