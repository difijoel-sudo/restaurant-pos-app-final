import axios from 'axios';

const ApiClient = axios.create({
  baseURL: 'http://localhost:3000',
});

// We use an interceptor to add the JWT token to every request automatically.
ApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default ApiClient;