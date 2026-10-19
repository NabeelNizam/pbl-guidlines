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
  // MODUL 02: Form Handling, Validasi Schema, dan Mutasi Data
  // =============================================================
  {
    slug: '02-form-handling',
    phaseId: 'fase-2',
    order: 2,
    title: 'Form Handling & Validasi Schema',
    subtitle: 'Panduan praktik penerapan form handling, validasi schema Zod, dan mutasi data Server Actions pada project Frontend Next.js (folder fe/).',
    category: 'core-standard',
    layer: 'frontend',
    estimatedMinutes: 25,
    tujuan: 'Menerapkan form handling dan validasi schema Zod di dalam folder Frontend Next.js (fe/), menghubungkan Client Form ke Server Action, dan mengeksekusi mutasi ke database atau API Express Backend.',
    prasyarat: ['Next.js v15+ (App Router)', 'Node.js v18+', 'Zod'],
    tasks: [
      'Langkah 1: Tentukan Satu Fitur pada Project-mu',
      'Langkah 2: Buat Schema Validasi Zod',
      'Langkah 3: Buat File Server Action (di Folder FE)',
      'Langkah 4: Buat atau Sesuaikan Komponen Form',
      'Langkah 5: Pasang Query Mutasi Database / API BE',
      'Langkah 6: Pastikan Revalidasi Bekerja',
      'Langkah 7: Uji Coba Form di Browser',
      'Langkah 8: Kembangkan ke Fitur Hapus / Delete',
      'Langkah 9: Pengembangan Lanjutan (Opsional)',
    ],
    adaptationTable: [
      {
        aspect: 'Lokasi Pengerjaan',
        universalExample: 'Folder Frontend (fe/ atau frontend/)',
        projectExampleA: 'd:\\dashboard\\fe\\ (Next.js)',
        projectExampleB: 'fe/app/(dashboard)/...',
      },
      {
        aspect: 'Fitur Form Entitas',
        universalExample: 'Item (nama, kategori, jumlah)',
        projectExampleA: 'Mahasiswa (nim, nama, jurusan)',
        projectExampleB: 'Produk (kode, nama, harga, stok)',
      },
      {
        aspect: 'Schema Validasi',
        universalExample: 'fe/lib/validations.ts',
        projectExampleA: 'fe/lib/validations/mahasiswa.ts',
        projectExampleB: 'fe/lib/validations/product.ts',
      },
      {
        aspect: 'File Server Action',
        universalExample: 'fe/actions/item-action.ts',
        projectExampleA: 'fe/app/(dashboard)/mahasiswa/actions.ts',
        projectExampleB: 'fe/actions/product-action.ts',
      },
      {
        aspect: 'Komponen Form',
        universalExample: 'fe/components/ItemForm.tsx',
        projectExampleA: 'fe/app/.../components/MahasiswaModal.tsx',
        projectExampleB: 'fe/components/ProductForm.tsx',
      },
    ],
    practicalTasks: [
      // -------------------------------------------------------------
      // TASK 1: Tentukan Satu Fitur pada Project-mu
      // -------------------------------------------------------------
      {
        taskNumber: 1,
        title: 'Tentukan Fitur & Pasang Zod (di Folder FE)',
        description: 'Pilih satu fitur formulir (Create/Tambah Data) di project Frontend Next.js milikmu. Pastikan package zod terpasang di folder FE:',
        steps: [
          {
            stepNumber: 1,
            title: 'Pilih Fitur Form & Pasang Package Zod di Folder FE',
            description: 'Buka terminal, pastikan masuk ke folder frontend (fe/), catat field input yang dibutuhkan (misal: nim, nama, jurusan), lalu install zod:',
            instructions: [
              'Buka terminal dan pastikan kamu berada di folder FRONTEND (fe/), BUKAN di backend:',
              'Catat field input apa saja yang dibutuhkan oleh fitur formulir yang kamu pilih.',
              'Jalankan perintah berikut di folder FE untuk memasang Zod:',
            ],
            codeSnippet: {
              filename: 'terminal (folder fe/)',
              language: 'bash',
              description: 'Masuk ke folder FE lalu install zod',
              code: `cd fe
npm install zod`,
            },
            verification: {
              action: 'Periksa file fe/package.json di project-mu',
              expectedResult: 'Tercantum "zod" pada daftar dependencies di package.json frontend.',
            },
          },
        ],
      },

      // -------------------------------------------------------------
      // TASK 2: Buat Schema Validasi Zod
      // -------------------------------------------------------------
      {
        taskNumber: 2,
        title: 'Buat Schema Validasi Zod (di Folder FE)',
        description: 'Buat schema di folder FE untuk menentukan aturan data yang boleh masuk (apakah teks, angka, batas minimal karakter, format email, dsb):',
        steps: [
          {
            stepNumber: 1,
            title: 'Buat File Schema di Folder FE',
            description: 'Di folder Frontend (fe/), buat file schema Zod (misal: fe/lib/validations.ts atau fe/lib/validations/mahasiswa.ts) sesuai field entitasmu:',
            instructions: [
              'Buat file baru di folder FE: fe/lib/validations.ts (atau fe/lib/validations/mahasiswa.ts).',
              'Ganti nama, kategori, dan jumlah dengan field database project-mu (misal: nim, nama, jurusan):',
            ],
            codeSnippet: {
              filename: 'fe/lib/validations.ts',
              language: 'typescript',
              description: 'Schema validasi Zod dan inferred type di folder FE',
              code: `import { z } from "zod";

// Sesuaikan nama schema dan field-nya dengan kebutuhan project-mu
export const ItemSchema = z.object({
  nama: z
    .string()
    .min(3, "Nama minimal harus 3 karakter")
    .max(100, "Nama terlalu panjang"),
  kategori: z
    .string()
    .min(1, "Kategori wajib dipilih"),
  jumlah: z.coerce
    .number()
    .min(1, "Jumlah minimal 1"),
});

// Tipe data otomatis dari schema Zod (opsional tapi sangat berguna)
export type ItemFormData = z.infer<typeof ItemSchema>;`,
            },
            verification: {
              action: 'Pastikan file di folder FE tersimpan tanpa error linting',
              expectedResult: 'ItemSchema dan ItemFormData berhasil diekspor dengan benar.',
            },
          },
        ],
      },

      // -------------------------------------------------------------
      // TASK 3: Buat File Server Action (di Folder FE)
      // -------------------------------------------------------------
      {
        taskNumber: 3,
        title: 'Buat Server Action (di Folder Frontend / FE)',
        description: '⚠️ PENTING: File ini DIBUAT DI FOLDER FRONTEND (FE), BUKAN DI BE!\nServer Action ("use server") adalah fitur eksklusif Next.js App Router (FE). Meskipun berjalan di sisi server, file ini berada di dalam folder FE (port 3000) untuk menerima submit data form dan melakukan mutasi/memanggil API backend.\n\nLokasi file yang bisa kamu pilih di folder FE:\n• Opsi 1 (Disatukan per-fitur / Colocated - Direkomendasikan): fe/app/(dashboard)/mahasiswa/actions.ts\n• Opsi 2 (Folder actions terpusat): fe/actions/item-action.ts',
        steps: [
          {
            stepNumber: 1,
            title: 'Buat File Server Action di Folder FE',
            description: 'Buat file action di dalam folder Frontend (fe/):',
            instructions: [
              'Buat file di folder FE: fe/actions/item-action.ts atau fe/app/(dashboard)/mahasiswa/actions.ts.',
              'Tulis direktif "use server" di baris paling atas agar fungsi dieksekusi di sisi server Next.js.',
              'Gunakan safeParse untuk memvalidasi input dari FormData secara aman sebelum mutasi:',
            ],
            codeSnippet: {
              filename: 'fe/actions/item-action.ts (atau fe/app/.../actions.ts)',
              language: 'typescript',
              description: 'Server Action Next.js di folder FE dengan validasi Zod safeParse',
              code: `"use server";

import { revalidatePath } from "next/cache";
import { ItemSchema } from "@/lib/validations"; // sesuaikan path import schema-mu di FE

// Tipe state untuk mengembalikan error atau pesan sukses ke form
export type FormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function createItemAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // 1. Ambil data dari form input
  const rawData = {
    nama: formData.get("nama"),
    kategori: formData.get("kategori"),
    jumlah: formData.get("jumlah"),
  };

  // 2. Validasi data menggunakan Zod
  const validatedFields = ItemSchema.safeParse(rawData);

  // 3. Jika validasi gagal, kembalikan daftar error ke form
  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validasi gagal. Periksa kembali form isian Anda.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 4. Jika valid, jalankan mutasi data (lihat Langkah 5)
  try {
    const data = validatedFields.data;

    // TODO: Ganti bagian ini dengan query database atau fetch ke backend Express
    console.log("Data siap disimpan:", data);

    // 5. Perbarui cache halaman agar data terbaru langsung muncul
    revalidatePath("/items"); // sesuaikan dengan path rute halamanmu (misal: /mahasiswa)

    return {
      success: true,
      message: "Data berhasil disimpan!",
    };
  } catch (error) {
    return {
      success: false,
      message: "Terjadi kesalahan saat menyimpan data.",
    };
  }
}`,
            },
          },
        ],
      },

      // -------------------------------------------------------------
      // TASK 4: Buat atau Sesuaikan Komponen Form
      // -------------------------------------------------------------
      {
        taskNumber: 4,
        title: 'Komponen Form (useActionState di Folder FE)',
        description: 'Di folder FE, buka atau buat file tampilan form (misal: fe/app/(dashboard)/mahasiswa/components/MahasiswaModal.tsx atau fe/components/ItemForm.tsx). Jadikan Client Component dengan "use client":',
        steps: [
          {
            stepNumber: 1,
            title: 'Buat Komponen Form di Folder FE',
            description: 'Gunakan hook useActionState dari React untuk menghubungkan Form dengan Server Action:',
            instructions: [
              'Buat file tampilan form di folder FE (misal: fe/components/ItemForm.tsx atau modal form).',
              'Tambahkan "use client" di baris paling atas.',
              'Import createItemAction dari file action FE yang dibuat pada Langkah 3.',
              'Pastikan setiap atribut name pada input sama persis dengan field di rawData Server Action.',
            ],
            codeSnippet: {
              filename: 'fe/components/ItemForm.tsx',
              language: 'tsx',
              description: 'Form Client Component dengan hook useActionState di FE',
              code: `"use client";

import { useActionState } from "react";
import { createItemAction, FormState } from "@/actions/item-action"; // sesuaikan path file action di FE

const initialState: FormState = {
  success: false,
  message: "",
};

export function ItemForm() {
  const [state, formAction, isPending] = useActionState(
    createItemAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-4 max-w-md">
      {/* Pesan status umum */}
      {state.message && (
        <div
          className={\`p-3 rounded text-sm \${
            state.success
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }\`}
        >
          {state.message}
        </div>
      )}

      {/* Field 1: Nama */}
      <div>
        <label className="block text-sm font-medium mb-1">Nama</label>
        <input
          type="text"
          name="nama" // Wajib ada: nama attribute harus sama dengan rawData di action
          placeholder="Masukkan nama"
          className="w-full border p-2 rounded"
          disabled={isPending}
        />
        {/* Tampilkan pesan error jika ada */}
        {state.errors?.nama && (
          <p className="text-red-500 text-xs mt-1">{state.errors.nama[0]}</p>
        )}
      </div>

      {/* Field 2: Kategori */}
      <div>
        <label className="block text-sm font-medium mb-1">Kategori</label>
        <input
          type="text"
          name="kategori"
          placeholder="Masukkan kategori"
          className="w-full border p-2 rounded"
          disabled={isPending}
        />
        {state.errors?.kategori && (
          <p className="text-red-500 text-xs mt-1">
            {state.errors.kategori[0]}
          </p>
        )}
      </div>

      {/* Field 3: Jumlah / Angka */}
      <div>
        <label className="block text-sm font-medium mb-1">Jumlah</label>
        <input
          type="number"
          name="jumlah"
          placeholder="0"
          className="w-full border p-2 rounded"
          disabled={isPending}
        />
        {state.errors?.jumlah && (
          <p className="text-red-500 text-xs mt-1">{state.errors.jumlah[0]}</p>
        )}
      </div>

      {/* Tombol Simpan */}
      <button
        type="submit"
        disabled={isPending}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isPending ? "Menyimpan..." : "Simpan Data"}
      </button>
    </form>
  );
}`,
            },
          },
        ],
      },

      // -------------------------------------------------------------
      // TASK 5: Pasang Query Mutasi Database Sebenarnya
      // -------------------------------------------------------------
      {
        taskNumber: 5,
        title: 'Pasang Query Mutasi (Prisma atau API Backend Express)',
        description: 'Buka kembali file Server Action di folder FE pada Langkah 3. Hubungkan blok try dengan salah satu skenario arsitektur project-mu:',
        steps: [
          {
            stepNumber: 1,
            title: 'Hubungkan Mutasi di Server Action FE',
            description: 'Jika kamu memiliki Backend Express terpisah di folder be/ (port 5000), panggil fetch API. Jika Next.js langsung ke database, gunakan Prisma/Drizzle:',
            instructions: [
              'Buka file Server Action di folder FE (misal: fe/app/(dashboard)/mahasiswa/actions.ts).',
              'Skenario A (FE + BE Express terpisah): Panggil fetch("http://localhost:5000/api/...") dari dalam Server Action FE.',
              'Skenario B (Fullstack Next.js): Panggil langsung query ORM Prisma / Drizzle.',
            ],
            codeSnippet: {
              filename: 'fe/actions/item-action.ts (atau fe/app/.../actions.ts)',
              language: 'typescript',
              description: 'Skenario Mutasi: API Express BE atau Direct Prisma di Server Action FE',
              code: `// SKENARIO A: Jika project-mu memakai Backend Express terpisah (port 5000)
// Server Action di FE ini mengirimkan HTTP request ke endpoint Express BE:
const response = await fetch("http://localhost:5000/api/mahasiswa", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    // Sertakan token JWT jika endpoint backend Express diproteksi authMiddleware:
    // "Authorization": \`Bearer \${token}\`,
  },
  body: JSON.stringify(validatedFields.data),
});

if (!response.ok) {
  const errBody = await response.json().catch(() => ({}));
  throw new Error(errBody.message || "Gagal menyimpan ke backend Express");
}

// SKENARIO B: Jika project-mu Fullstack Next.js (Database langsung diakses dari Next.js)
// await prisma.mahasiswa.create({
//   data: validatedFields.data,
// });`,
            },
          },
        ],
      },

      // -------------------------------------------------------------
      // TASK 6: Pastikan Revalidasi Bekerja
      // -------------------------------------------------------------
      {
        taskNumber: 6,
        title: 'Revalidasi Path Cache (di Server Action FE)',
        description: 'Di baris setelah penyimpanan database/API berhasil pada file Server Action di folder FE, panggil revalidatePath:',
        steps: [
          {
            stepNumber: 1,
            title: 'Panggil revalidatePath di Akhir Action FE',
            description: 'Gunakan revalidatePath agar saat pengguna kembali melihat halaman daftar data, Next.js otomatis mengambil data paling baru tanpa refresh manual:',
            instructions: [
              'Import revalidatePath dari "next/cache" di file Server Action FE.',
              'Masukkan path URL tempat tabel data ditampilkan (misal: /mahasiswa atau /items):',
            ],
            codeSnippet: {
              filename: 'fe/actions/item-action.ts (atau fe/app/.../actions.ts)',
              language: 'typescript',
              description: 'Revalidasi cache rute halaman di FE',
              code: `import { revalidatePath } from "next/cache";

// Masukkan path halaman tempat tabel/daftar data ditampilkan
revalidatePath("/mahasiswa"); // atau "/items"`,
            },
            verification: {
              action: 'Submit form data baru dan periksa tabel data di browser',
              expectedResult: 'Data yang baru dimasukkan langsung tampil pada tabel secara otomatis.',
            },
          },
        ],
      },

      // -------------------------------------------------------------
      // TASK 7: Uji Coba Form di Browser
      // -------------------------------------------------------------
      {
        taskNumber: 7,
        title: 'Uji Coba Form di Browser',
        description: 'Jalankan server pengembangan project-mu (npm run dev), buka browser, dan lakukan dua pengujian berikut:',
        steps: [
          {
            stepNumber: 1,
            title: 'Jalankan Pengujian Validasi & Mutasi',
            description: 'Uji skenario gagal (input tidak valid) dan skenario berhasil (input valid):',
            instructions: [
              '1. Uji Skenario Gagal (Validasi): Biarkan form kosong atau masukkan data yang tidak memenuhi aturan Zod (misalnya nama hanya 1 huruf). Klik tombol submit. Hasil yang diharapkan: Form tidak tersimpan, pesan error spesifik muncul persis di bawah masing-masing kolom input yang salah.',
              '2. Uji Skenario Berhasil (Mutasi): Isi semua kolom dengan data yang valid dan benar. Klik tombol submit. Hasil yang diharapkan: Tombol berubah menjadi "Menyimpan...", pesan sukses muncul, dan data baru berhasil masuk ke daftar/database.',
            ],
            verification: {
              action: 'Amati pesan error spesifik dan hasil penambahan data',
              expectedResult: 'Error validasi Zod tertampil per-field, dan data valid tersimpan dengan pesan sukses.',
            },
          },
        ],
      },

      // -------------------------------------------------------------
      // TASK 8: Kembangkan ke Fitur Hapus / Delete (Jika Tersedia)
      // -------------------------------------------------------------
      {
        taskNumber: 8,
        title: 'Fitur Hapus / Delete',
        description: 'Jika di tabel data project-mu sudah ada tombol hapus, kamu bisa menerapkan Server Action serupa yang lebih ringkas:',
        steps: [
          {
            stepNumber: 1,
            title: 'Buat Fungsi deleteItemAction & Hubungkan ke Tombol',
            description: 'Tambahkan fungsi delete di file action lalu pasangkan form action pada tombol hapus:',
            instructions: [
              'Tambahkan fungsi deleteItemAction di file actions/item-action.ts:',
            ],
            codeSnippet: {
              filename: 'actions/item-action.ts',
              language: 'typescript',
              description: 'Server Action untuk menghapus data',
              code: `export async function deleteItemAction(id: string | number) {
  // Mutasi hapus di database
  // await prisma.namaTabelMu.delete({ where: { id } });

  revalidatePath("/items");
}`,
            },
          },
          {
            stepNumber: 2,
            title: 'Pasang pada Komponen Tabel Data',
            description: 'Hubungkan tombol hapus pada tabel menggunakan bind id:',
            instructions: [
              'Bungkus tombol hapus dengan form action deleteItemAction.bind(null, item.id):',
            ],
            codeSnippet: {
              filename: 'components/ItemTable.tsx',
              language: 'tsx',
              description: 'Tombol hapus dengan form action bind',
              code: `<form action={deleteItemAction.bind(null, item.id)}>
  <button type="submit" className="text-red-600 hover:underline text-sm">
    Hapus
  </button>
</form>`,
            },
          },
        ],
      },

      // -------------------------------------------------------------
      // TASK 9: Pengembangan Lanjutan (Opsional)
      // -------------------------------------------------------------
      {
        taskNumber: 9,
        title: 'Pengembangan Lanjutan (Opsional)',
        description: 'Langkah ini bersifat opsional. Jika alur form pada Langkah 1 sampai 8 sudah berhasil berjalan di project-mu, kamu sudah memenuhi syarat dasar.\n\nPanduan Memilih:\n• Fitur sudah jalan & ingin kumpulkan tugas? 👉 Cukup sampai Langkah 8.\n• Form panjang & butuh validasi interaktif realtime saat diketik? 👉 Pilih Opsi A (React Hook Form + Zod).\n• Tombol Hapus/Tambah langsung terlihat hasilnya seketika tanpa loading? 👉 Pilih Opsi B (useOptimistic).\n• Ingin Server Action lebih rapi dan standar industri type-safe? 👉 Pilih Opsi C (next-safe-action).',
        steps: [
          {
            stepNumber: 1,
            title: 'Pilihan A: Validasi Interaktif Realtime (React Hook Form + Zod)',
            description: 'Pilih ini jika formulir panjang dan kamu ingin pesan error langsung muncul seketika saat mengetik tanpa menunggu tombol submit ditekan:',
            instructions: [
              'Install library pendukung: npm install react-hook-form @hookform/resolvers',
              'Gunakan resolver zodResolver(ItemSchema) dan mode "onChange":',
            ],
            codeSnippet: {
              filename: 'app/items/components/ItemFormInteractive.tsx',
              language: 'tsx',
              description: 'Validasi realtime dengan React Hook Form + Zod',
              code: `"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ItemSchema, ItemFormData } from "@/lib/validations";

export function ItemFormInteractive() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ItemFormData>({
    resolver: zodResolver(ItemSchema), // Menghubungkan Zod langsung ke form
    mode: "onChange", // Validasi otomatis jalan tiap kali ada ketikan baru
  });

  const onSubmit = async (data: ItemFormData) => {
    // Panggil Server Action atau fetch di sini
    console.log("Data siap dikirim:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Nama</label>
        <input
          {...register("nama")}
          className="w-full border p-2 rounded"
          placeholder="Ketik minimal 3 karakter..."
        />
        {/* Error langsung muncul realtime saat mengetik */}
        {errors.nama && (
          <p className="text-red-500 text-xs mt-1">{errors.nama.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {isSubmitting ? "Memproses..." : "Simpan"}
      </button>
    </form>
  );
}`,
            },
          },
          {
            stepNumber: 2,
            title: 'Pilihan B: Tampilan Instan Tanpa Loading (useOptimistic)',
            description: 'Pilih ini jika ingin saat tombol Hapus atau Tambah Cepat diklik, tampilannya di layar langsung terhapus/berubah seketika tanpa ada jeda loading:',
            instructions: [
              'Gunakan hook useOptimistic di komponen daftar data:',
            ],
            codeSnippet: {
              filename: 'app/items/components/ItemListOptimistic.tsx',
              language: 'tsx',
              description: 'Optimistic UI update dengan useOptimistic',
              code: `"use client";

import { useOptimistic } from "react";
import { deleteItemAction } from "@/actions/item-action";

type Item = { id: number; nama: string };

export function ItemList({ initialItems }: { initialItems: Item[] }) {
  // State optimistik: anggap aksi selalu berhasil langsung di layar
  const [optimisticItems, setOptimisticItems] = useOptimistic(
    initialItems,
    (state, deletedId: number) => state.filter((item) => item.id !== deletedId)
  );

  const handleDelete = async (id: number) => {
    // 1. Hilangkan item dari layar seketika
    setOptimisticItems(id);
    // 2. Jalankan request server di latar belakang
    await deleteItemAction(id);
  };

  return (
    <ul className="space-y-2">
      {optimisticItems.map((item) => (
        <li key={item.id} className="flex justify-between border p-2 rounded">
          <span>{item.nama}</span>
          <button
            onClick={() => handleDelete(item.id)}
            className="text-red-500 hover:underline text-sm"
          >
            Hapus
          </button>
        </li>
      ))}
    </ul>
  );
}`,
            },
          },
          {
            stepNumber: 3,
            title: 'Pilihan C: Server Action Standar Profesional (next-safe-action)',
            description: 'Pilih ini jika ingin menulis Server Action yang sangat rapi, otomatis terproteksi validasi Zod tanpa banyak blok if/else:',
            instructions: [
              'Install package: npm install next-safe-action',
              'Buat actionClient dasar dan bungkus action dengan schema Zod:',
            ],
            codeSnippet: {
              filename: 'actions/safe-item-action.ts',
              language: 'typescript',
              description: 'Type-safe Server Action dengan next-safe-action',
              code: `"use server";

import { createSafeActionClient } from "next-safe-action";
import { ItemSchema } from "@/lib/validations";

export const actionClient = createSafeActionClient();

export const safeCreateItem = actionClient
  .schema(ItemSchema) // Otomatis divalidasi oleh Zod sebelum masuk ke handler
  .action(async ({ parsedInput }) => {
    // parsedInput sudah 100% tervalidasi dan tipe datanya tepat
    console.log("Menyimpan:", parsedInput.nama);

    // Eksekusi mutasi ke database di sini...

    return { success: true };
  });`,
            },
          },
        ],
      },
    ],
    // Backward compatibility
    steps: [
      { title: 'Langkah 1: Tentukan Fitur & Pasang Zod', description: 'npm install zod dan petakan field input' },
      { title: 'Langkah 2: Buat Schema Validasi Zod', description: 'lib/validations.ts dengan z.object & z.infer' },
      { title: 'Langkah 3: Buat Server Action', description: 'actions/item-action.ts dengan "use server" & safeParse' },
      { title: 'Langkah 4: Komponen Form (useActionState)', description: 'ItemForm.tsx Client Component dengan error binding' },
      { title: 'Langkah 5: Mutasi Database Sebenarnya', description: 'Integrasi Prisma / Drizzle / API query' },
      { title: 'Langkah 6: Revalidasi Cache', description: 'revalidatePath("/items") setelah mutasi sukses' },
      { title: 'Langkah 7: Uji Coba Form', description: 'Testing skenario validasi error & data tersimpan' },
      { title: 'Langkah 8: Fitur Hapus / Delete', description: 'Server Action deleteItemAction & form action bind' },
      { title: 'Langkah 9: Pengembangan Lanjutan', description: 'React Hook Form / useOptimistic / next-safe-action' },
    ],
    fileTree: [
      { path: 'fe/lib/validations.ts', type: 'file', status: 'added', description: 'Schema Validasi Zod (di folder FE)' },
      { path: 'fe/actions/item-action.ts', type: 'file', status: 'added', description: 'Server Action Mutasi Data (di folder FE)' },
      { path: 'fe/app/(dashboard)/mahasiswa/actions.ts', type: 'file', status: 'added', description: 'Server Action Colocated per-fitur (Opsi FE)' },
      { path: 'fe/components/ItemForm.tsx', type: 'file', status: 'added', description: 'Client Form (useActionState di folder FE)' },
      { path: 'fe/app/(dashboard)/mahasiswa/page.tsx', type: 'file', status: 'added', description: 'Halaman Fitur Form (di folder FE)' },
    ],
    codeSnippets: [],
    acceptanceCriteria: [
      {
        id: 'ac-f1',
        text: 'Package zod berhasil terpasang di folder FE dan schema validasi terdefinisi dengan aturan tipe dan batas karakter yang jelas.',
      },
      {
        id: 'ac-f2',
        text: 'Server Action dibuat di dalam folder FE dengan direktif "use server", memvalidasi FormData dengan safeParse, dan mengembalikan pesan error terstruktur jika gagal.',
      },
      {
        id: 'ac-f3',
        text: 'Komponen form di folder FE bertipe Client Component ("use client") menggunakan hook useActionState untuk menangani formAction, isPending, dan menampilkan pesan error per-field.',
      },
      {
        id: 'ac-f4',
        text: 'Data baru berhasil tersimpan ke database proyek (via direct ORM atau via fetch ke API Express BE) saat semua kolom terisi valid.',
      },
      {
        id: 'ac-f5',
        text: 'Fungsi revalidatePath dipanggil di akhir Server Action FE setelah mutasi berhasil agar daftar data terupdate otomatis tanpa refresh browser manual.',
      },
      {
        id: 'ac-f6',
        text: 'Pengujian form di browser membuktikan bahwa data tidak valid memunculkan error tepat di bawah field, dan data valid berhasil tersimpan.',
      },
    ],
    gitStandard: {
      branchName: 'feat/form-validation-action',
      commitExample: 'feat(form): implement zod schema validation and server action mutation in fe',
      prTitle: 'feat: add form handling, zod schema validation, and server actions in fe',
    },
    pitfalls: [
      {
        symptom: 'Bingung meletakkan file Server Action: di folder FE atau BE?',
        cause: 'Mengira kata "server" pada Server Action ("use server") berarti harus dibuat di backend Express (be/).',
        solution: 'Server Action adalah fitur Next.js (Frontend). Wajib diletakkan di dalam folder "fe/" (misal: fe/app/(dashboard)/mahasiswa/actions.ts atau fe/actions/item-action.ts). Jika ada backend Express di port 5000, Server Action di FE ini yang memanggil endpoint Express via fetch().',
      },
      {
        symptom: 'Error: Cannot read properties of undefined (reading fieldErrors)',
        cause: 'Lupa memeriksa validatedFields.success sebelum membaca data atau error Zod.',
        solution: 'Selalu gunakan percabangan if (!validatedFields.success) return { errors: validatedFields.error.flatten().fieldErrors }.',
      },
      {
        symptom: 'Tampilan tabel tidak langsung berubah setelah form disubmit',
        cause: 'Lupa memanggil revalidatePath di akhir Server Action setelah proses simpan database selesai.',
        solution: 'Panggil revalidatePath("/path-halaman-tabel-mu") tepat setelah proses database berhasil.',
      },
      {
        symptom: 'Error: Event handlers cannot be passed to Client Component props',
        cause: 'Lupa menambahkan directive "use client" di baris paling atas file komponen form.',
        solution: 'Pastikan file ItemForm.tsx memiliki "use client" di baris pertama.',
      },
    ],
    nextStep: {
      title: 'Authentication & Protected Routes',
      slug: '03-auth-protection',
      description: 'Materi berikutnya: proteksi rute dengan middleware dan manajemen sesi pengguna.',
    },
  },
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
    title: 'Fase 2: Form Handling & Mutasi Data',
    description: 'Penerapan validasi schema Zod, Server Actions, dan mutasi data di Next.js.',
    modules: DOC_MODULES.filter((m) => m.phaseId === 'fase-2'),
  },
];
