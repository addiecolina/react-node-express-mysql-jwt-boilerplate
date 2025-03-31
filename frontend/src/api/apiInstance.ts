import axios from 'axios';
import { v4 as uuidv4 } from "uuid";

export const apiInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_PUBLIC_URL}`,
  timeout: 1000,
  withCredentials: true,
  headers: {'X-Tracking-Id': uuidv4()},
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
