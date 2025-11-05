import React, { useState } from 'react';
import api from '../api/api';
import { Form, Button, Card, Container, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  //   const navigate = useNavigate();
  const { login } = useAuth();

  const [notification, setNotification] = useState({
    show: false,
    message: '',
    variant: 'danger'
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    // Sembunyikan notifikasi jika pengguna mulai mengetik lagi
    if (notification.show) {
      setNotification({ show: false, message: '', variant: 'danger' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- 4. VALIDASI FRONTEND ---
    
    // Cek #1: Email atau password harus diisi
    if (!form.email || !form.password) {
      setNotification({
        show: true,
        message: 'Email dan password harus diisi.',
        variant: 'danger',
      });
      return; // Hentikan eksekusi
    }

    // Cek #4: Password kurang dari 6 karakter
    // (Sebaiknya validasi ini juga ada di backend)
    if (form.password.length < 8) {
      setNotification({
        show: true,
        message: 'Password minimal harus 8 karakter.',
        variant: 'danger',
      });
      return; // Hentikan eksekusi
    }

    // --- 5. PROSES LOGIN (PANGGILAN API) ---
    try {
      const res = await api.post('/auth/login', form);
        login(res.data.token); // (Tidak perlu notifikasi sukses, karena 'login' akan langsung navigasi)
    } catch(err) {
      // --- 6. NOTIFIKASI ERROR DARI BACKEND ---
      // Ini akan menangani Cek #2 (email tidak terdaftar) dan Cek #3 (password salah)
      // karena backend kita (authController) mengembalikan pesan yang sama.
      
      const message = err.response?.data?.message || 'Email atau password salah.';
      
      setNotification({
        show: true,
        message: message,
        variant: 'danger',
      });
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: '400px' }} className="p-4">
        <h4 className="text-center mb-3">Login</h4>
        {/* --- 7. TAMPILKAN KOMPONEN ALERT --- */}
        {notification.show && (
          <Alert
            variant={notification.variant}
            onClose={() => setNotification({ ...notification, show: false })}
            dismissible
          >
            {notification.message}
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
            />
          </Form.Group>
          <Button type="submit" className="w-100">Login</Button>
        </Form>
        {/* --- 3. TAMBAHKAN LINK KE REGISTER --- */}
        <p className="text-center mt-3">
          Belum punya akun? <Link to="/register">Daftar di sini</Link>
        </p>
      </Card>
    </Container>
  );
}

export default Login;
