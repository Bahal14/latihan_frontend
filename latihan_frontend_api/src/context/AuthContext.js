// File: src/context/AuthContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 1. Membuat Context
const AuthContext = createContext();

// 2. Membuat Provider (Komponen yang akan membungkus App)
export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true); // Status loading untuk cek token awal
  const navigate = useNavigate();

  // 3. Buat state 'isAuthenticated' berdasarkan 'token'
  const isAuthenticated = !!token;

  // 4. Cek token di localStorage saat aplikasi pertama kali dimuat
  // Kita set isLoading(false) untuk menandakan pengecekan selesai
  useEffect(() => {
    // Selesai loading saat komponen pertama kali mount
    setIsLoading(false); 
  }, []);

  // 5. Fungsi Login: simpan token ke state & localStorage, lalu navigasi
  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    navigate('/dashboard'); // Navigasi otomatis setelah login
  };

  // 6. Fungsi Logout: hapus token dari state & localStorage, lalu navigasi
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login'); // Navigasi otomatis setelah logout
  };

  // 7. Nilai yang akan dibagikan ke seluruh komponen "anak"
  const value = {
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  // Jangan render children jika masih loading
  if (isLoading) {
    return null; // Atau tampilkan spinner global
  }
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 8. Buat Custom Hook 'useAuth' untuk mempermudah penggunaan context
export const useAuth = () => {
  return useContext(AuthContext);
};