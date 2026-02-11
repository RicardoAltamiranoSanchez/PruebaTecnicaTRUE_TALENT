import axios from 'axios';
import { TransactionCreate, PaginatedResponse, Transaction } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to include token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add interceptor to handle 401 errors (token expired/invalid)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/'; // Redirect to login
    }
    return Promise.reject(error);
  }
);

export const login = async (username: string, password: string) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    
    const response = await api.post('/auth/login', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const getTransactions = async (page: number = 1, size: number = 10): Promise<PaginatedResponse<Transaction>> => {
  const response = await api.get(`/transactions/?page=${page}&size=${size}`);
  return response.data;
};

export const createTransaction = async (data: TransactionCreate) => {
  const response = await api.post('/transactions/async-process', data);
  return response.data;
};

export const summarizeText = async (text: string) => {
  const response = await api.post('/assistant/summarize', { text });
  return response.data;
};

export const triggerRpa = async (searchTerm: string) => {
  const response = await api.post('/rpa/trigger', { search_term: searchTerm });
  return response.data;
};

export default api;
