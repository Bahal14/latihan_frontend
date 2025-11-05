// File ini PENTING untuk melindungi rute CRUD
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Ambil token dari header Authorization
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'Akses ditolak. Tidak ada token.' });
  }

  // Cek format token (Harus "Bearer <token>")
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Format token salah.' });
  }

  try {
    // Verifikasi token menggunakan JWT_SECRET dari .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Simpan data user (dari token) ke request object
    next(); // Lanjutkan ke controller
  } catch (ex) {
    res.status(400).json({ message: 'Token tidak valid.' });
  }
};