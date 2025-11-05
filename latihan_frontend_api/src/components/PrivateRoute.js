import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spinner, Container } from 'react-bootstrap';

function PrivateRoute({ children }) {
    const { isAuthenticated, isLoading } = useAuth();

    // 1. Tampilkan loading spinner selagi context mengecek token
  if (isLoading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  // 2. Setelah loading selesai, cek status otentikasi
  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
