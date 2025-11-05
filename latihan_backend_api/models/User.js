// File: models/User.js
'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    // Kolom 'id' dibuat otomatis
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Pastikan email unik
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // createdAt dan updatedAt dibuat otomatis
  }, {
    tableName: 'users', // Sesuaikan dengan nama tabel di SQL Anda
  });

  // Definisikan asosiasi di sini
  User.associate = function(models) {
    // User memiliki banyak Item
    User.hasMany(models.Item, {
      foreignKey: 'userId', // Kunci asing di tabel Item
      as: 'items',
    });
  };

  return User;
};