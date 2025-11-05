const { Item, sequelize } = require('../models'); // Asumsi model Item Anda
const { Op } = require('sequelize'); // <--- IMPORT OPERATOR
const fs = require('fs'); // Tambahkan ini untuk menghapus file
const path = require('path'); // Tambahkan ini untuk path

// Direktori uploads (harus sama dengan yang di upload.js)
const UPLOADS_DIR = path.join(__dirname, '../public/uploads');

// Helper untuk menghapus file lama
const deleteImageFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// GET /api/items
exports.getItems = async (req, res) => {
  try {
    // Ambil query params dari frontend
    const { search, kategori } = req.query;

    // Siapkan 'where clause' dinamis
    let whereClause = {
      userId: req.user.userId // Selalu filter berdasarkan user
    };

    // 1. Logika untuk Search
    if (search) {
      whereClause[Op.or] = [ // Cari di 'title' ATAU 'description'
        { title: { [Op.iLike]: `%${search}%` } }, // iLike = case-insensitive (PostgreSQL)
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // 2. Logika untuk Filter Kategori
    if (kategori) {
      whereClause.kategori = kategori; // Filter kategori (exact match)
    }

    // Jalankan query dengan 'where' yang sudah dinamis
    const items = await Item.findAll({ 
      where: whereClause,
      order: [['createdAt', 'DESC']] // Urutkan dari yang terbaru
    });
    
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Item.findAll({
      where: { userId: req.user.userId },
      attributes: [
        // Ambil nilai 'kategori' yang unik
        [sequelize.fn('DISTINCT', sequelize.col('kategori')), 'kategori']
      ],
      order: [['kategori', 'ASC']] // Urutkan A-Z
    });

    // Ubah hasil dari [{kategori: 'Serum'}, ...] menjadi ['Serum', ...]
    const categoryList = categories
      .map(cat => cat.kategori)
      .filter(Boolean); // filter(Boolean) untuk menghapus nilai null/kosong

    res.json(categoryList);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ message: err.message });
  }
};

// POST /api/items
exports.createItem = async (req, res) => {
  const { title, description, kategori, harga, stok } = req.body; // Data teks dari body, file dari req.file
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; // Simpan path relatif
  try {
    const newItem = await Item.create({
      title,
      description,
      imageUrl, // <--- SIMPAN URL GAMBAR
      kategori,
      harga,
      stok,
      userId: req.user.userId, // Tautkan item ke user yang sedang login
    });
    res.status(201).json(newItem);
  } catch (err) {
    // Jika ada error, hapus file yang sudah terupload (jika ada)
    if (req.file) {
      deleteImageFile(path.join(UPLOADS_DIR, req.file.filename));
    }
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/items/:id
exports.updateItem = async (req, res) => {
  const { title, description, kategori, harga, stok } = req.body;
  const newImageFile = req.file; // File baru jika diupload
  let imageUrl = req.body.imageUrl || null; // Ambil imageUrl yang mungkin dikirim dari form (jika tidak upload baru)

  try {
    const item = await Item.findOne({ 
      where: { id: req.params.id, userId: req.user.userId } 
    });
    
    if (!item) {
      // Jika item tidak ditemukan, hapus file baru jika sempat terupload
      if (newImageFile) {
        deleteImageFile(path.join(UPLOADS_DIR, newImageFile.filename));
      }
      return res.status(404).json({ message: 'Item tidak ditemukan atau Anda tidak punya akses' });
    }

    // Perbarui data teks
    item.title = title;
    item.description = description;
    item.kategori = kategori;
    item.harga = harga;
    item.stok = stok;

    // Logika untuk gambar
    if (newImageFile) { // Jika ada file baru diupload
      // Hapus gambar lama jika ada
      if (item.imageUrl) {
        deleteImageFile(path.join(__dirname, '../public', item.imageUrl));
      }
      item.imageUrl = `/uploads/${newImageFile.filename}`; // Set URL gambar baru
    } else if (imageUrl === 'null') { // Jika frontend mengirim 'null' secara eksplisit (misal tombol hapus gambar)
        if (item.imageUrl) {
            deleteImageFile(path.join(__dirname, '../public', item.imageUrl));
        }
        item.imageUrl = null;
    }

    await item.save();
    res.json(item);
  } catch (err) {
    // Jika ada error, hapus file baru yang mungkin sempat terupload
    if (newImageFile) {
      deleteImageFile(path.join(UPLOADS_DIR, newImageFile.filename));
    }
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/items/:id
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findOne({ 
      where: { id: req.params.id, userId: req.user.userId } 
    });

    if (!item) {
      return res.status(404).json({ message: 'Item tidak ditemukan atau Anda tidak punya akses' });
    }

    // Hapus file gambar fisik sebelum menghapus entri dari database
    if (item.imageUrl) {
      deleteImageFile(path.join(__dirname, '../public', item.imageUrl));
    }

    await item.destroy();
    res.json({ message: 'Item berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};