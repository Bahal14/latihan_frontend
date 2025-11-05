require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes
const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // <--- ini untuk FormData

// <--- BAGIAN INI UNTUK MELAYANI FILE STATIS
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
// Anda juga bisa melayani folder public secara keseluruhan jika ada file lain
app.use(express.static(path.join(__dirname, 'public')));
// --- AKHIR BAGIAN STATIS ---

// Gunakan Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes); // <-- PENTING UNTUK DASHBOARD

app.listen(PORT, () => {
  console.log(`Server API berjalan di http://localhost:${PORT}`);
});
