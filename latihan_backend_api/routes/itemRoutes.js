// File: routes/itemRoutes.js
const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload'); // <--- IMPORT MULTER

// Terapkan middleware ke semua rute di file ini
router.use(authMiddleware);

// GET /api/items (Read All)
router.get('/', itemController.getItems);

// Pastikan ini ada DI ATAS '/:id'
router.get('/categories', itemController.getCategories);

// POST /api/items (Create)
router.post('/', upload.single('image'), itemController.createItem);

// PUT /api/items/:id (Update)
router.put('/:id', upload.single('image'),itemController.updateItem);

// DELETE /api/items/:id (Delete)
router.delete('/:id', itemController.deleteItem);

module.exports = router;