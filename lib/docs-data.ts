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
    ],
    // Backward compatibility
    steps: [
      { title: 'Setup Folder Project', description: 'mkdir [nama-project]' },
      { title: 'Checkpoint 1: Setup FE', description: 'npx create-next-app@latest frontend' },
      { title: 'Checkpoint 2: Setup BE', description: 'npm init -y, express, typescript, nodemon' },
      { title: 'Checkpoint 3: Koneksi DB & Migration', description: 'Sequelize, .env, migration runner' },
      { title: 'Checkpoint 4: Setup Seeder', description: 'Seeder data awal & runner' },
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
    ],
    gitStandard: {
      branchName: 'setup/init-project',
      commitExample: 'feat(setup): setup frontend, backend, database migration, and seeders',
      prTitle: 'feat: setup initial workspace and database migration seeders',
    },
    pitfalls: [],
    nextStep: {
      title: 'Pondasi Database & REST API',
      slug: '02-database-setup',
      description: 'Materi berikutnya: konfigurasi model, route, dan controller.',
    },
  },
];

export const PHASE_GROUPS: PhaseGroup[] = [
  {
    id: 'fase-1',
    number: 1,
    title: 'Fase 1: Setup Proyek',
    description: 'Inisialisasi workspace: Frontend Next.js dan Backend Express TypeScript.',
    modules: DOC_MODULES.filter((m) => m.phaseId === 'fase-1'),
  },
];
