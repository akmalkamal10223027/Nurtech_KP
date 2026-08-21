require('dotenv').config();
const mysql = require('mysql2/promise');
const { execSync } = require('child_process');

async function setupDatabase() {
  console.log('--- Nurtech School MySQL Setup ---');
  const dbUrl = process.env.DATABASE_URL || 'mysql://root:@localhost:3306/nurtech_school_db';
  console.log('Connecting to MySQL host localhost:3306...');

  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: ''
    });

    console.log('Connected to MySQL Laragon successfully!');
    await connection.query('CREATE DATABASE IF NOT EXISTS `nurtech_school_db`;');
    console.log('Database `nurtech_school_db` is ready.');
    await connection.end();

    console.log('Pushing Prisma schema to MySQL...');
    execSync('npx prisma db push --skip-generate', { stdio: 'inherit', cwd: process.cwd() });

    console.log('Running seeder...');
    execSync('node src/seeders/seed.js', { stdio: 'inherit', cwd: process.cwd() });

    console.log('Setup finished with 100% success!');
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('\n[PENTING] Tidak dapat terhubung ke MySQL Laragon (Port 3306).');
      console.error('Silakan buka Laragon lalu klik tombol "Start All".');
      console.error('Setelah MySQL aktif, jalankan perintah: npm run db:setup\n');
    } else {
      console.error('Error setting up database:', error.message);
    }
  }
}

setupDatabase();
