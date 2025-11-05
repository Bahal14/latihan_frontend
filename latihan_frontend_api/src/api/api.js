import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // mengarah ke backend di port 5000
});

// Interceptor untuk otomatis menambahkan token ke setiap request
api.interceptors.request.use(
  (config) => {
    // Ambil token dari localStorage
    const token = localStorage.getItem('token');
    
    // Jika token ada, tambahkan ke header Authorization
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
