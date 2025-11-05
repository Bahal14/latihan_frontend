// File: models/index.js
'use strict';

const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

// Konfigurasi koneksi dari .env
const config = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres', // Tentukan dialeknya
};

const db = {};

// Buat instance Sequelize
let sequelize = new Sequelize(config.database, config.username, config.password, config);

// Muat semua file model di folder ini secara otomatis
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

// Set up asosiasi antar model (jika ada)
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Coba koneksi ke database
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Koneksi database (PostgreSQL) berhasil.');
  } catch (error) {
    console.error('Tidak dapat terhubung ke database:', error);
  }
})();

module.exports = db;