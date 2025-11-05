import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import NotFound from './pages/NotFound';
import AppNavbar from './components/Navbar';
import { useAuth } from './context/AuthContext';

// Komponen helper untuk rute root '/'
function RootRedirect() {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <h3 className="text-center mt-5">Loading...</h3>; // Atau spinner
  }
  
  // Arahkan ke dashboard jika login, atau ke login jika tidak
  return isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
}

function App() {
  return (
    <>
    <AppNavbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        {/* Arahkan root ke login jika tidak ada token, atau dashboard jika ada */}
        {/* <Route 
          path="/" 
          element={localStorage.getItem('token') ? <Dashboard /> : <Login />} 
        /> */}
        <Route path="/" element={<RootRedirect />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
