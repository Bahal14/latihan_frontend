// File: models/Item.js
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('Item', {
    // Kolom 'id' dibuat otomatis
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    imageUrl: { // <--- TAMBAH KOLOM INI
      type: DataTypes.STRING, // Simpan URL atau path ke gambar
      allowNull: true,
    },
    kategori: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    harga: {
      type: DataTypes.INTEGER, // Gunakan INTEGER atau DECIMAL(10, 2)
      allowNull: false,
      defaultValue: 0,
    },
    stok: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    // Kolom 'userId' (foreign key) akan ditambahkan melalui asosiasi
  }, {
    tableName: 'items', // Sesuaikan dengan nama tabel di SQL 
  });

  // Definisikan asosiasi di sini
  Item.associate = function(models) {
    // Item adalah milik satu User
    Item.belongsTo(models.User, {
      foreignKey: 'userId', // Kunci asing di tabel Item
      onDelete: 'CASCADE', // Jika User dihapus, Item-nya juga
    });
  };

  return Item;
};