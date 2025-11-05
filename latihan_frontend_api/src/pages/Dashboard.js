import React, { useEffect, useState, useCallback } from 'react';
import { Table, Button, Container, Image, Form, InputGroup, Row, Col } from 'react-bootstrap';
import api from '../api/api';
import FormModal from '../components/FormModal';
import { useDebounce } from 'use-debounce';

function Dashboard() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ 
    title: '', 
    description: '', 
    imageFile: null,
    imageUrl: null,
    kategori: '', 
    harga: 0,     
    stok: 0       
  });
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);
  const [originalImageUrl, setOriginalImageUrl] = useState(null); // <--- State baru untuk URL gambar lama
  // --- STATE BARU UNTUK SEARCH & FILTER ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // Gunakan 'use-debounce' untuk menunda pencarian
  // Ini akan menunggu 500ms setelah pengguna berhenti mengetik
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  // --- KATEGORI (Hardcoded untuk sekarang) ---
  const [categories, setCategories] = useState([]); // State baru untuk kategori

  // Bungkus fetchData dengan useCallback agar tidak berubah
  const fetchData = useCallback(async () => {
    // const token = localStorage.getItem('token');
    // const res = await api.get('/items', {
    //   headers: { Authorization: `Bearer ${token}` },
    // });
    try {
      // Buat URL dengan query params
      const params = new URLSearchParams();
      if (debouncedSearchTerm) {
        params.append('search', debouncedSearchTerm);
      }
      if (filterCategory) {
        params.append('kategori', filterCategory);
      }

      // Kirim request dengan params
      const res = await api.get(`/items?${params.toString()}`);
      setItems(res.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  }, [debouncedSearchTerm, filterCategory]); // <-- Dependency baru

  // --- TAMBAHKAN useEffect BARU INI ---
  // useEffect ini hanya berjalan SEKALI saat komponen dimuat
  // untuk mengambil daftar kategori
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/items/categories');
        setCategories(res.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []); // <-- Array dependency KOSONG, berjalan sekali saat mount

  useEffect(() => {
    fetchData(); // Panggil fetchData
  }, [fetchData]); // <-- Dengarkan perubahan pada fungsi fetchData

  const handleClose = () => {
    setShow(false);
    setForm({ 
        title: '', 
        description: '', 
        imageFile: null, 
        imageUrl: null,
        kategori: '', 
        harga: 0, 
        stok: 0 
    }); // Reset form saat modal ditutup
    setEditId(null);
    setOriginalImageUrl(null); // Reset URL gambar lama
  };
  
  const handleShow = () => {
    setShow(true); // Buka modal (untuk tambah data)
    setForm({ 
        title: '', 
        description: '', 
        imageFile: null, 
        imageUrl: null,
        kategori: '', 
        harga: 0, 
        stok: 0  
    }); // Pastikan kosong saat tambah baru
    setOriginalImageUrl(null);
  };

  const handleSave = async () => {
    // const token = localStorage.getItem('token');
    // if (editId) {
    //   await api.put(`/items/${editId}`, form, {
    //     headers: { Authorization: `Bearer ${token}` },
    //   });
    // } else {
    //   await api.post('/items', form, {
    //     headers: { Authorization: `Bearer ${token}` },
    //   });
    // }
    // setForm({ title: '', description: '' });
    // setEditId(null);
    // setShow(false);
    // fetchData();
    // Kita harus membuat FormData saat mengirim file
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('kategori', form.kategori);
    formData.append('harga', form.harga);
    formData.append('stok', form.stok);
    
    // Kirim file jika ada yang baru
    if (form.imageFile) {
        formData.append('image', form.imageFile);
    } else if (originalImageUrl && !form.imageUrl) {
        // Jika sebelumnya ada gambar, tapi sekarang dihapus (originalImageUrl ada, tapi imageUrl di form null)
        formData.append('imageUrl', 'null'); // Beri tahu backend untuk menghapus
    }
    try {
      if (editId) {
        await api.put(`/items/${editId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }, // <--- Untuk upload file
        });
      } else {
        await api.post('/items', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }, // <--- Untuk upload file
        });
      }
      handleClose();
      fetchData();
    } catch (error) {
      alert("Gagal menyimpan data");
      console.error("Error saving item:", error);
    }
  };

  const handleDelete = async (id) => {
    // const token = localStorage.getItem('token');
    // await api.delete(`/items/${id}`, {
    //   headers: { Authorization: `Bearer ${token}` },
    // });

    // Sekarang ini berarti "Jalankan HANYA JIKA pengguna menekan OK"
    if (window.confirm('Yakin ingin menghapus data ini?')) {
        try {
            await api.delete(`/items/${id}`);
            fetchData(); //ambil data terbaru
        } catch (error) {
            alert("Gagal menghapus data");
        }
    }
  };

  const handleEdit = (item) => {
    setForm({ 
        title: item.title, 
        description: item.description,
        imageFile: null, // Jangan simpan file di sini, hanya URL lama
        imageUrl: item.imageUrl || null, // Simpan URL lama jika ada
        kategori: item.kategori || '', 
        harga: item.harga || 0,        
        stok: item.stok || 0         
    });
    setEditId(item.id);
    setOriginalImageUrl(item.imageUrl ? `http://localhost:5000${item.imageUrl}` : null); // <--- Set URL gambar lama
    setShow(true);
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Dashboard</h3>
        <Button onClick={handleShow}>Tambah Data</Button>
      </div>

      {/* --- UI SEARCH & FILTER BARU --- */}
      <Row className="mb-3">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>Cari</InputGroup.Text>
            <Form.Control
              placeholder="Cari berdasarkan judul atau deskripsi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>Filter Kategori</InputGroup.Text>
            <Form.Select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">Semua Kategori</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </Form.Select>
          </InputGroup>
        </Col>
      </Row>

      <Table striped bordered hover responsive="sm">
        <thead>
          <tr>
            <th>No</th>
            <th>Gambar</th> 
            <th>Produk</th>
            <th>Kategori</th> 
            <th>Deskripsi</th>
            <th>Stok</th> 
            <th style={{ whiteSpace: 'nowrap' }}>Harga (Rp)</th> 
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={item.id}>
              <td>{i + 1}</td>
              <td>
                {item.imageUrl ? (
                  <Image 
                    src={`http://localhost:5000${item.imageUrl}`} // <--- Tampilkan gambar
                    alt={item.title} 
                    thumbnail 
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                  />
                ) : (
                  <span>Tidak ada gambar</span>
                )}
              </td>
              <td>{item.title}</td>
              <td>{item.kategori}</td>
              <td>{item.description}</td>
              <td>{item.stok}</td>
              <td>{item.harga.toLocaleString('id-ID')}</td>
              <td style={{ whiteSpace: 'nowrap' }}>
                <Button
                  size="sm"
                  variant="warning"
                  className="me-2"
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(item.id)}
                >
                  Hapus
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? 'Edit Data' : 'Tambah Data'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Judul</Form.Label>
              <Form.Control
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Deskripsi</Form.Label>
              <Form.Control
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal> */}
      <FormModal
        show={show}
        onHide={handleClose}
        onSave={handleSave}
        title={editId ? 'Edit Data' : 'Tambah Data'}
        formData={form}
        setFormData={setForm}
        originalImageUrl={originalImageUrl} // <--- Kirim URL gambar lama
    />
  </Container>
  );
}

export default Dashboard;
