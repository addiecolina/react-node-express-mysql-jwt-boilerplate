import axios from 'axios';

export const apiInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_PUBLIC_URL}`,
});

export const API_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  OPTIONS: 'OPTIONS',
} as const;
