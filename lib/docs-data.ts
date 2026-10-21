import { MODULE_02 } from './module-02-data';
import { PhaseGroup, DocModule } from '@/types/docs';

export const DOC_MODULES: DocModule[] = [
  {
    slug: '01-setup-project',
    phaseId: 'fase-1',
    order: 1,
    title: 'Setup Project',
    subtitle: 'Setup direktori utama, Frontend Next.js, dan Backend Express TypeScript.',
    category: 'core-standard',
    layer: 'frontend',
    estimatedMinutes: 10,
    tujuan: 'Setup proyek Frontend dan Backend.',
    prasyarat: ['Node.js v18+', 'Terminal', 'VS Code'],
    tasks: [
      'Setup Folder Project',
      'Checkpoint 1: Setup FE',
      'Checkpoint 2: Setup BE',
      'Checkpoint 3: Koneksi DB & Migration',
      'Checkpoint 4: Setup Seeder',
      'Checkpoint 5: Setup Config & Models',
      'Checkpoint 6: Setup Middlewares',
      'Checkpoint 7: Setup Controllers',
      'Checkpoint 8: Setup Routes & Server Entry',
      'Checkpoint 9: Uji Coba Integrasi Auth FE & BE',
    ],
    adaptationTable: [
      {
        aspect: 'Skema Tabel & Migration',
        universalExample: 'users (id, name, email, password, role)',
        projectExampleA: 'users, courts, bookings (Sistem Booking)',
        projectExampleB: 'users, categories, items (Sistem Inventaris)',
      },
      {
        aspect: 'Data Awal (Seeder)',
        universalExample: 'Akun admin & user default (admin@example.com)',
        projectExampleA: 'Data master lapangan & akun operator',
        projectExampleB: 'Data kategori awal & akun staf gudang',
      },
    ],
    practicalTasks: [
      // -------------------------------------------------------------
      // TASK 1: Root Project Setup
      // -------------------------------------------------------------
      {
        taskNumber: 1,
        title: 'Setup Folder',
        description: 'Buat folder utama untuk menampung frontend dan backend:',
        steps: [
          {
            stepNumber: 1,
            title: 'Buat & Masuk ke Folder Proyek',
            description: 'Jalankan perintah berikut di terminal:',
            instructions: [],
            codeSnippet: {
              filename: 'terminal',
              language: 'bash',
              description: 'Perintah membuat folder proyek',
              code: `mkdir [nama-project]
cd [nama-project]

# Contoh:
mkdir Siabsensi
cd Siabsensi`,
            },
          },
        ],
      },

      // -------------------------------------------------------------
      // TASK 2: Checkpoint 1 - Setup FE (Next.js)
      // -------------------------------------------------------------
      {
        taskNumber: 2,
        title: 'Setup FrontEnd',
        description: 'Inisialisasi frontend menggunakan Next.js:',
        steps: [
          {
            stepNumber: 1,
            title: 'Inisialisasi Next.js',
            description: 'Di dalam folder utama proyek, jalankan:',
            instructions: [],
            codeSnippet: {
              filename: 'terminal',
              language: 'bash',
              description: 'Inisialisasi frontend',
              code: 'npx create-next-app@latest frontend',
            },
          },
          {
            stepNumber: 2,
            title: 'Konfigurasi Prompt Terminal',
            description: 'Pilih konfigurasi berikut saat muncul pertanyaan di terminal:',
            instructions: [],
            codeSnippet: {
              filename: 'terminal-prompts',
              language: 'text',
              description: 'Pilihan konfigurasi prompt',
              code: `Would you like to use TypeScript? -> Yes
Would you like to use ESLint? -> Yes
Would you like to use Tailwind CSS? -> Yes
Would you like to use src/ directory? -> (Bebas, disarankan Yes)
Would you like to use App Router? (recommended) -> Yes
Would you like to customize the default import alias? -> No`,
            },
          },
          {
            stepNumber: 3,
            title: 'Jalankan Frontend',
            description: 'Masuk ke folder frontend dan jalankan server:',
            instructions: [],
            codeSnippet: {
              filename: 'terminal',
              language: 'bash',
              description: 'Menjalankan frontend',
              code: `cd frontend
npm run dev`,
            },
            verification: {
              action: 'Buka browser di http://localhost:3000',
              expectedResult: 'Halaman Next.js berhasil tampil',
            },
          },
        ],
      },

      // -------------------------------------------------------------
      // TASK 3: Checkpoint 2 - Setup BE (Express TypeScript)
      // -------------------------------------------------------------
      {
        taskNumber: 3,
        title: 'Setup Backend',
        description: 'Setup backend Express dengan TypeScript:',
        steps: [
          {
            stepNumber: 1,
            title: 'Buat Folder be & Masuk',
            description: 'Kembali ke root proyek, buat folder be dan masuk ke dalamnya:',
            instructions: [],
            codeSnippet: {
              filename: 'terminal',
              language: 'bash',
              description: 'Membuat folder BE',
              code: `cd ..
mkdir be
cd be
npm init -y`,
            },
          },
          {
            stepNumber: 2,
            title: 'Install Dependensi & TypeScript',
            description: 'Install Express, TypeScript, dev tools, dan generate tsconfig:',
            instructions: [],
            codeSnippet: {
              filename: 'terminal',
              language: 'bash',
              description: 'Install dependensi backend',
              code: `npm install express
npm install -D typescript @types/node @types/express nodemon ts-node
npx tsc --init`,
            },
          },
          {
            stepNumber: 3,
            title: 'Ubah tsconfig.json',
            description: 'Sesuaikan isi be/tsconfig.json menjadi:',
            instructions: [],
            codeSnippet: {
              filename: 'be/tsconfig.json',
              language: 'json',
              description: 'Konfigurasi tsconfig.json',
              code: `{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "rootDir": "./src", 
    "outDir": "./dist", 
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}`,
            },
          },
          {
            stepNumber: 4,
            title: 'Tambahkan Script dev di package.json',
            description: 'Tambahkan script "dev" pada "scripts" di be/package.json:',
            instructions: [],
            codeSnippet: {
              filename: 'be/package.json',
              language: 'json',
              description: 'Script runner backend',
              code: `"scripts": {
  "dev": "nodemon --watch src --exec ts-node src/index.ts"
}`,
            },
          },
          {
            stepNumber: 5,
            title: 'Buat File src/index.ts',
            description: 'Buat file be/src/index.ts dengan kode server berikut:',
            instructions: [],
            codeSnippet: {
              filename: 'be/src/index.ts',
              language: 'typescript',
              description: 'Server Express TypeScript',
              code: `// src/index.ts
import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 5000;

app.get('/', (req: Request, res: Response) => {
  res.send('Backend Express (TypeScript) Berhasil Berjalan!');
});

app.listen(port, () => {
  console.log(\`Server Express berjalan di http://localhost:\${port}\`);
});`,
            },
          },
          {
            stepNumber: 6,
            title: 'Jalankan Backend',
            description: 'Jalankan server backend Express:',
            instructions: [],
            codeSnippet: {
              filename: 'terminal',
              language: 'bash',
              description: 'Menjalankan backend',
              code: 'npm run dev',
            },
            verification: {
              action: 'Buka browser di http://localhost:5000',
              expectedResult: 'Backend Express (TypeScript) Berhasil Berjalan!',
            },
          },
        ],
      },

      // -------------------------------------------------------------
      // TASK 4: Checkpoint 3 - Koneksi DB & Migration (Sequelize TS)
      // -------------------------------------------------------------
      {
        taskNumber: 4,
        title: 'Koneksi DB & Migration',
        description: 'Konfigurasi Sequelize TypeScript, dotenv, dan migrasi tabel basis data:',
        steps: [
          {
            stepNumber: 1,
            title: 'Install Sequelize & Driver MySQL',
            description: 'Masuk ke folder be dan install library ORM serta dotenv:',
            instructions: [
              'Pastikan database (misal: MySQL di Laragon / XAMPP) sudah berjalan.',
              'Buat database baru terlebih dahulu (misal via phpMyAdmin/DBeaver) sesuai nama proyekmu.',
            ],
            codeSnippet: {
              filename: 'terminal',
              language: 'bash',
              description: 'Install dependensi database',
              code: 'npm install sequelize mysql2 dotenv',
            },
          },
          {
            stepNumber: 2,
            title: 'Buat File .env',
            description: 'Buat file be/.env untuk konfigurasi kredensial koneksi database:',
            instructions: [
              'Sesuaikan DB_NAME, DB_USER, dan DB_PASSWORD dengan kredensial MySQL lokalmu.',
            ],
            codeSnippet: {
              filename: 'be/.env',
              language: 'ini',
              description: 'Variabel lingkungan database',
              code: `PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=nama_database_kamu
DB_USER=root
DB_PASSWORD=`,
            },
          },
          {
            stepNumber: 3,
            title: 'Buat Koneksi Database (src/db/config/database.ts)',
            description: 'Inisialisasi Sequelize dan export instance sequelize:',
            instructions: [
              'Pastikan baris "export default sequelize;" ada agar file ini menjadi module dan bisa diimport file lain.',
            ],
            codeSnippet: {
              filename: 'be/src/db/config/database.ts',
              language: 'typescript',
              description: 'Konfigurasi instance Sequelize',
              code: `import { Sequelize } from 'sequelize';
import 'dotenv/config';

const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    logging: false,
  }
);

export default sequelize;`,
            },
          },
          {
            stepNumber: 4,
            title: 'Uji Koneksi Database di src/index.ts',
            description: 'Hubungkan authenticate() Sequelize sebelum server Express aktif:',
            instructions: [],
            codeSnippet: {
              filename: 'be/src/index.ts',
              language: 'typescript',
              description: 'Server Express dengan autentikasi DB',
              code: `import express, { Request, Response } from 'express';
import sequelize from './db/config/database';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Backend Express (TypeScript) Berhasil Berjalan!');
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');

    app.listen(port, () => {
      console.log(\`Server Express berjalan di http://localhost:\${port}\`);
    });
  } catch (error) {
    console.error('Unable to connect to database:', error);
  }
};

startServer();`,
            },
            verification: {
              action: 'Cek output console terminal (npm run dev)',
              expectedResult: 'Muncul pesan: "Database connected successfully"',
            },
          },
          {
            stepNumber: 5,
            title: 'Buat File Migration Contoh (src/db/migrations/001-create-users.ts)',
            description: 'Buat skema tabel pertama:',
            instructions: [
              'PERHATIAN PENTING: Struktur tabel "users" berikut adalah CONTOH UMUM.',
              'Setiap kelompok WAJIB memodifikasi nama tabel, kolom, tipe data, dan relasi sesuai ERD proyek kelompok masing-masing.',
            ],
            codeSnippet: {
              filename: 'be/src/db/migrations/001-create-users.ts',
              language: 'typescript',
              description: 'Migration tabel users',
              code: `import { QueryInterface, DataTypes } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'user', // Sesuaikan role kelompokmu (misal: 'dosen', 'admin', 'mahasiswa')
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('users');
  },
};`,
            },
          },
          {
            stepNumber: 6,
            title: 'Buat Migration Runner (src/db/migrations/run.ts)',
            description: 'Buat script eksekutor migrasi:',
            instructions: [],
            codeSnippet: {
              filename: 'be/src/db/migrations/run.ts',
              language: 'typescript',
              description: 'Runner eksekusi migrasi',
              code: `import sequelize from '../config/database';
import usersMigration from './001-create-users';

const runMigrations = async () => {
  try {
    const queryInterface = sequelize.getQueryInterface();

    await usersMigration.up(queryInterface);

    console.log('Migration users berhasil dijalankan');
    await sequelize.close();
  } catch (error) {
    console.error('Migration gagal:', error);
    process.exit(1);
  }
};

runMigrations();`,
            },
          },
          {
            stepNumber: 7,
            title: 'Daftarkan Script & Jalankan Migration',
            description: 'Tambahkan script "migrate" di be/package.json lalu eksekusi:',
            instructions: [
              'Tambahkan script di be/package.json: "migrate": "ts-node src/db/migrations/run.ts"',
            ],
            codeSnippet: {
              filename: 'terminal',
              language: 'bash',
              description: 'Menjalankan migration',
              code: 'npm run migrate',
            },
            verification: {
              action: 'Periksa database MySQL (phpMyAdmin/DBeaver)',
              expectedResult: 'Tabel users (atau tabel kelompokmu) berhasil dibuat dengan seluruh kolomnya.',
            },
          },
        ],
      },

      // -------------------------------------------------------------
      // TASK 5: Checkpoint 4 - Setup Seeder (Sequelize TS)
      // -------------------------------------------------------------
      {
        taskNumber: 5,
        title: 'Setup Seeder',
        description: 'Injeksi data awal (dummy/master data) ke database menggunakan seeder:',
        steps: [
          {
            stepNumber: 1,
            title: 'Buat File Seeder Contoh (src/db/seeders/001-seed-users.ts)',
            description: 'Buat file seeder untuk memasukkan data awal:',
            instructions: [
              'PERHATIAN PENTING: Data akun berikut hanyalah template.',
              'Kelompok kalian bebas memodifikasi data awal ini (misal akun admin utama, data kategori awal, master ruangan, dsb) sesuai kebutuhan aplikasi.',
            ],
            codeSnippet: {
              filename: 'be/src/db/seeders/001-seed-users.ts',
              language: 'typescript',
              description: 'Seeder data awal users',
              code: `import { QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.bulkInsert('users', [
      {
        name: 'Administrator',
        email: 'admin@example.com',
        password: 'password123', // Catatan: pada modul autentikasi nanti akan di-hash dengan bcrypt
        role: 'admin',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Pengguna Demo',
        email: 'user@example.com',
        password: 'password123',
        role: 'user',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('users', {
      email: ['admin@example.com', 'user@example.com'],
    });
  },
};`,
            },
          },
          {
            stepNumber: 2,
            title: 'Buat Seeder Runner (src/db/seeders/run.ts)',
            description: 'Buat script eksekutor seeder:',
            instructions: [],
            codeSnippet: {
              filename: 'be/src/db/seeders/run.ts',
              language: 'typescript',
              description: 'Runner eksekusi seeder',
              code: `import sequelize from '../config/database';
import usersSeeder from './001-seed-users';

const runSeeders = async () => {
  try {
    const queryInterface = sequelize.getQueryInterface();

    await usersSeeder.up(queryInterface);

    console.log('Seeder users berhasil dijalankan');
    await sequelize.close();
  } catch (error) {
    console.error('Seeder gagal:', error);
    process.exit(1);
  }
};

runSeeders();`,
            },
          },
          {
            stepNumber: 3,
            title: 'Daftarkan Script & Jalankan Seeder',
            description: 'Tambahkan script "seed" di be/package.json lalu jalankan:',
            instructions: [
              'Tambahkan script di be/package.json: "seed": "ts-node src/db/seeders/run.ts"',
            ],
            codeSnippet: {
              filename: 'terminal',
              language: 'bash',
              description: 'Menjalankan seeder',
              code: 'npm run seed',
            },
            verification: {
              action: 'Buka tabel users di database MySQL (phpMyAdmin/DBeaver)',
              expectedResult: 'Baris data awal berhasil masuk ke tabel users.',
            },
          },
        ],
      },

      // -------------------------------------------------------------
      // TASK 6: Checkpoint 5 - Setup Config & Models (Pool & SQL Murni)
      // -------------------------------------------------------------
      {
        taskNumber: 6,
        title: 'Setup Config & Models',
        description: 'Konfigurasi MySQL Connection Pool dan pembuatan Model User serta Todo menggunakan Query SQL Murni:',
        steps: [
          {
            stepNumber: 1,
            title: 'Install Dependensi Pendukung Auth & JWT',
            description: 'Masuk ke direktori be dan install library mysql2, bcryptjs, jsonwebtoken, cors, dotenv, serta type definition-nya:',
            instructions: [
              'Buka terminal dan pastikan berada di dalam direktori be',
              'Jalankan perintah instalasi paket berikut:',
            ],
            codeSnippet: {
              filename: 'terminal',
              language: 'bash',
              description: 'Install dependensi backend tambahan',
              code: `npm install mysql2 bcryptjs jsonwebtoken cors dotenv
npm install -D @types/bcryptjs @types/jsonwebtoken @types/cors`,
            },
            verification: {
              action: 'Periksa dependencies di be/package.json',
              expectedResult: 'Tertera bcryptjs, jsonwebtoken, cors, dan mysql2.',
            },
          },
          {
            stepNumber: 2,
            title: 'Setup Config Connection Pool (src/config/db.ts)',
            description: 'Di dalam folder be/src, buat folder config lalu buat file db.ts untuk mengatur connection pool ke database MySQL:',
            instructions: [
              'Buat folder baru bernama config di dalam be/src',
              'Buat file db.ts di dalam be/src/config/ dan tempel kode berikut:',
            ],
            codeSnippet: {
              filename: 'be/src/config/db.ts',
              language: 'typescript',
              description: 'Konfigurasi MySQL Connection Pool',
              code: `import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Mengatur connection pool ke database MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'absensi',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;`,
            },
          },
          {
            stepNumber: 3,
            title: 'Setup Model User SQL Murni (src/models/userModel.ts)',
            description: 'Di dalam be/src, buat folder models lalu buat userModel.ts untuk mengelola data user menggunakan query SQL murni:',
            instructions: [
              'Buat folder baru bernama models di dalam be/src',
              'Buat file userModel.ts di dalam be/src/models/ dan isi dengan kode query murni:',
            ],
            codeSnippet: {
              filename: 'be/src/models/userModel.ts',
              language: 'typescript',
              description: 'Query SQL Murni Model User',
              code: `import pool from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface User {
  id?: number;
  username: string;
  email: string;
  password?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface UserRow extends RowDataPacket, User {}

/**
 * Mencari user berdasarkan email dengan query SQL murni
 */
export const findUserByEmail = async (email: string): Promise<User | null> => {
  const query = 'SELECT id, username, email, password FROM users WHERE email = ? LIMIT 1';
  const [rows] = await pool.execute<UserRow[]>(query, [email]);
  if (!rows || rows.length === 0) return null;
  return rows[0];
};

/**
 * Mencari user berdasarkan ID dengan query SQL murni
 */
export const findUserById = async (id: number): Promise<Omit<User, 'password'> | null> => {
  const query = 'SELECT id, username, email, created_at, updated_at FROM users WHERE id = ? LIMIT 1';
  const [rows] = await pool.execute<UserRow[]>(query, [id]);
  if (!rows || rows.length === 0) return null;
  const { password, ...userWithoutPassword } = rows[0];
  return userWithoutPassword;
};

/**
 * Menyimpan data user baru saat registrasi
 */
export const createUser = async (user: Omit<User, 'id'>): Promise<number> => {
  const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  const [result] = await pool.execute<ResultSetHeader>(query, [
    user.username,
    user.email,
    user.password,
  ]);
  return result.insertId;
};`,
            },
          },
          {
            stepNumber: 4,
            title: 'Setup Model Todo SQL Murni (src/models/todoModel.ts)',
            description: 'Buat file todoModel.ts di dalam be/src/models/ untuk mengelola data Todo dengan query SQL murni:',
            instructions: [
              'Buat file todoModel.ts di dalam be/src/models/',
              'Tempel kode query Todo murni berikut:',
            ],
            codeSnippet: {
              filename: 'be/src/models/todoModel.ts',
              language: 'typescript',
              description: 'Query SQL Murni Model Todo',
              code: `import pool from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface Todo {
  id?: number;
  user_id: number;
  task: string;
  completed?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface TodoRow extends RowDataPacket, Todo {}

/**
 * Mengambil seluruh daftar Todo milik user tertentu
 */
export const getTodosByUserId = async (userId: number): Promise<Todo[]> => {
  const query = 'SELECT id, user_id, task, completed, created_at FROM todos WHERE user_id = ? ORDER BY id DESC';
  const [rows] = await pool.execute<TodoRow[]>(query, [userId]);
  return rows;
};

/**
 * Menyimpan Todo baru milik user tertentu
 */
export const createTodo = async (userId: number, task: string): Promise<Todo> => {
  const query = 'INSERT INTO todos (user_id, task, completed) VALUES (?, ?, false)';
  const [result] = await pool.execute<ResultSetHeader>(query, [userId, task]);
  return {
    id: result.insertId,
    user_id: userId,
    task,
    completed: false,
  };
};`,
            },
          },
        ],
      },

      // -------------------------------------------------------------
      // TASK 7: Checkpoint 6 - Setup Middlewares (Validator & Auth JWT)
      // -------------------------------------------------------------
      {
        taskNumber: 7,
        title: 'Setup Middlewares',
        description: 'Membangun middleware validasi input data dan autentikasi token JWT:',
        steps: [
          {
            stepNumber: 1,
            title: 'Buat Middleware Validator (src/middlewares/validator.ts)',
            description: 'Di dalam folder be/src, buat folder middlewares lalu buat file validator.ts untuk memeriksa kelengkapan data (username, email, password, task) sebelum diproses lebih lanjut:',
            instructions: [
              'Buat folder baru bernama middlewares di dalam be/src',
              'Buat file validator.ts di dalam be/src/middlewares/ dan isi dengan kode:',
            ],
            codeSnippet: {
              filename: 'be/src/middlewares/validator.ts',
              language: 'typescript',
              description: 'Middleware validasi input request',
              code: `import { Request, Response, NextFunction } from 'express';

/**
 * Validasi kelengkapan data registrasi
 */
export const validateRegister = (req: Request, res: Response, next: NextFunction): void => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({
      success: false,
      message: 'Field username, email, dan password wajib diisi!',
    });
    return;
  }

  next();
};

/**
 * Validasi kelengkapan data login
 */
export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      success: false,
      message: 'Email dan password wajib diisi!',
    });
    return;
  }

  next();
};

/**
 * Validasi kelengkapan data pembuatan Todo
 */
export const validateTodo = (req: Request, res: Response, next: NextFunction): void => {
  const { task } = req.body;

  if (!task || typeof task !== 'string' || task.trim() === '') {
    res.status(400).json({
      success: false,
      message: 'Field task tidak boleh kosong!',
    });
    return;
  }

  next();
};`,
            },
          },
          {
            stepNumber: 2,
            title: 'Buat Middleware Auth JWT (src/middlewares/authMiddleware.ts)',
            description: 'Buat file authMiddleware.ts untuk mengekstrak token JWT dari header Authorization dan menyimpan ID pengguna ke dalam res.locals.userId:',
            instructions: [
              'Buat file authMiddleware.ts di dalam be/src/middlewares/',
              'Tempel kode middleware verifikasi JWT berikut:',
            ],
            codeSnippet: {
              filename: 'be/src/middlewares/authMiddleware.ts',
              language: 'typescript',
              description: 'Middleware ekstraksi token JWT & simpan userId',
              code: `import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: number;
  email: string;
}

/**
 * Middleware untuk mengekstrak token JWT dan menyimpan userId ke res.locals.userId
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({
      success: false,
      message: 'Akses ditolak. Token tidak ditemukan di header Authorization.',
    });
    return;
  }

  // Format header Bearer: "Bearer <token>"
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    res.status(401).json({
      success: false,
      message: 'Format token salah. Gunakan format "Bearer <token>".',
    });
    return;
  }

  const token = parts[1];
  const secretKey = process.env.JWT_SECRET || 'secret_jwt_key_pbl';

  try {
    const decoded = jwt.verify(token, secretKey) as JwtPayload;

    // Simpan ID pengguna ke dalam res.locals.userId sesuai instruksi
    res.locals.userId = decoded.userId;
    res.locals.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token tidak valid atau sudah kedaluwarsa.',
    });
    return;
  }
};`,
            },
          },
        ],
      },

      // -------------------------------------------------------------
      // TASK 8: Checkpoint 7 - Setup Controllers (Auth & Todo)
      // -------------------------------------------------------------
      {
        taskNumber: 8,
        title: 'Setup Controllers',
        description: 'Membangun controller autentikasi (bcrypt + jwt) dan controller todo (menggunakan res.locals.userId):',
        steps: [
          {
            stepNumber: 1,
            title: 'Buat Auth Controller (src/controllers/authController.ts)',
            description: 'Di dalam be/src, buat folder controllers lalu buat file authController.ts. Gabungkan fungsi bcrypt untuk enkripsi password saat registrasi dan jsonwebtoken saat melakukan login:',
            instructions: [
              'Buat folder baru bernama controllers di dalam be/src',
              'Buat file authController.ts di dalam be/src/controllers/ dan masukkan kode berikut:',
            ],
            codeSnippet: {
              filename: 'be/src/controllers/authController.ts',
              language: 'typescript',
              description: 'Controller Registrasi & Login JWT',
              code: `import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser } from '../models/userModel';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_jwt_key_pbl';

/**
 * Registrasi User Baru (Password dienkripsi dengan bcrypt)
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    // Cek apakah email sudah terdaftar
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      res.status(409).json({
        success: false,
        message: 'Email sudah terdaftar. Silakan gunakan email lain.',
      });
      return;
    }

    // Enkripsi password menggunakan bcrypt (salt rounds = 10)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan ke database via userModel (SQL murni)
    const newUserId = await createUser({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil!',
      data: {
        id: newUserId,
        username,
        email,
      },
    });
  } catch (error: any) {
    console.error('Error saat registrasi:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat registrasi.',
    });
  }
};

/**
 * Login User (Cocokkan password dengan bcrypt & terbitkan JWT token)
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Cari user di database berdasarkan email
    const user = await findUserByEmail(email);
    if (!user || !user.password) {
      res.status(401).json({
        success: false,
        message: 'Email atau kata sandi tidak cocok.',
      });
      return;
    }

    // Bandingkan password input dengan password hash menggunakan bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Email atau kata sandi tidak cocok.',
      });
      return;
    }

    // Buat token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login berhasil!',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error('Error saat login:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat login.',
    });
  }
};`,
            },
          },
          {
            stepNumber: 2,
            title: 'Buat Todo Controller (src/controllers/todoController.ts)',
            description: 'Buat file todoController.ts di dalam be/src/controllers/. Ambil userId dari res.locals, lalu panggil fungsi dari Model untuk menyimpan atau mengambil Todo:',
            instructions: [
              'Buat file todoController.ts di dalam be/src/controllers/',
              'Tempel kode berikut:',
            ],
            codeSnippet: {
              filename: 'be/src/controllers/todoController.ts',
              language: 'typescript',
              description: 'Controller Todo memanfaatkan res.locals.userId',
              code: `import { Request, Response } from 'express';
import { getTodosByUserId, createTodo as insertTodo } from '../models/todoModel';

/**
 * Mengambil daftar Todo milik user yang sedang terautentikasi
 */
export const getTodos = async (req: Request, res: Response): Promise<void> => {
  try {
    // Ambil userId dari res.locals yang disimpan oleh authMiddleware
    const userId = res.locals.userId;

    const todos = await getTodosByUserId(Number(userId));

    res.status(200).json({
      success: true,
      message: 'Berhasil mengambil daftar todo.',
      data: todos,
    });
  } catch (error: any) {
    console.error('Error saat get todos:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data todo.',
    });
  }
};

/**
 * Menyimpan Todo baru milik user yang sedang terautentikasi
 */
export const createTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    // Ambil userId dari res.locals
    const userId = res.locals.userId;
    const { task } = req.body;

    const newTodo = await insertTodo(Number(userId), task);

    res.status(201).json({
      success: true,
      message: 'Berhasil membuat todo baru.',
      data: newTodo,
    });
  } catch (error: any) {
    console.error('Error saat create todo:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menyimpan todo baru.',
    });
  }
};`,
            },
          },
        ],
      },

      // -------------------------------------------------------------
      // TASK 9: Checkpoint 8 - Setup Routes & Entry Point (App & Server)
      // -------------------------------------------------------------
      {
        taskNumber: 9,
        title: 'Setup Routes & Server',
        description: 'Mendaftarkan seluruh rute API, konfigurasi Express, dan entry point server:',
        steps: [
          {
            stepNumber: 1,
            title: 'Daftarkan Seluruh Rute (src/routes/api.ts)',
            description: 'Di dalam be/src, buat folder routes. Buat file bernama api.ts lalu daftarkan seluruh rute (Register, Login, Get Todo, Post Todo) dan pasangkan middleware yang sesuai:',
            instructions: [
              'Buat folder baru bernama routes di dalam be/src',
              'Buat file api.ts di dalam be/src/routes/ dan tempel kode routing berikut:',
            ],
            codeSnippet: {
              filename: 'be/src/routes/api.ts',
              language: 'typescript',
              description: 'Routing API dengan middleware',
              code: `import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { getTodos, createTodo } from '../controllers/todoController';
import { validateRegister, validateLogin, validateTodo } from '../middlewares/validator';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// ==========================================
// RUTE AUTENTIKASI (Public)
// ==========================================
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

// ==========================================
// RUTE TODO (Protected via authMiddleware)
// ==========================================
router.get('/todos', authMiddleware, getTodos);
router.post('/todos', authMiddleware, validateTodo, createTodo);

export default router;`,
            },
          },
          {
            stepNumber: 2,
            title: 'Buat Konfigurasi Express (src/app.ts)',
            description: 'Di dalam be/src (di luar sub-folder), buat file app.ts untuk mendaftarkan konfigurasi Express (CORS, JSON parser) dan menyambungkan rute dari api.ts:',
            instructions: [
              'Buat file app.ts langsung di dalam be/src/',
              'Tempel kode konfigurasi Express berikut:',
            ],
            codeSnippet: {
              filename: 'be/src/app.ts',
              language: 'typescript',
              description: 'Express App Configuration & Routing',
              code: `import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import apiRoutes from './routes/api';

const app: Application = express();

// Konfigurasi Middlewares Express
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Menyambungkan rute dari api.ts
app.use('/api', apiRoutes);

// Endpoint Health Check
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Backend Express API (TypeScript) siap digunakan!',
  });
});

export default app;`,
            },
          },
          {
            stepNumber: 3,
            title: 'Buat Server Listener (src/server.ts)',
            description: 'Di dalam be/src (di luar sub-folder), buat file server.ts untuk membaca environment variables dan menjalankan aplikasi (app.listen):',
            instructions: [
              'Buat file server.ts langsung di dalam be/src/',
              'Tempel kode server listener berikut:',
            ],
            codeSnippet: {
              filename: 'be/src/server.ts',
              language: 'typescript',
              description: 'Entry Point Server Listener',
              code: `import dotenv from 'dotenv';

// Membaca environment variables dari file .env
dotenv.config();

import app from './app';
import pool from './config/db';

const PORT = process.env.PORT || 5000;

// Menguji koneksi database pool dan menjalankan server
const startServer = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✓ Database MySQL Connection Pool berhasil terhubung.');
    connection.release();
  } catch (error) {
    console.error('✗ Peringatan: Gagal terhubung ke MySQL:', error);
  }

  app.listen(PORT, () => {
    console.log(\`🚀 Server Express berjalan di http://localhost:\${PORT}\`);
    console.log(\`📡 Rute API siap di http://localhost:\${PORT}/api\`);
  });
};

startServer();`,
            },
          },
          {
            stepNumber: 4,
            title: 'Sesuaikan Script dev di package.json & Jalankan Server',
            description: 'Perbarui script "dev" di be/package.json agar mengarah ke src/server.ts, lalu jalankan server:',
            instructions: [
              'Buka be/package.json dan perbarui script "dev": "nodemon --watch src --exec ts-node src/server.ts"',
              'Jalankan npm run dev di terminal folder be',
            ],
            codeSnippet: {
              filename: 'terminal',
              language: 'bash',
              description: 'Menjalankan server backend',
              code: 'npm run dev',
            },
            verification: {
              action: 'Amati terminal setelah menjalankan "npm run dev"',
              expectedResult: 'Server Express berjalan di http://localhost:5000 dan log koneksi MySQL pool berhasil terhubung.',
            },
          },
        ],
      },

      // -------------------------------------------------------------
      // TASK 10: Checkpoint 9 - Uji Coba Integrasi Auth FE & BE
      // -------------------------------------------------------------
      {
        taskNumber: 10,
        title: 'Uji Integrasi Auth FE-BE',
        description: 'Menjalankan basis data MySQL, server backend Express, frontend Next.js, dan memverifikasi integrasi login end-to-end langsung di browser:',
        steps: [
          {
            stepNumber: 1,
            title: 'Pastikan Database MySQL Menyala',
            description: 'Sebelum menjalankan server backend dan frontend, pastikan service database MySQL lokal dalam status aktif:',
            instructions: [
              'Jika Anda menggunakan XAMPP, buka XAMPP Control Panel.',
              'Klik tombol Start pada modul MySQL sampai indikator berubah menjadi hijau (Port 3306 aktif).',
              'Jika menggunakan MySQL standalone atau Docker, pastikan service mysql berjalan normal.',
            ],
            verification: {
              action: 'Periksa status port 3306 atau akses phpMyAdmin di http://localhost/phpmyadmin',
              expectedResult: 'Database MySQL aktif dan siap menerima query koneksi.',
            },
          },
          {
            stepNumber: 2,
            title: 'Jalankan Server Backend (BE)',
            description: 'Buka jendela Terminal atau Command Prompt (CMD / PowerShell). Masuk ke folder backend dan jalankan server:',
            instructions: [
              'Buka Terminal di direktori proyek.',
              'Masuk ke folder backend: cd be (atau cd d:\\dashboard\\be)',
              'Jalankan server backend: npm run dev',
              'Tunggu sampai pesan koneksi pool dan listener server muncul.',
            ],
            codeSnippet: {
              filename: 'terminal-backend',
              language: 'bash',
              description: 'Menjalankan backend Express',
              code: `cd be
npm run dev`,
            },
            verification: {
              action: 'Amati pesan log di terminal backend',
              expectedResult: 'Muncul pesan:\n✓ Berhasil terhubung ke database MySQL (Connection Pool siap)\n🚀 Server berjalan pada: http://localhost:5000',
            },
          },
          {
            stepNumber: 3,
            title: 'Jalankan Server Frontend (FE)',
            description: 'Buka jendela Terminal baru (jangan tutup terminal backend). Masuk ke folder frontend dan jalankan server Next.js:',
            instructions: [
              'Buka jendela atau tab terminal baru di VS Code.',
              'Masuk ke folder frontend: cd frontend (atau cd d:\\dashboard\\fe)',
              'Jalankan server frontend: npm run dev',
              'Tunggu sampai pesan aplikasi berjalan di http://localhost:3000.',
            ],
            codeSnippet: {
              filename: 'terminal-frontend',
              language: 'bash',
              description: 'Menjalankan frontend Next.js',
              code: `cd frontend
npm run dev`,
            },
            verification: {
              action: 'Amati log terminal frontend',
              expectedResult: 'Aplikasi Next.js berjalan dan siap di http://localhost:3000.',
            },
          },
          {
            stepNumber: 4,
            title: 'Buka Halaman Login di Browser',
            description: 'Buka web browser favorit Anda (Google Chrome, Edge, Safari, Firefox) lalu kunjungi alamat login:',
            instructions: [
              'Buka web browser.',
              'Kunjungi alamat: http://localhost:3000/login',
              'Pastikan formulir login tampil lengkap dengan input email, password, tombol masuk, dan pill akun demo.',
            ],
            verification: {
              action: 'Buka http://localhost:3000/login di browser',
              expectedResult: 'Formulir login tampil lengkap dan responsif.',
            },
          },
          {
            stepNumber: 5,
            title: 'Uji Coba Skenario Login (Sukses & Gagal)',
            description: 'Uji dua skenario utama untuk memastikan integrasi FE-BE dan proteksi rute berfungsi sempurna:',
            instructions: [
              'Skenario Berhasil (Login Sukses): Klik tombol kecil "Isi Akun Admin" di bagian bawah formulir (atau ketik manual admin@univ.ac.id dengan kata sandi adminpassword). Klik tombol hitam "Masuk Sekarang". Sistem akan memvalidasi ke database MySQL backend, dan Anda akan langsung diarahkan ke halaman Mahasiswa / Dashboard. Perhatikan di pojok kiri bawah menu samping: nama dan email admin aktif terlihat di sana. Klik ikon Keluar / Logout di samping nama profil untuk keluar kembali ke login.',
              'Skenario Gagal (Uji Keamanan): Masukkan email sembarang atau masukkan kata sandi yang salah (misal: salah123). Klik "Masuk Sekarang". Backend akan menolak dan Anda akan melihat kotak merah bertuliskan: "Email atau kata sandi tidak valid."',
            ],
            verification: {
              action: 'Coba kedua skenario di halaman login browser',
              expectedResult: 'Login sukses berhasil mengarahkan ke dashboard dengan profil aktif, dan login salah memunculkan notifikasi merah penolakan dari backend.',
            },
          },
        ],
      },
    ],
    // Backward compatibility
    steps: [
      { title: 'Setup Folder Project', description: 'mkdir [nama-project]' },
      { title: 'Checkpoint 1: Setup FE', description: 'npx create-next-app@latest frontend' },
      { title: 'Checkpoint 2: Setup BE', description: 'npm init -y, express, typescript, nodemon' },
      { title: 'Checkpoint 3: Koneksi DB & Migration', description: 'Sequelize, .env, migration runner' },
      { title: 'Checkpoint 4: Setup Seeder', description: 'Seeder data awal & runner' },
      { title: 'Checkpoint 5: Setup Config & Models', description: 'db.ts pool, userModel.ts, todoModel.ts SQL murni' },
      { title: 'Checkpoint 6: Setup Middlewares', description: 'validator.ts & authMiddleware.ts JWT' },
      { title: 'Checkpoint 7: Setup Controllers', description: 'authController.ts (bcrypt & JWT) & todoController.ts' },
      { title: 'Checkpoint 8: Setup Routes & Server', description: 'api.ts, app.ts (CORS, parser), server.ts (listen)' },
      { title: 'Checkpoint 9: Uji Integrasi Auth FE-BE', description: 'Menjalankan MySQL, BE, FE, dan testing login sukses & gagal di browser' },
    ],
    fileTree: [
      { path: 'frontend/', type: 'folder', status: 'added', description: 'Frontend Next.js (Port 3000)' },
      { path: 'be/src/index.ts', type: 'file', status: 'added', description: 'Backend Express TypeScript (Port 5000)' },
      { path: 'be/.env', type: 'file', status: 'added', description: 'Konfigurasi Environment Variable DB' },
      { path: 'be/src/db/config/database.ts', type: 'file', status: 'added', description: 'Koneksi Sequelize MySQL' },
      { path: 'be/src/db/migrations/001-create-users.ts', type: 'file', status: 'added', description: 'Migration Schema Tabel' },
      { path: 'be/src/db/migrations/run.ts', type: 'file', status: 'added', description: 'Runner Migration' },
      { path: 'be/src/db/seeders/001-seed-users.ts', type: 'file', status: 'added', description: 'Seeder Data Awal' },
      { path: 'be/src/db/seeders/run.ts', type: 'file', status: 'added', description: 'Runner Seeder' },
      { path: 'be/src/config/db.ts', type: 'file', status: 'added', description: 'MySQL Connection Pool' },
      { path: 'be/src/models/userModel.ts', type: 'file', status: 'added', description: 'Model User (Query SQL Murni)' },
      { path: 'be/src/models/todoModel.ts', type: 'file', status: 'added', description: 'Model Todo (Query SQL Murni)' },
      { path: 'be/src/middlewares/validator.ts', type: 'file', status: 'added', description: 'Middleware Validator Data' },
      { path: 'be/src/middlewares/authMiddleware.ts', type: 'file', status: 'added', description: 'Middleware Otorisasi JWT' },
      { path: 'be/src/controllers/authController.ts', type: 'file', status: 'added', description: 'Controller Auth (Bcrypt & JWT)' },
      { path: 'be/src/controllers/todoController.ts', type: 'file', status: 'added', description: 'Controller Todo (res.locals.userId)' },
      { path: 'be/src/routes/api.ts', type: 'file', status: 'added', description: 'Daftar Rute API Express' },
      { path: 'be/src/app.ts', type: 'file', status: 'added', description: 'Konfigurasi Express (CORS & JSON parser)' },
      { path: 'be/src/server.ts', type: 'file', status: 'added', description: 'Entry Point Server (dotenv & app.listen)' },
    ],
    codeSnippets: [],
    acceptanceCriteria: [
      {
        id: 'ac-1',
        text: 'Folder root proyek membungkus folder frontend/ dan be/.',
      },
      {
        id: 'ac-2',
        text: 'Frontend Next.js berjalan di http://localhost:3000.',
      },
      {
        id: 'ac-3',
        text: 'Backend Express TypeScript berjalan di http://localhost:5000 dengan autoreload nodemon.',
      },
      {
        id: 'ac-4',
        text: 'Koneksi Sequelize berhasil terhubung ke database MySQL lokal.',
      },
      {
        id: 'ac-5',
        text: 'Migration berhasil dieksekusi via "npm run migrate" dan tabel terbentuk di basis data.',
      },
      {
        id: 'ac-6',
        text: 'Seeder berhasil diinjeksi via "npm run seed" dan data awal berhasil tersimpan di tabel.',
      },
      {
        id: 'ac-7',
        text: 'Connection pool MySQL (src/config/db.ts) berhasil terhubung ke basis data.',
      },
      {
        id: 'ac-8',
        text: 'Model userModel.ts dan todoModel.ts menggunakan query SQL murni dan berjalan sesuai fungsi.',
      },
      {
        id: 'ac-9',
        text: 'Middleware validator.ts memverifikasi kelengkapan username, email, password, dan task.',
      },
      {
        id: 'ac-10',
        text: 'Middleware authMiddleware.ts memverifikasi header Bearer JWT dan menyimpan userId di res.locals.userId.',
      },
      {
        id: 'ac-11',
        text: 'Endpoint POST /api/register mengenkripsi password dengan bcrypt dan menyimpan user baru.',
      },
      {
        id: 'ac-12',
        text: 'Endpoint POST /api/login mencocokkan password dengan bcrypt dan menghasilkan JWT token.',
      },
      {
        id: 'ac-13',
        text: 'Endpoint GET & POST /api/todos terlindungi JWT dan berhasil membaca serta menambah todo sesuai userId pengguna.',
      },
      {
        id: 'ac-14',
        text: 'Aplikasi berjalan via src/server.ts dengan middleware CORS dan JSON parser terkonfigurasi di src/app.ts.',
      },
      {
        id: 'ac-15',
        text: 'Frontend Next.js terhubung ke Backend Express dan berhasil melakukan login dengan akun dari basis data MySQL.',
      },
      {
        id: 'ac-16',
        text: 'Validasi keamanan login berhasil menolak kredensial yang salah dengan pesan error yang sesuai.',
      },
      {
        id: 'ac-17',
        text: 'Profil pengguna aktif tampil di antarmuka dashboard dan mekanisme logout berhasil membersihkan sesi login.',
      },
    ],
    gitStandard: {
      branchName: 'feat/auth-todo-backend',
      commitExample: 'feat(auth): integrate backend authentication with frontend login and session management',
      prTitle: 'feat: implement end-to-end authentication and testing workflow',
    },
    pitfalls: [
      {
        symptom: 'Error ECONNREFUSED saat koneksi ke MySQL',
        cause: 'Service MySQL di XAMPP / local belum dinyalakan atau port salah.',
        solution: 'Buka XAMPP Control Panel dan pastikan modul MySQL sudah berstatus "Running" di port 3306.',
      },
      {
        symptom: 'CORS policy blocked saat login dari frontend Next.js',
        cause: 'Backend Express belum mengaktifkan cors middleware dengan origin frontend yang benar.',
        solution: 'Pastikan app.use(cors()) sudah dipasang sebelum deklarasi routes di be/src/index.ts.',
      },
      {
        symptom: 'Error JsonWebTokenError (jwt malformed / invalid signature)',
        cause: 'Token JWT tidak terkirim di Header Authorization atau JWT_SECRET tidak sinkron.',
        solution: 'Pastikan header Authorization dikirim dengan format "Bearer <token>" dan JWT_SECRET di .env terisi.',
      },
    ],
    nextStep: {
      title: 'Form Handling & Validasi Schema',
      slug: '02-form-handling',
      description: 'Materi berikutnya: validasi schema Zod, Server Actions, dan mutasi data.',
    },
  },

  // =============================================================
  // MODUL 02: Form Handling, Autentikasi DAL, & Mutasi Data
  // =============================================================
  MODULE_02,
];

export const PHASE_GROUPS: PhaseGroup[] = [
  {
    id: 'fase-1',
    number: 1,
    title: 'Fase 1: Setup Proyek & Auth',
    description: 'Inisialisasi workspace: Frontend Next.js, Backend Express TypeScript, MySQL pool, dan otentikasi JWT.',
    modules: DOC_MODULES.filter((m) => m.phaseId === 'fase-1'),
  },
  {
    id: 'fase-2',
    number: 2,
    title: 'Fase 2: Form Handling, Auth DAL & Mutasi Data',
    description: 'Penerapan autentikasi DAL, validasi Zod terpadu, Server Actions, proteksi IDOR, dan Optimistic UI di Next.js.',
    modules: DOC_MODULES.filter((m) => m.phaseId === 'fase-2'),
  },
];
