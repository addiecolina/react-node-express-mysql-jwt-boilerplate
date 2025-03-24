import axios from 'axios';

export const apiInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_PUBLIC_URL}`,
  timeout: 1000,
  validateStatus: function (status) {
    return status >= 200 && status < 600;
  },  
});

export const API_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  OPTIONS: 'OPTIONS',
} as const;
