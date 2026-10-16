export type CriteriaCategory = 'frontend' | 'backend' | 'database' | 'engineering';

export interface CriterionItem {
  id: string;
  category: CriteriaCategory;
  categoryLabel: string;
  number: number;
  title: string;
  shortDesc: string;
  howToVerify: string;
  codeSnippetExample?: {
    filename: string;
    code: string;
  };
  relatedModuleSlug?: string;
  relatedModuleTitle?: string;
  isCore: boolean;
}

export interface CategorySummary {
  id: CriteriaCategory;
  name: string;
  shortCode: string;
  description: string;
  accentColor: string;
}

export const CRITERIA_CATEGORIES: CategorySummary[] = [
  {
    id: 'frontend',
    name: 'Frontend (Client & UI)',
    shortCode: 'FE',
    description: 'Arsitektur komponen React/Next.js, routing App Router, penanganan form, dan optimasi rendering.',
    accentColor: 'blue',
  },
  {
    id: 'backend',
    name: 'Backend (Server & API)',
    shortCode: 'BE',
    description: 'Arsitektur berlayer (Controller-Service), pipeline middleware terpusat, type safety augmentasi, dan error handling.',
    accentColor: 'emerald',
  },
  {
    id: 'database',
    name: 'Database & Relasi',
    shortCode: 'DB',
    description: 'Efisiensi kueri, migrasi terkontrol, integritas foreign key, dan seeding data praktikum.',
    accentColor: 'amber',
  },
  {
    id: 'engineering',
    name: 'Disiplin Git & Rekayasa',
    shortCode: 'GIT',
    description: 'Disiplin branching, conventional commits, perlindungan kredensial .env, dan smoke testing.',
    accentColor: 'purple',
  },
];

export const WEBSITE_CRITERIA_LIST: CriterionItem[] = [
  // ==========================================
  // FRONTEND (FE)
  // ==========================================
  {
    id: 'fe-app-router',
    category: 'frontend',
    categoryLabel: 'Frontend (FE)',
    number: 1,
    title: 'App Router & Route Grouping',
    shortDesc: 'Struktur rute terpetakan rapi menggunakan Next.js App Router dengan route grouping (misal (dashboard) dan (auth)) untuk isolasi layout tanpa mengotori URL browser.',
    howToVerify: 'Buka folder app/ (atau src/app/). Pastikan rute publik dan dashboard dipisah menggunakan folder grup bertanda kurung. URL di browser tetap bersih tanpa prefix folder grup (misal: /dashboard, /users, /login).',
    relatedModuleSlug: '01-setup-project',
    relatedModuleTitle: '01. Setup Project',
    isCore: true,
    codeSnippetExample: {
      filename: 'app/(dashboard)/layout.tsx',
      code: `// Route Group: (dashboard) mengisolasi sidebar tanpa mempengaruhi URL
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}`,
    },
  },
  {
    id: 'fe-components-per-features',
    category: 'frontend',
    categoryLabel: 'Frontend (FE)',
    number: 2,
    title: 'Components per Features (3-Scope Architecture)',
    shortDesc: 'Komponen tidak ditumpuk dalam satu direktori raksasa, melainkan dibagi ke dalam 3 ruang lingkup (scope): UI generik (@/components/ui), Layout shell (@/components/layout), dan komponen spesifik fitur.',
    howToVerify: 'Cek struktur komponen. Komponen domain seperti tabel pengguna atau kartu transaksi hanya berada di folder fiturnya sendiri, sedangkan tombol (Button, Modal, Input) berada di level global yang reusable.',
    relatedModuleSlug: '02-components-per-page-feature',
    relatedModuleTitle: '02. Components per Page & Feature Scope',
    isCore: true,
    codeSnippetExample: {
      filename: 'Structure: 3-Scope Component',
      code: `components/
├── ui/                 # 1. Global Reusable (Button, Input, Badge)
├── layout/             # 2. Layout Shell (Header, Sidebar, Footer)
└── features/users/     # 3. Feature-Scoped (UserTable, UserFormModal)`,
    },
  },
  {
    id: 'fe-form-validation',
    category: 'frontend',
    categoryLabel: 'Frontend (FE)',
    number: 3,
    title: 'Validasi Form Schema-Based (Zod & React Hook Form)',
    shortDesc: 'Semua input form wajib divalidasi dengan skema tipe yang ketat (misal Zod). Pesan kesalahan muncul secara spesifik dan inline di bawah field input yang bermasalah.',
    howToVerify: 'Coba lakukan submit form dengan data kosong atau email tidak valid. Form harus langsung menampilkan pesan error di bawah field tanpa me-reload halaman browser, dan tombol submit dinonaktifkan saat pengiriman data berlangsung.',
    relatedModuleSlug: '04-form-handling-validation',
    relatedModuleTitle: '04. Form Handling & Client-Side Validation',
    isCore: true,
    codeSnippetExample: {
      filename: 'features/users/schemas/userSchema.ts',
      code: `import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  email: z.string().email('Format email tidak valid'),
  role: z.enum(['ADMIN', 'STAFF', 'USER'], {
    errorMap: () => ({ message: 'Pilih role yang valid' }),
  }),
});`,
    },
  },
  {
    id: 'fe-ssr-rsc',
    category: 'frontend',
    categoryLabel: 'Frontend (FE)',
    number: 4,
    title: 'Optimasi SSR & React Server Components (RSC)',
    shortDesc: 'Halaman halaman utama secara default merupakan Server Component untuk direct data fetching yang cepat & aman. Direktif \'use client\' hanya diletakkan pada komponen interaktif terluar (leaf nodes).',
    howToVerify: 'Periksa file page.tsx. Pastikan tidak ada deklarasi \'use client\' di level root page kecuali benar-benar membutuhkan state browser. Fetch data utama dilakukan langsung di server component tanpa hook useEffect waterfall.',
    relatedModuleSlug: '01-setup-project',
    relatedModuleTitle: '01. Setup Project',
    isCore: true,
    codeSnippetExample: {
      filename: 'app/(dashboard)/users/page.tsx',
      code: `// Server Component by default - Tanpa 'use client'
import { UserService } from '@/services/userService';
import { UserTable } from './_components/UserTable'; // Client component hanya di daun

export default async function UsersPage() {
  const users = await UserService.getAll();
  return <UserTable initialData={users} />;
}`,
    },
  },
  {
    id: 'fe-hooks-libs',
    category: 'frontend',
    categoryLabel: 'Frontend (FE)',
    number: 5,
    title: 'Penggunaan Custom Hooks & Konsistensi UI Libraries',
    shortDesc: 'Logika state interaktif diekstrak ke dalam custom hooks yang modular. Menggunakan pustaka ikon dan komponen yang seragam (misal Lucide icons) tanpa inkonsistensi styling.',
    howToVerify: 'Cek logika seperti debounce pencarian, filter tabel, atau dialog confirmation. Logika tersebut terorganisir dalam hook seperti useDebounce atau useUserFilter, bukan ditulis ulang berkali-kali di setiap komponen.',
    relatedModuleSlug: '02-components-per-page-feature',
    relatedModuleTitle: '02. Components per Page & Feature Scope',
    isCore: false,
    codeSnippetExample: {
      filename: 'hooks/useDebounce.ts',
      code: `import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delayMs: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(handler);
  }, [value, delayMs]);

  return debouncedValue;
}`,
    },
  },

  // ==========================================
  // BACKEND (BE)
  // ==========================================
  {
    id: 'be-modular-routing',
    category: 'backend',
    categoryLabel: 'Backend (BE)',
    number: 1,
    title: 'Modular Routing & Arsitektur Berlayer (Layered Pattern)',
    shortDesc: 'Pemisahan tanggung jawab kode backend yang tegas: Router/Controller hanya mem-parsing request dan mengirim response, sedangkan logika bisnis ditangani Service terpisah.',
    howToVerify: 'Buka controller API backend. Tidak boleh ada query SQL mentah, pemanggilan ORM kompleks, atau perhitungan bisnis langsung di dalam route handler. Semuanya didelegasikan ke UserService atau sejenisnya.',
    relatedModuleSlug: '06-backend-express-architecture',
    relatedModuleTitle: '06. Backend Express Architecture & Clean Route Handlers',
    isCore: true,
    codeSnippetExample: {
      filename: 'controllers/user.controller.ts',
      code: `// Controller tipis: hanya validasi & response
export async function getUsersHandler(req: Request, res: Response) {
  try {
    const users = await userService.listActiveUsers();
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    return next(error);
  }
}`,
    },
  },
  {
    id: 'be-middleware',
    category: 'backend',
    categoryLabel: 'Backend (BE)',
    number: 2,
    title: 'Pipeline Middleware Terpusat (Auth, CORS, Logging, Error)',
    shortDesc: 'Menerapkan middleware pipeline secara konsisten: autentikasi guard token/session, penanganan CORS, request logger, dan global error handler sebelum sampai ke controller.',
    howToVerify: 'Kirim request ke route private tanpa menyertakan authorization header. Sistem harus mengembalikan HTTP 401 secara otomatis dari middleware proteksi tanpa pernah mengeksekusi controller.',
    relatedModuleSlug: '08-authentication-authorization',
    relatedModuleTitle: '08. Authentication, Authorization & Session Management',
    isCore: true,
    codeSnippetExample: {
      filename: 'middlewares/authGuard.ts',
      code: `export function authGuard(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ success: false, message: 'Autentikasi dibutuhkan' });
  }
  const payload = verifyToken(token);
  req.user = payload;
  next();
}`,
    },
  },
  {
    id: 'be-augmentation',
    category: 'backend',
    categoryLabel: 'Backend (BE)',
    number: 3,
    title: 'Augmentasi Request Context & Type Declaration',
    shortDesc: 'Menerapkan TypeScript type declaration augmentation untuk objek Request (Express / Next.js) sehingga data user, tenant, atau token ter-typing kuat tanpa menggunakan type casting (req as any).',
    howToVerify: 'Cari penggunaan (req as any).user di codebase backend. Tidak boleh ada type casting "any" pada objek request; ketik req.user dan pastikan TypeScript mengenali tipe UserId, Role, dsb.',
    relatedModuleSlug: '12-error-handling-security',
    relatedModuleTitle: '12. Error Handling, Validation Boundaries & Security Basics',
    isCore: false,
    codeSnippetExample: {
      filename: 'types/express-augmented.d.ts',
      code: `// Augmentasi deklarasi Express Request agar memiliki req.user bertipe aman
export interface UserPayload {
  id: string;
  email: string;
  role: 'ADMIN' | 'STAFF' | 'USER';
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}`,
    },
  },
  {
    id: 'be-response-format',
    category: 'backend',
    categoryLabel: 'Backend (BE)',
    number: 4,
    title: 'Standardisasi Envelope Response & HTTP Status Codes',
    shortDesc: 'Struktur response JSON seragam di semua endpoint ({ success, data, message, error }) dan menggunakan status code semantik HTTP (200, 201, 400, 401, 403, 404, 500).',
    howToVerify: 'Buka Network tab di browser atau Postman. Tidak boleh ada response error yang mengembalikan status HTTP 200 OK dengan payload { error: "gagal" }. Status code harus sesuai standar REST.',
    relatedModuleSlug: '07-frontend-backend-integration',
    relatedModuleTitle: '07. Frontend-Backend Integration & Contract-Driven API',
    isCore: true,
    codeSnippetExample: {
      filename: 'utils/apiResponse.ts',
      code: `export function sendSuccess(res: Response, data: unknown, message = 'Sukses', status = 200) {
  return res.status(status).json({ success: true, message, data });
}

export function sendError(res: Response, message: string, status = 400, details?: unknown) {
  return res.status(status).json({ success: false, message, details });
}`,
    },
  },
  {
    id: 'be-centralized-error',
    category: 'backend',
    categoryLabel: 'Backend (BE)',
    number: 5,
    title: 'Centralized Error Handling & Exception Safety',
    shortDesc: 'Handler asynchronous dibungkus rapi sehingga tidak ada crash unhandled rejection. Pesan error internal tidak mengekspos stack trace SQL atau informasi sensitif ke pengguna produksi.',
    howToVerify: 'Kirim payload rusak atau panggil ID data yang sengaja dibuat error. Server tidak boleh crash (mati), dan response yang kembali adalah JSON error bersih tanpa membocorkan trace query database.',
    relatedModuleSlug: '12-error-handling-security',
    relatedModuleTitle: '12. Error Handling, Validation Boundaries & Security Basics',
    isCore: true,
    codeSnippetExample: {
      filename: 'middlewares/errorHandler.ts',
      code: `export function globalErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error('[Error Occurred]:', err.message);
  
  const statusCode = (err as any).statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? 'Terjadi kesalahan internal pada server' : err.message,
  });
}`,
    },
  },

  // ==========================================
  // DATABASE (DB)
  // ==========================================
  {
    id: 'db-query-efficiency',
    category: 'database',
    categoryLabel: 'Database & Relasi',
    number: 1,
    title: 'Query Efficiency & Pencegahan N+1 Query Problem',
    shortDesc: 'Mengambil data relasi menggunakan teknik JOIN / eager loading (include), bukan menjalankan query SQL di dalam loop item. Hanya menyeleksi kolom yang dibutuhkan (hindari SELECT * pada tabel besar).',
    howToVerify: 'Aktifkan logging kueri database (misal Prisma query log). Saat memuat halaman daftar 15 data yang berelasi dengan tabel lain, pastikan kueri yang dieksekusi hanya 1-2 kueri, bukan 16 kueri berturut-turut.',
    relatedModuleSlug: '05-database-schema-migrations',
    relatedModuleTitle: '05. Database Schema Design, Relations & Migrations',
    isCore: true,
    codeSnippetExample: {
      filename: 'services/userService.ts',
      code: `// BENAR: Menggunakan include / join untuk mencegah N+1 loop query
const usersWithProfile = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
    profile: { select: { avatarUrl: true, bio: true } },
  },
});`,
    },
  },
  {
    id: 'db-schema-migrations',
    category: 'database',
    categoryLabel: 'Database & Relasi',
    number: 2,
    title: 'Migrasi Skema Terkontrol (Database Version Control)',
    shortDesc: 'Perubahan skema database dikelola melalui file migrasi versi (Prisma migrate, Drizzle kit, atau Sequelize migrations), bukan diedit manual via GUI database tanpa jejak riwayat.',
    howToVerify: 'Pastikan repositori memiliki folder prisma/migrations/ atau migrations/. Anggota tim yang baru meng-clone proyek dapat membuat database identik hanya dengan menjalankan perintah migrasi.',
    relatedModuleSlug: '05-database-schema-migrations',
    relatedModuleTitle: '05. Database Schema Design, Relations & Migrations',
    isCore: true,
    codeSnippetExample: {
      filename: 'Terminal: Run Migration',
      code: `# Skema tidak diubah via GUI phpMyAdmin secara manual
npx prisma migrate dev --name init_users_and_roles
# Menghasilkan file migrasi SQL versi yang tersimpan di Git`,
    },
  },
  {
    id: 'db-integrity-constraints',
    category: 'database',
    categoryLabel: 'Database & Relasi',
    number: 3,
    title: 'Integritas Referensial & Foreign Key Constraints',
    shortDesc: 'Semua hubungan antar tabel memiliki relasi foreign key yang sah pada tingkat database engine, dilengkapi indeks pada kolom pencarian dan aturan penghapusan (cascade / set null) yang jelas.',
    howToVerify: 'Periksa file skema database. Pastikan relasi one-to-many atau many-to-many memiliki onDelete rule (misal Cascade atau Restrict) agar tidak ada data "orphan" (anak tanpa induk).',
    relatedModuleSlug: '05-database-schema-migrations',
    relatedModuleTitle: '05. Database Schema Design, Relations & Migrations',
    isCore: true,
    codeSnippetExample: {
      filename: 'prisma/schema.prisma',
      code: `model Post {
  id        String   @id @default(cuid())
  title     String
  authorId  String
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@index([authorId])
}`,
    },
  },
  {
    id: 'db-seeding-fixtures',
    category: 'database',
    categoryLabel: 'Database & Relasi',
    number: 4,
    title: 'Script Database Seeder (Demo & Testing Fixture)',
    shortDesc: 'Proyek menyediakan script seeder otomatis untuk mengisi akun demo admin, master roles, dan data sampel realistis sehingga aplikasi langsung siap didemokan penguji.',
    howToVerify: 'Jalankan perintah seed (misal npx prisma db seed atau npm run seed). Database yang kosong harus terisi secara otomatis dengan akun siap pakai tanpa perlu registrasi manual dari nol.',
    relatedModuleSlug: '05-database-schema-migrations',
    relatedModuleTitle: '05. Database Schema Design, Relations & Migrations',
    isCore: false,
    codeSnippetExample: {
      filename: 'prisma/seed.ts',
      code: `async function main() {
  await prisma.user.upsert({
    where: { email: 'admin@pbl.ac.id' },
    update: {},
    create: {
      email: 'admin@pbl.ac.id',
      name: 'Super Admin',
      role: 'ADMIN',
      passwordHash: await hashPassword('Admin123!'),
    },
  });
}`,
    },
  },

  // ==========================================
  // DISIPLIN REKAYASA & GIT
  // ==========================================
  {
    id: 'eng-git-branching',
    category: 'engineering',
    categoryLabel: 'Disiplin Git',
    number: 1,
    title: 'Disiplin Branching & Conventional Commits',
    shortDesc: 'Anggota kelompok tidak commit langsung ke branch main. Pengerjaan menggunakan branch fitur terisolasi (feature/...) dengan pesan commit berstandar (feat:, fix:, chore:).',
    howToVerify: 'Jalankan git log di terminal. Pastikan riwayat commit teratur dengan pesan deskriptif dan penggabungan kode dilakukan melalui Pull Request / Merge Request.',
    relatedModuleSlug: '14-git-development-workflow',
    relatedModuleTitle: '14. Git Development Workflow, Branching & Pull Requests',
    isCore: true,
    codeSnippetExample: {
      filename: 'Git Terminal Workflow',
      code: `git checkout -b feature/auth-jwt
git commit -m "feat(auth): implement jwt sign and verify middleware"
git push origin feature/auth-jwt
# Buka Pull Request untuk review rekan tim`,
    },
  },
  {
    id: 'eng-env-management',
    category: 'engineering',
    categoryLabel: 'Disiplin Git',
    number: 2,
    title: 'Manajemen Environment Variable (.env.example)',
    shortDesc: 'File rahasia .env terdaftar di .gitignore dan tidak pernah di-commit ke repositori publik. Proyek menyediakan .env.example dengan dokumentasi variabel lengkap.',
    howToVerify: 'Buka repositori GitHub/GitLab. Pastikan tidak ada token database, password, atau JWT secret yang ter-commit. Terdapat file .env.example yang siap di-copy menjadi .env.',
    relatedModuleSlug: '14-git-development-workflow',
    relatedModuleTitle: '14. Git Development Workflow, Branching & Pull Requests',
    isCore: true,
    codeSnippetExample: {
      filename: '.env.example',
      code: `DATABASE_URL="postgresql://user:password@localhost:5432/pbl_db"
JWT_SECRET="your-secure-jwt-secret-key-here"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
PORT=3000`,
    },
  },
  {
    id: 'eng-smoke-testing',
    category: 'engineering',
    categoryLabel: 'Disiplin Git',
    number: 3,
    title: 'Verifikasi Fitur Mandiri & Smoke Testing',
    shortDesc: 'Setiap fitur telah diuji alurnya dari frontend ke database sebelum diajukan ke dosen penguji (happy path dan unhappy path saat input gagal).',
    howToVerify: 'Lakukan demo mandiri: Buka website di tab Incognito, lakukan alur login, coba buat data baru, dan verifikasi console browser bersih dari pesan error merah.',
    relatedModuleSlug: '13-testing-verification',
    relatedModuleTitle: '13. Testing, Smoke Testing & Quality Verification',
    isCore: false,
    codeSnippetExample: {
      filename: 'Smoke Test Checklist',
      code: `[x] Happy Path: Register -> Login -> Dashboard -> CRUD Data Berhasil
[x] Unhappy Path: Form kosong menampilkan error Zod inline
[x] Security: Akses rute /dashboard saat logout diarahkan ke /login
[x] Clean Console: Tidak ada error React hydration atau network unhandled`,
    },
  },
];
