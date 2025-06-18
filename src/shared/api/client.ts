import axios from 'axios';

import {Configuration, DefaultApi as EventGraphApi} from '@/shared/api/event-graph-api';

export const API_URL =
  process.env.LOCAL_SERVER === 'true' ? process.env.LOCAL_SERVER_URL : process.env.CLOUD_SERVER_URL;

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

const apiConfig = new Configuration({
  basePath: API_URL,
});

export const apiClient = new EventGraphApi(apiConfig, API_URL, axiosClient);
