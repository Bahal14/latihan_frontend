import React, { useState } from 'react';
import api from '../api/api';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Card, Container, Alert, FormText, InputGroup } from 'react-bootstrap';
import { EyeFill, EyeSlashFill } from 'react-bootstrap-icons';

// Fungsi helper kecil untuk UI validasi
const ValidationItem = ({ valid, text }) => (
  <FormText className={valid ? 'text-success' : 'text-danger'}>
    {valid ? '✓' : '✗'} {text}
  </FormText>
);

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();
  // const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  // --- STATE BARU UNTUK NOTIFIKASI ---
  const [notification, setNotification] = useState({ 
    show: false, 
    message: '', 
    variant: 'danger' // 'danger' (merah) atau 'success' (hijau)
  });

  // State baru untuk melacak kriteria password secara individual
  const [validation, setValidation] = useState({
    minLength: false,
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecial: false,
  });
  // State untuk tahu kapan harus mulai menunjukkan error (setelah diketik)
  const [passwordTouched, setPasswordTouched] = useState(false);

  // 3. State baru untuk 'show/hide' password
  const [showPassword, setShowPassword] = useState(false);

  // Regex untuk validasi (lebih mudah dibaca terpisah)
  const REGEX_UPPER = /[A-Z]/;
  const REGEX_LOWER = /[a-z]/;
  const REGEX_NUMBER = /\d/; // sama dengan [0-9]
  const REGEX_SPECIAL = /[!@#$%^&*]/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (notification.show) {
      setNotification({ show: false, message: '', variant: 'danger' });
    }

    if (name === 'password') {
      setPasswordTouched(true); // Mulai tampilkan feedback
      setValidation({
        minLength: value.length >= 8,
        hasUpper: REGEX_UPPER.test(value),
        hasLower: REGEX_LOWER.test(value),
        hasNumber: REGEX_NUMBER.test(value),
        hasSpecial: REGEX_SPECIAL.test(value),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- VALIDASI FRONTEND DIMULAI ---
  // 5. Validasi di 'handleSubmit' sekarang lebih bersih
    // Cek field kosong
    if (!form.name || !form.email || !form.password) {
      setNotification({ show: true, message: 'Semua field wajib diisi!', variant: 'danger' });
      return; 
    }
    
    // Cek apakah semua kriteria di state 'validation' sudah true
    const allValid = Object.values(validation).every(Boolean); // 'every(Boolean)' cek jika semua true

    if (!allValid) {
      setNotification({ 
        show: true, 
        message: 'Password belum memenuhi syarat seperti minimal 8 karakter diantaranya huruf besar, huruf kecil, angka, dan karakter khusus.', 
        variant: 'danger' 
      });
      return;
    }

  // if (form.password.length < 6) {
  //   setNotification({ show: true, message: 'Password minimal harus 6 karakter.', variant: 'danger' });
  //   return;
  // }
  // --- VALIDASI FRONTEND SELESAI ---

    try {
      await api.post('/auth/register', form);
      
      setNotification({ 
        show: true, 
        message: 'Registrasi berhasil! Mengarahkan ke login...', 
        variant: 'success' 
      });
      
      // Beri jeda 2 detik agar pengguna bisa baca notif
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      // Ambil pesan error dari backend jika ada
      const message = err.response?.data?.message || 'Registrasi gagal. Silakan coba lagi.';
      setNotification({ show: true, message: message, variant: 'danger' });
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: '400px' }} className="p-4">
        <h4 className="text-center mb-3">Register</h4>
        {/* --- KOMPONEN ALERT DI SINI --- */}
        {notification.show && (
          <Alert 
            variant={notification.variant}
            onClose={() => setNotification({ ...notification, show: false })}
            dismissible // Agar bisa ditutup manual
          >
            {notification.message}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              name="name"
              placeholder="Nama Lengkap"
              value={form.name}
              onChange={handleChange}
            />
          </Form.Group>
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
            <InputGroup>
            <Form.Control
              name="password"
              // Ganti 'type' berdasarkan state
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
            />
            <Button 
                variant="outline-secondary" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {/* Tampilkan ikon yang sesuai */}
                {showPassword ? <EyeSlashFill /> : <EyeFill />}
              </Button>
              </InputGroup>
              
            {/* Tampilkan feedback HANYA jika pengguna sudah mengetik di password */}
            {passwordTouched && (
              <div className="mt-2">
                <ValidationItem valid={validation.minLength} text="Minimal 8 karakter" />
                <br />
                <ValidationItem valid={validation.hasLower} text="Minimal 1 huruf kecil" />
                <br />
                <ValidationItem valid={validation.hasUpper} text="Minimal 1 huruf besar (Kapital)" />
                <br />
                <ValidationItem valid={validation.hasNumber} text="Minimal 1 angka" />
                <br />
                <ValidationItem valid={validation.hasSpecial} text="Minimal 1 karakter khusus (!@#$%^&*)" />
              </div>
            )}
          </Form.Group>
          <Button type="submit" className="w-100">Register</Button>
        </Form>
        {/* --- 3. TAMBAHKAN LINK KE LOGIN --- */}
        <p className="text-center mt-3">
          Sudah punya akun? <Link to="/login">Masuk di sini</Link>
        </p>
      </Card>
    </Container>
  );
}

export default Register;
