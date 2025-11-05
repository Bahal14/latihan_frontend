import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Image } from 'react-bootstrap';

// formData sekarang akan mengandung { title, description, imageUrl, imageFile }
function FormModal({ show, onHide, onSave, title, formData, setFormData, originalImageUrl }) {

    // State lokal untuk preview gambar
  const [imagePreview, setImagePreview] = useState(null);

  // Efek untuk membuat preview saat formData.imageFile atau originalImageUrl berubah
  useEffect(() => {
    if (formData.imageFile) {
      setImagePreview(URL.createObjectURL(formData.imageFile));
    } else if (originalImageUrl) { // Jika ada gambar lama dari database
      setImagePreview(originalImageUrl);
    } else {
      setImagePreview(null);
    }

    // Cleanup object URL saat komponen unmount atau gambar berubah
    return () => {
      if (imagePreview && !originalImageUrl) { // Pastikan hanya object URL yang di-revoke
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [formData.imageFile, originalImageUrl]);
  
  // Fungsi generik untuk menangani perubahan input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, imageFile: file }); // Simpan file objek
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, imageUrl: null, imageFile: null }); // Hapus gambar lama dan baru
    setImagePreview(null);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Produk</Form.Label>
            <Form.Control
              name="title"
              value={formData.title || ''}
              onChange={handleChange}
              placeholder="Masukkan judul"
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Deskripsi</Form.Label>
            <Form.Control
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              placeholder="Masukkan deskripsi"
              as="textarea"
              rows={3}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Kategori</Form.Label>
            {/* Kita akan hardcode kategori, tapi ini bisa jadi dropdown */}
            <Form.Control
              name="kategori"
              value={formData.kategori || ''}
              onChange={handleChange}
              placeholder="Contoh: Serum, Moisturizer, Sunscreen"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Harga (Rp)</Form.Label>
            <Form.Control
              name="harga"
              type="number"
              value={formData.harga || 0}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Stok</Form.Label>
            <Form.Control
              name="stok"
              type="number"
              value={formData.stok || 0}
              onChange={handleChange}
            />
          </Form.Group>

          {/* Input File untuk Gambar */}
          <Form.Group className="mb-3">
            <Form.Label>Gambar Produk</Form.Label>
            {imagePreview && (
              <div className="mb-2">
                <Image src={imagePreview} thumbnail style={{ maxWidth: '150px', maxHeight: '150px' }} />
                <Button variant="danger" size="sm" className="ms-2" onClick={handleRemoveImage}>
                  Hapus Gambar
                </Button>
              </div>
            )}
            <Form.Control
              type="file"
              name="image" // Nama ini harus cocok dengan 'image' di upload.single('image')
              onChange={handleFileChange}
              accept="image/*" // Hanya menerima file gambar
            />
            {/* Tampilkan nama file yang sedang dipilih */}
            {formData.imageFile && <small className="text-muted">File: {formData.imageFile.name}</small>}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Batal
        </Button>
        <Button variant="primary" onClick={onSave}>
          Simpan
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default FormModal;