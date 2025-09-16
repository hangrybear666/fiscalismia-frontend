import axios from 'axios';
import { serverConfig } from '../resources/resource_properties';
import { toast } from 'react-toastify';
import { axiosErrorToastOptions } from '../utils/sharedFunctions';

const baseUrl = serverConfig.API_BASE_URL;

export const axiosClient = axios.create({
  baseURL: baseUrl
});

axiosClient.interceptors.response.use(
  (response) => {
    // this could be used to centrally log all axios backend responses
    return response;
  },
  (error) => {
    if (error instanceof Error) {
      toast.error(`Axios Interceptor - ${error.name}: ${error.message}`, axiosErrorToastOptions);
    } else {
      toast.error(`Axios Interceptor received undefined Error: ${error}`, axiosErrorToastOptions);
    }
    // Optionally, return a rejected promise to ensure `.catch` is triggered in individual requests
    return Promise.reject(error);
  }
);
