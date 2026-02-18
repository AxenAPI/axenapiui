import axios from 'axios';

import { Configuration } from '@shared/openapi';

import { setupErrorInterceptor } from './interceptors/errorInterceptor';

export const API_URL =
  process.env.LOCAL_SERVER === 'true' ? process.env.LOCAL_SERVER_URL : process.env.CLOUD_SERVER_URL;

export const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Настраиваем interceptor для автоматической обработки ошибок
axiosClient.interceptors.response.use(undefined, setupErrorInterceptor);

export const getApiConfig = () =>
  new Configuration({
    basePath: API_URL,
  });
