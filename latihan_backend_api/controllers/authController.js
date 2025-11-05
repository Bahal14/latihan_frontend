// controllers/authController.js
const { User } = require('../models'); // Asumsi Anda punya model Sequelize 'User'
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// --- Fungsi Register ---
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Validasi input (bisa ditambahkan nanti)
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nama, email, dan password diperlukan' });
    }

    // Cek #1: Minimal 8 karakter
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password minimal harus 8 karakter.' });
    }

    // Cek #2: Minimal 1 huruf besar (Kapital)
    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({ message: 'Password harus mengandung minimal 1 huruf besar.' });
    }

    // Cek #3: Minimal 1 angka
    if (!/\d/.test(password)) {
      return res.status(400).json({ message: 'Password harus mengandung minimal 1 angka.' });
    }

    // Cek #4: Minimal 1 karakter khusus
    if (!/[!@#$%^&*]/.test(password)) {
      return res.status(400).json({ message: 'Password harus mengandung minimal 1 karakter khusus (!@#$%^&*).' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 adalah salt rounds

    // Simpan ke database PostgreSQL via Sequelize
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword, // Simpan hash, bukan password asli
    });

    res.status(201).json({ 
      message: 'User registered successfully',
      user: { id: newUser.id, email: newUser.email }
    });
  } catch (error) {
    // Tangani error jika email sudah ada (dari 'UNIQUE' di database)
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Email sudah terdaftar' });
    }
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Cari user di database
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    // 2. Bandingkan password yang dikirim dengan hash di database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    // 3. Buat JWT Token
    const token = jwt.sign(
      { userId: user.id, email: user.email }, // Data yang disimpan di token
      process.env.JWT_SECRET, // Kunci rahasia dari file .env
      { expiresIn: '1h' } // Token akan kadaluwarsa dalam 1 jam
    );

    // 4. Kirim token ke frontend React
    res.json({ token }); // <-- INI YANG PALING KRUSIAL

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};