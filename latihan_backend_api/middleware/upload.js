// File: latihan_backend_api/middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Direktori tempat gambar akan disimpan
const UPLOADS_DIR = path.join(__dirname, '../public/uploads');

// Pastikan direktori uploads ada
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Konfigurasi penyimpanan untuk Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR); // Simpan file di folder public/uploads
  },
  filename: (req, file, cb) => {
    // Buat nama file unik: namafile-timestamp.ekstensi
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

// Filter jenis file yang diizinkan (opsional)
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif') {
    cb(null, true); // Terima file
  } else {
    cb(new Error('Hanya file gambar JPG, PNG, atau GIF yang diizinkan!'), false); // Tolak file
  }
};

// Inisialisasi Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5, // Batasi ukuran file hingga 5MB
  },
});

module.exports = upload;