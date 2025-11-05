import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <Container className="text-center mt-5">
      <h1>404</h1>
      <h2>Halaman Tidak Ditemukan</h2>
      <p className="lead">
        Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
      </p>
      <Button as={Link} to="/" variant="primary">
        Kembali ke Halaman Utama
      </Button>
    </Container>
  );
}

export default NotFound;