'use client';

import React, { useState, useMemo } from 'react';
import {
  Folder,
  FileCode2,
  FileText,
  Search,
  Check,
  Copy,
} from 'lucide-react';

export type FolderUsageTier = 'core' | 'common' | 'rare';

export interface FolderGuideItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  tier: FolderUsageTier;
  tierLabel: string;
  shortDesc: string;
  purpose: string;
  whyRareOrSpecial?: string;
  recommendationAlternative?: string;
  exampleFiles: string[];
  importExample?: string;
  bestPractices: string[];
  isInSrc: boolean;
}

export const NEXT_FOLDER_GUIDES: FolderGuideItem[] = [
  // ========================================================
  // 1. STRUKTUR UTAMA / WAJIB (CORE)
  // ========================================================
  {
    id: 'app',
    name: 'app/',
    type: 'folder',
    tier: 'core',
    tierLabel: 'Wajib / Utama',
    shortDesc: 'Mengatur routing, halaman, layout, loading, dan error pada Next.js App Router.',
    purpose:
      'Folder inti perutean (routing) Next.js modern berbasis App Router. Setiap sub-folder otomatis menjadi segmen URL, dan file konvensi khusus (page.tsx, layout.tsx, loading.tsx, error.tsx, not-found.tsx) menangani tampilan serta siklus hidup peramban.',
    exampleFiles: [
      'layout.tsx (Root layout pembungkus)',
      'page.tsx (Halaman beranda)',
      'loading.tsx (Indikator loading suspense)',
      'error.tsx (Error boundary)',
      'not-found.tsx (Halaman 404)',
      '(dashboard)/page.tsx (Route group layout)',
      'api/users/route.ts (Route handler API)',
    ],
    bestPractices: [
      'Gunakan Server Component secara default untuk efisiensi transfer data dan performa render.',
      'Gunakan Route Groups bertanda kurung, misalnya (auth) atau (dashboard), untuk mengisolasi layout tanpa merusak struktur URL publik.',
      'Tambahkan direktif "use client" hanya pada komponen interaktif yang membutuhkan event browser (onClick, useState).',
    ],
    importExample: "import DashboardLayout from '@/app/(dashboard)/layout';",
    isInSrc: true,
  },
  {
    id: 'components',
    name: 'components/',
    type: 'folder',
    tier: 'core',
    tierLabel: 'Wajib / Utama',
    shortDesc: 'Menyimpan komponen UI yang dapat digunakan kembali, seperti button, modal, navbar, sidebar, dan tabel.',
    purpose:
      'Wadah komponen visual antarmuka pengguna yang reusable dan modular. Direkomendasikan membaginya menjadi components/ui (elemen primitif tanpa business logic) dan components/layout (kerangka tampilan global seperti Navbar, Sidebar, Footer).',
    exampleFiles: [
      'ui/button.tsx',
      'ui/modal.tsx',
      'ui/input.tsx',
      'ui/card.tsx',
      'layout/Navbar.tsx',
      'layout/Sidebar.tsx',
      'common/DataTable.tsx',
    ],
    bestPractices: [
      'Terapkan 3-Scope Architecture: UI primitif di components/ui, Layout shell di components/layout, dan komponen domain spesifik di folder fiturnya masing-masing.',
      'Jaga komponen UI primitif tetap murni (presentational) tanpa menyematkan panggilan database atau business logic langsung.',
    ],
    importExample: "import { Button } from '@/components/ui/button';\nimport { Navbar } from '@/components/layout/Navbar';",
    isInSrc: true,
  },
  {
    id: 'lib',
    name: 'lib/',
    type: 'folder',
    tier: 'core',
    tierLabel: 'Wajib / Utama',
    shortDesc: 'Menyimpan fungsi bantuan, konfigurasi library, dan utilitas umum, seperti formatter tanggal, schema Zod, dan API client.',
    purpose:
      'Pusat utilitas dan inisialisasi library pihak ketiga. Seluruh konfigurasi database client (Prisma, MySQL pool), fungsi helper formatting (mata uang, tanggal), utilitas penggabung class Tailwind (cn helper), serta skema validasi Zod diletakkan di sini.',
    exampleFiles: [
      'utils.ts (Fungsi helper cn = clsx + tailwind-merge)',
      'db.ts (Connection pool MySQL / Prisma Client)',
      'validations/auth.ts (Schema validasi Zod)',
      'formatters.ts (Format rupiah & tanggal Indonesia)',
      'api.ts (Instance Axios / fetch wrapper terpusat)',
    ],
    bestPractices: [
      'Fungsi di dalam lib/ harus bersifat murni (pure functions) dan bebas dari ketergantungan render komponen UI.',
      'Jadikan lib/utils.ts sebagai satu-satunya tempat helper classNames penggabung Tailwind CSS.',
    ],
    importExample: "import { cn, formatDate } from '@/lib/utils';\nimport { db } from '@/lib/db';",
    isInSrc: true,
  },
  {
    id: 'types',
    name: 'types/',
    type: 'folder',
    tier: 'core',
    tierLabel: 'Wajib / Utama',
    shortDesc: 'Menyimpan definisi tipe TypeScript yang digunakan bersama, seperti tipe User, Product, dan ApiResponse.',
    purpose:
      'Menyimpan kontrak data (interface dan type alias) TypeScript yang digunakan lintas komponen, services, dan route handlers untuk menjamin type-safety tanpa duplikasi definisi tipe.',
    exampleFiles: [
      'user.ts (Interface User, Profile, UserRole)',
      'api.ts (Generic ApiResponse<T>, PaginatedData<T>)',
      'auth.ts (Session, JWTPayload, LoginRequest)',
      'product.ts (Interface Product, Category)',
    ],
    bestPractices: [
      'Gunakan format generic untuk membungkus respon API: ApiResponse<T> agar tipe data payload selalu konsisten.',
      'Hindari penggunaan tipe "any". Buat definisi antarmuka yang spesifik agar autocompletion editor berfungsi maksimal.',
    ],
    importExample: "import type { User, ApiResponse } from '@/types/user';",
    isInSrc: true,
  },
  {
    id: 'public',
    name: 'public/',
    type: 'folder',
    tier: 'core',
    tierLabel: 'Wajib / Utama',
    shortDesc: 'Menyimpan aset statis yang dapat diakses melalui URL, seperti gambar, logo, ikon, dan favicon.',
    purpose:
      'Folder aset statis yang disajikan langsung oleh Next.js di root domain ("/"). Seluruh file di folder ini tidak melalui proses bundling Javascript dan langsung bisa dipanggil oleh browser atau komponen <Image />.',
    exampleFiles: [
      'favicon.ico (Favicon browser)',
      'logo.svg (Logo resmi aplikasi)',
      'images/hero-banner.webp (Gambar banner halaman)',
      'icons/check.svg (Ikon SVG mandiri)',
      'robots.txt (Instruksi crawler SEO)',
    ],
    bestPractices: [
      'Jangan menaruh file kode sumber atau kredensial rahasia di folder public.',
      'Gunakan format web modern yang terkompresi seperti WebP atau SVG agar waktu muat halaman tetap cepat.',
    ],
    importExample: '<Image src="/logo.svg" alt="App Logo" width={140} height={40} priority />',
    isInSrc: false,
  },
  {
    id: 'env-local',
    name: '.env.local',
    type: 'file',
    tier: 'core',
    tierLabel: 'Wajib / Utama',
    shortDesc: 'Menyimpan environment variable lokal, seperti URL backend dan konfigurasi pengembangan.',
    purpose:
      'File konfigurasi lokal untuk menyimpan variabel lingkungan mesin pengembang. Nilai di dalamnya tidak dibagikan dan tidak boleh di-commit ke Git.',
    exampleFiles: ['.env.local (Mesin lokal)', '.env.example (Template publik)'],
    bestPractices: [
      'Jangan memasukkan secret, API token privat, atau password database ke variabel berawalan NEXT_PUBLIC_ karena variabel tersebut dibundel ke browser client.',
      'Pastikan file .env.local selalu terdaftar di dalam .gitignore.',
      'Sediakan file .env.example agar rekan tim yang baru meng-clone proyek dapat langsung menyalinnya.',
    ],
    importExample: '# .env.local:\nNEXT_PUBLIC_API_URL=http://localhost:5000\nDATABASE_URL=mysql://root:...',
    isInSrc: false,
  },
  {
    id: 'next-config',
    name: 'next.config.ts',
    type: 'file',
    tier: 'core',
    tierLabel: 'Wajib / Utama',
    shortDesc: 'Menyimpan konfigurasi Next.js, seperti pengaturan gambar dan opsi framework.',
    purpose:
      'File konfigurasi sentral bagi runtime dan build engine Next.js. Digunakan untuk mendaftarkan domain gambar eksternal, konfigurasi compiler Turbopack, header keamanan HTTP, serta redirection URL.',
    exampleFiles: ['next.config.ts (atau next.config.mjs)'],
    bestPractices: [
      'Daftarkan remote domain di images.remotePatterns jika aplikasi memuat gambar dari URL eksternal atau CDN pihak ketiga.',
      'Gunakan type checking NextConfig dari "next" untuk mencegah kesalahan pengetikan opsi konfigurasi.',
    ],
    importExample:
      "import type { NextConfig } from 'next';\n\nconst nextConfig: NextConfig = {\n  images: {\n    remotePatterns: [{ hostname: 'images.unsplash.com' }],\n  },\n};\nexport default nextConfig;",
    isInSrc: false,
  },
  {
    id: 'package-json',
    name: 'package.json',
    type: 'file',
    tier: 'core',
    tierLabel: 'Wajib / Utama',
    shortDesc: 'Menyimpan informasi project, daftar dependensi, dan script untuk menjalankan aplikasi.',
    purpose:
      'Manifest proyek Node.js yang memuat identitas aplikasi, script otomasi ("dev", "build", "start", "lint"), serta daftar pustaka runtime dan devDependencies.',
    exampleFiles: ['package.json', 'package-lock.json'],
    bestPractices: [
      'Jaga scripts runner tetap terstandarisasi untuk memudahkan seluruh anggota tim menjalankan perintah yang sama.',
      'Commit file package-lock.json ke Git agar versi dependensi terkunci identik di seluruh mesin pengembang.',
    ],
    importExample: '{\n  "name": "pbl-frontend",\n  "scripts": {\n    "dev": "next dev",\n    "build": "next build"\n  }\n}',
    isInSrc: false,
  },

  // ========================================================
  // 2. UMUM DIGUNAKAN (COMMON)
  // ========================================================
  {
    id: 'hooks',
    name: 'hooks/',
    type: 'folder',
    tier: 'common',
    tierLabel: 'Umum Digunakan',
    shortDesc: 'Menyimpan custom React Hooks untuk menggunakan kembali logika React, seperti useAuth() dan useDebounce().',
    purpose:
      'Menyimpan fungsi React Hooks buatan sendiri yang mengabstraksi logika stateful, manipulasi event DOM browser, atau query interaktif berulang agar komponen UI tetap ramping dan bersih.',
    exampleFiles: [
      'useAuth.ts (Mengecek sesi login pengguna)',
      'useDebounce.ts (Menunda eksekusi input pencarian tabel)',
      'useMediaQuery.ts (Deteksi ukuran breakpoint layar responsif)',
      'useClickOutside.ts (Deteksi klik di luar modal/dropdown)',
    ],
    bestPractices: [
      'Awali nama file dan fungsi dengan kata "use" (aturan baku React Hooks).',
      'Hanya panggil custom hook di dalam Client Components (file bertanda "use client") karena Server Components tidak memiliki siklus hidup state React.',
    ],
    importExample: "import { useDebounce } from '@/hooks/useDebounce';\nconst debouncedSearch = useDebounce(keyword, 300);",
    isInSrc: true,
  },
  {
    id: 'services',
    name: 'services/',
    type: 'folder',
    tier: 'common',
    tierLabel: 'Umum Digunakan',
    shortDesc: 'Menyimpan fungsi komunikasi dengan backend API, seperti mengambil data, membuat data, memperbarui data, dan menghapus data.',
    purpose:
      'Lapisan abstraksi komunikasi HTTP ke Backend Express atau REST API eksternal (API Client Layer). Komponen UI cukup memanggil fungsi service tanpa perlu mengetahui detail URL endpoint atau header HTTP.',
    exampleFiles: [
      'userService.ts (Fungsi getAll, getById, update, delete user)',
      'authService.ts (Fungsi login, register, logout, refreshToken)',
      'todoService.ts (CRUD data todo ke backend Express)',
    ],
    bestPractices: [
      'Gunakan konstanta environment variable process.env.NEXT_PUBLIC_API_URL sebagai basis URL backend.',
      'Sertakan penanganan error terstruktur (try-catch) dan parsing tipe TypeScript menggunakan type dari types/.',
    ],
    importExample:
      "import { UserService } from '@/services/userService';\n\nconst data = await UserService.getAll();",
    isInSrc: true,
  },
  {
    id: 'actions',
    name: 'actions/',
    type: 'folder',
    tier: 'common',
    tierLabel: 'Umum Digunakan',
    shortDesc: 'Menyimpan Server Actions untuk operasi yang dijalankan di server, seperti submit form dan mutasi data.',
    purpose:
      'Wadah fungsi mutasi data server (Server Actions bertanda "use server"). Memungkinkan pemrosesan form submission dan mutasi database langsung di lingkungan Node.js server tanpa harus membuat endpoint API route terpisah.',
    exampleFiles: [
      'userActions.ts (Server action tambah/edit user)',
      'authActions.ts (Server action login & set session cookie)',
      'todoActions.ts (Server action mutasi todo dengan revalidatePath)',
    ],
    bestPractices: [
      'Gunakan hanya jika project memang memakai fitur Server Actions Next.js.',
      'Validasi ulang seluruh parameter input di dalam Server Action menggunakan Zod untuk mencegah manipulasi data dari client.',
      'Gunakan fungsi revalidatePath() atau revalidateTag() setelah mutasi database agar cache Next.js terbarui otomatis.',
    ],
    importExample:
      "'use server';\nimport { revalidatePath } from 'next/cache';\n\nexport async function updateTodoAction(formData: FormData) { ... }",
    isInSrc: true,
  },
  {
    id: 'providers',
    name: 'providers/',
    type: 'folder',
    tier: 'common',
    tierLabel: 'Umum Digunakan',
    shortDesc: 'Menyimpan React Context Providers, seperti provider tema, autentikasi, atau state management global.',
    purpose:
      'Tempat berkumpulnya React Context Providers yang membungkus komponen aplikasi. Berfungsi membagikan state global client (tema dark/light, sesi auth, TanStack Query client, notifikasi toast) ke seluruh pohon komponen.',
    exampleFiles: [
      'ThemeProvider.tsx (Provider tema)',
      'AuthProvider.tsx (Context autentikasi client)',
      'QueryProvider.tsx (React Query / TanStack Client)',
      'index.tsx (AppProviders pembungkus tunggal)',
    ],
    bestPractices: [
      'Tambahkan direktif "use client" di baris paling atas file provider.',
      'Gabungkan seluruh provider ke dalam satu komponen wrapper: providers/index.tsx agar app/layout.tsx tetap bersih dan terbaca.',
    ],
    importExample:
      "import { AppProviders } from '@/providers';\n\nexport default function RootLayout({ children }) {\n  return (\n    <html>\n      <body>\n        <AppProviders>{children}</AppProviders>\n      </body>\n    </html>\n  );\n}",
    isInSrc: true,
  },
  {
    id: 'middleware',
    name: 'middleware.ts',
    type: 'file',
    tier: 'common',
    tierLabel: 'Umum Digunakan',
    shortDesc: 'Menangani logika request awal seperti pemeriksaan akses atau redirect. Pada Next.js versi baru, konvensi ini dapat menggunakan proxy.ts.',
    purpose:
      'Interseptor awal yang dieksekusi di Edge Runtime sebelum sebuah request mencapai halaman tujuan. Digunakan untuk memeriksa cookie autentikasi dan memproteksi rute dashboard dari pengguna yang belum terautentikasi.',
    exampleFiles: ['middleware.ts (atau proxy.ts)'],
    bestPractices: [
      'Sertakan konfigurasi "matcher" agar middleware tidak berjalan pada file aset statis (_next/static, favicon, gambar).',
      'Pada Next.js versi baru, konvensi ini dapat menggunakan proxy.ts; sesuaikan dengan versi Next.js yang Anda pakai.',
      'Hindari komputasi berat atau query database lambat di dalam middleware.',
    ],
    importExample:
      "import { NextResponse } from 'next/server';\nimport type { NextRequest } from 'next/server';\n\nexport function middleware(request: NextRequest) {\n  const token = request.cookies.get('token');\n  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {\n    return NextResponse.redirect(new URL('/login', request.url));\n  }\n}\n\nexport const config = {\n  matcher: ['/dashboard/:path*'],\n};",
    isInSrc: false,
  },

  // ========================================================
  // 3. JARANG DIGUNAKAN / SITUASIONAL / OPSIONAL (RARE)
  // ========================================================
  {
    id: 'utils',
    name: 'utils/',
    type: 'folder',
    tier: 'rare',
    tierLabel: 'Jarang Digunakan',
    shortDesc: 'Menyimpan fungsi utilitas umum jika tim ingin memisahkannya dari lib/, seperti konversi format atau manipulasi string.',
    purpose:
      'Folder alternatif untuk memisahkan fungsi utilitas murni (manipulasi string, format tanggal) dari konfigurasi library eksternal.',
    whyRareOrSpecial:
      'Redundan dengan folder lib/. Mayoritas proyek Next.js modern sudah menampung seluruh fungsi utilitas di dalam "lib/utils.ts" atau subfolder lib/. Memisahkan utils/ dan lib/ di root sering membingungkan pengembang karena batas pemisahan fungsinya tidak tegas.',
    recommendationAlternative:
      'Konsolidasikan ke dalam file lib/utils.ts. Tidak perlu membuat folder utils/ terpisah.',
    exampleFiles: ['formatDate.ts', 'stringHelpers.ts', 'currency.ts'],
    bestPractices: [
      'Gunakan lib/utils.ts untuk menjaga struktur direktori tetap ramping.',
      'Hanya buat folder utils/ terpisah jika tim memiliki ratusan utilitas algoritma murni yang memang diisolasi secara ketat.',
    ],
    importExample: "import { formatRupiah } from '@/lib/utils';",
    isInSrc: true,
  },
  {
    id: 'schemas',
    name: 'schemas/',
    type: 'folder',
    tier: 'rare',
    tierLabel: 'Jarang Digunakan',
    shortDesc: 'Menyimpan schema validasi, misalnya schema Zod untuk form atau validasi data. Bisa digabung ke lib/validations/.',
    purpose:
      'Wadah khusus untuk skema validasi tipe runtime form (Zod, Yup, Valibot) yang memvalidasi payload formulir.',
    whyRareOrSpecial:
      'Jarang diletakkan sebagai folder mandiri di root. Standar arsitektur Next.js umumnya menyatukannya ke dalam "lib/validations/" atau meletakkannya berdampingan di folder fitur terkait (co-location).',
    recommendationAlternative:
      'Satukan ke dalam folder "lib/validations/" atau gabung langsung bersama file Server Action atau Form terkait.',
    exampleFiles: ['authSchema.ts', 'userSchema.ts', 'productSchema.ts'],
    bestPractices: [
      'Gunakan z.infer<typeof schema> untuk mengekstrak tipe TypeScript otomatis tanpa perlu menulis interface berulang.',
    ],
    importExample: "import { loginSchema } from '@/lib/validations/auth';",
    isInSrc: true,
  },
  {
    id: 'config',
    name: 'config/',
    type: 'folder',
    tier: 'rare',
    tierLabel: 'Jarang Digunakan',
    shortDesc: 'Menyimpan konfigurasi aplikasi atau library, seperti konfigurasi autentikasi dan pengaturan integrasi.',
    purpose:
      'Tempat konstanta konfigurasi aplikasi (site metadata, tautan navigasi statis, opsi integrasi).',
    whyRareOrSpecial:
      'Jarang dibuat sebagai folder tersendiri karena biasanya hanya berisi 1–2 file konfigurasi kecil yang lebih praktis ditaruh di dalam "lib/site-config.ts" atau "lib/auth.ts". Selain itu, sering menimbulkan kerancuan dengan konfigurasi lingkungan di .env.local.',
    recommendationAlternative:
      'Simpan file konfigurasi spesifik di dalam lib/, misalnya lib/site-config.ts atau lib/auth.config.ts.',
    exampleFiles: ['site.ts', 'auth.ts', 'navigation.ts'],
    bestPractices: [
      'Hindari menyimpan secret, token privat, atau password database langsung di dalam file konfigurasi JavaScript/TypeScript.',
      'Selalu baca kredensial rahasia dari process.env.',
    ],
    importExample: "import { siteConfig } from '@/lib/site-config';",
    isInSrc: true,
  },
  {
    id: 'constants',
    name: 'constants/',
    type: 'folder',
    tier: 'rare',
    tierLabel: 'Jarang Digunakan',
    shortDesc: 'Menyimpan nilai konstan yang digunakan di berbagai bagian aplikasi, seperti daftar status, navigasi, dan kategori.',
    purpose:
      'Menyimpan kumpulan nilai tetap (konstanta kamus, daftar status transaksi, role pengguna, opsi dropdown statis).',
    whyRareOrSpecial:
      'Jarang memerlukan folder tersendiri. Pada banyak proyek, konstanta cukup ditaruh di "lib/constants.ts" atau diletakkan berdampingan dengan komponen/halaman yang membutuhkannya.',
    recommendationAlternative:
      'Gunakan file tunggal "lib/constants.ts" atau tempatkan langsung di dalam file modul/komponen terkait.',
    exampleFiles: ['statusCodes.ts', 'navigation.ts', 'roles.ts'],
    bestPractices: [
      'Gunakan sintaks "as const" pada objek konstan TypeScript agar tipenya menjadi strict literal.',
    ],
    importExample: "import { ORDER_STATUS } from '@/lib/constants';",
    isInSrc: true,
  },
  {
    id: 'store',
    name: 'store/',
    type: 'folder',
    tier: 'rare',
    tierLabel: 'Jarang Digunakan',
    shortDesc: 'Menyimpan konfigurasi dan state management global, misalnya Zustand atau Redux, jika diperlukan.',
    purpose:
      'Menyimpan konfigurasi store client state management eksternal (Zustand, Redux Toolkit, Jotai).',
    whyRareOrSpecial:
      'Di Next.js App Router (React Server Components), sebagian besar data di-fetch dan di-cache langsung di server atau disinkronkan melalui URL Search Params. Pemakaian global client store sangat jarang dibutuhkan kecuali untuk fitur seperti keranjang belanja offline atau canvas interaktif.',
    recommendationAlternative:
      'Prioritaskan Server State, URL query params, atau React Context lokal sebelum memutuskan memasang library store tambahan.',
    exampleFiles: ['useCartStore.ts', 'useFilterStore.ts', 'index.ts'],
    bestPractices: [
      'Jika menggunakan Zustand, bagi state ke dalam modul slice terisolasi dan perhatikan potensi hydration mismatch pada SSR.',
    ],
    importExample: "import { useCartStore } from '@/store/useCartStore';",
    isInSrc: true,
  },
  {
    id: 'styles',
    name: 'styles/',
    type: 'folder',
    tier: 'rare',
    tierLabel: 'Jarang Digunakan',
    shortDesc: 'Menyimpan stylesheet global atau file CSS tambahan jika tidak diletakkan langsung di app/.',
    purpose:
      'Tempat file stylesheet CSS, SCSS, atau CSS Modules tambahan di luar app/globals.css.',
    whyRareOrSpecial:
      'Dengan digunakannya Tailwind CSS sebagai standar utama Next.js, penataan gaya dilakukan langsung via utility class. Pengaturan global cukup ditampung di file tunggal "app/globals.css". Folder styles/ terpisah merupakan konvensi lama yang tidak lagi diperlukan.',
    recommendationAlternative:
      'Gunakan satu file tunggal: "app/globals.css" untuk semua styling global dan directive Tailwind.',
    exampleFiles: ['globals.css', 'custom.css'],
    bestPractices: [
      'Hindari menulis CSS spesifik halaman jika dapat diselesaikan dengan utility classes Tailwind.',
    ],
    importExample: "import '@/app/globals.css';",
    isInSrc: true,
  },
];

export function InteractiveFolderExplorer() {
  const [useSrc, setUseSrc] = useState<boolean>(true);
  const [selectedId, setSelectedId] = useState<string>('app');
  const [filterTier, setFilterTier] = useState<FolderUsageTier | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Filter items based on active tier and search keyword
  const filteredItems = useMemo(() => {
    return NEXT_FOLDER_GUIDES.filter((item) => {
      const matchTier = filterTier === 'all' || item.tier === filterTier;
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.purpose.toLowerCase().includes(searchQuery.toLowerCase());
      return matchTier && matchSearch;
    });
  }, [filterTier, searchQuery]);

  // Selected item detail
  const currentItem = useMemo(() => {
    return (
      NEXT_FOLDER_GUIDES.find((item) => item.id === selectedId) ||
      filteredItems[0] ||
      NEXT_FOLDER_GUIDES[0]
    );
  }, [selectedId, filteredItems]);

  const counts = useMemo(() => {
    return {
      core: NEXT_FOLDER_GUIDES.filter((i) => i.tier === 'core').length,
      common: NEXT_FOLDER_GUIDES.filter((i) => i.tier === 'common').length,
      rare: NEXT_FOLDER_GUIDES.filter((i) => i.tier === 'rare').length,
      total: NEXT_FOLDER_GUIDES.length,
    };
  }, []);

  const handleCopy = (text: string) => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDisplayPath = (item: FolderGuideItem) => {
    if (useSrc && item.isInSrc) {
      return `src/${item.name}`;
    }
    return item.name;
  };

  // Group items by tier when showing 'all'
  const groupedItems = useMemo(() => {
    if (filterTier !== 'all' || searchQuery.trim().length > 0) {
      return [{ title: 'Hasil Pencarian', items: filteredItems }];
    }
    return [
      {
        title: 'Struktur Wajib / Utama',
        tier: 'core' as FolderUsageTier,
        items: filteredItems.filter((i) => i.tier === 'core'),
      },
      {
        title: 'Umum Digunakan',
        tier: 'common' as FolderUsageTier,
        items: filteredItems.filter((i) => i.tier === 'common'),
      },
      {
        title: 'Jarang Digunakan / Opsional',
        tier: 'rare' as FolderUsageTier,
        items: filteredItems.filter((i) => i.tier === 'rare'),
      },
    ];
  }, [filteredItems, filterTier, searchQuery]);

  return (
    <div className="w-full my-6 rounded-lg border border-zinc-800 bg-[#09090b] text-zinc-100 font-sidebar overflow-hidden">
      {/* ======================================================== */}
      {/* HEADER BAR */}
      {/* ======================================================== */}
      <div className="p-4 sm:p-5 border-b border-zinc-800 bg-zinc-950/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Pedoman Struktur Folder Next.js
            </h3>
            <p className="text-xs text-zinc-400 font-content mt-1 leading-relaxed">
              Panduan penataan direktori App Router: pahami fungsi setiap folder dan alasan mengapa beberapa folder jarang digunakan di proyek modern.
            </p>
          </div>

          {/* Directory mode switch */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-zinc-400 font-mono">Direktori:</span>
            <div className="inline-flex rounded-md border border-zinc-800 bg-zinc-900 p-0.5 text-xs font-mono">
              <button
                type="button"
                onClick={() => setUseSrc(true)}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  useSrc ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                src/
              </button>
              <button
                type="button"
                onClick={() => setUseSrc(false)}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  !useSrc ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Tanpa src/
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* COMPACT TOOLBAR (FILTER TABS & SEARCH) */}
        {/* ======================================================== */}
        <div className="mt-4 pt-4 border-t border-zinc-850 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          {/* Segmented Tier Filters */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setFilterTier('all')}
              className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer border ${
                filterTier === 'all'
                  ? 'bg-zinc-800 border-zinc-700 text-white font-medium'
                  : 'bg-zinc-950 border-zinc-850 text-zinc-400 hover:text-white'
              }`}
            >
              Semua ({counts.total})
            </button>
            <button
              type="button"
              onClick={() => setFilterTier('core')}
              className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer border ${
                filterTier === 'core'
                  ? 'bg-zinc-800 border-zinc-700 text-emerald-300 font-medium'
                  : 'bg-zinc-950 border-zinc-850 text-zinc-400 hover:text-emerald-400'
              }`}
            >
              Wajib ({counts.core})
            </button>
            <button
              type="button"
              onClick={() => setFilterTier('common')}
              className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer border ${
                filterTier === 'common'
                  ? 'bg-zinc-800 border-zinc-700 text-sky-300 font-medium'
                  : 'bg-zinc-950 border-zinc-850 text-zinc-400 hover:text-sky-400'
              }`}
            >
              Umum ({counts.common})
            </button>
            <button
              type="button"
              onClick={() => setFilterTier('rare')}
              className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer border ${
                filterTier === 'rare'
                  ? 'bg-zinc-800 border-zinc-700 text-amber-300 font-medium'
                  : 'bg-zinc-950 border-zinc-850 text-zinc-400 hover:text-amber-400'
              }`}
            >
              Jarang Digunakan ({counts.rare})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-60">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Cari nama folder atau fungsi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1 bg-zinc-950 border border-zinc-800 rounded-md text-xs text-white placeholder-zinc-500 focus:outline-hidden focus:border-zinc-600"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400 hover:text-white font-mono"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MAIN DUAL PANE */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
        {/* LEFT PANE: DIRECTORY TREE */}
        <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-zinc-800 bg-zinc-950 p-3 sm:p-4 overflow-y-auto max-h-[560px]">
          {useSrc && (
            <div className="px-2 py-1 text-[11px] font-mono text-zinc-500 flex items-center gap-1.5 mb-1.5 select-none">
              <Folder className="w-3.5 h-3.5 text-zinc-500" />
              <span>src/ (Root source)</span>
            </div>
          )}

          <div className="space-y-4 font-mono text-xs">
            {groupedItems.map((group, gIdx) => {
              if (group.items.length === 0) return null;

              return (
                <div key={gIdx} className="space-y-1">
                  {/* Group Label */}
                  <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold border-b border-zinc-900 flex items-center justify-between">
                    <span>{group.title}</span>
                    <span>{group.items.length}</span>
                  </div>

                  {group.items.map((item) => {
                    const isSelected = item.id === currentItem.id;
                    const isNestedInSrc = useSrc && item.isInSrc;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedId(item.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left transition-colors cursor-pointer ${
                          isNestedInSrc ? 'ml-2.5 w-[calc(100%-10px)]' : ''
                        } ${
                          isSelected
                            ? 'bg-zinc-800 text-white font-medium border-l-2 border-zinc-300'
                            : 'hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {item.type === 'folder' ? (
                            <Folder className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-zinc-200' : 'text-zinc-500'}`} />
                          ) : item.name.endsWith('.ts') ? (
                            <FileCode2 className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-zinc-200' : 'text-zinc-500'}`} />
                          ) : (
                            <FileText className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-zinc-200' : 'text-zinc-500'}`} />
                          )}
                          <span className="truncate">{item.name}</span>
                        </div>

                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.5 rounded border shrink-0 ml-2 ${
                            item.tier === 'core'
                              ? 'border-emerald-900/60 bg-emerald-950/40 text-emerald-400'
                              : item.tier === 'common'
                              ? 'border-sky-900/60 bg-sky-950/40 text-sky-400'
                              : 'border-amber-900/60 bg-amber-950/40 text-amber-400'
                          }`}
                        >
                          {item.tier === 'core' ? 'Wajib' : item.tier === 'common' ? 'Umum' : 'Jarang'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              );
            })}

            {filteredItems.length === 0 && (
              <div className="p-6 text-center text-zinc-500 text-xs font-content">
                Tidak ada folder yang cocok dengan pencarian "{searchQuery}". Coba kata kunci lain atau pilih filter Semua.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANE: DETAIL INSPECTOR */}
        <div className="lg:col-span-7 p-5 sm:p-6 bg-[#09090b] flex flex-col justify-between overflow-y-auto max-h-[560px]">
          <div className="space-y-5">
            {/* Title & Classification */}
            <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-zinc-800">
              <div>
                <h4 className="text-xl font-bold text-white tracking-tight font-sidebar">
                  {currentItem.name}
                </h4>
                <span className="text-xs font-mono text-zinc-400 mt-0.5 block">
                  Path proyek: {getDisplayPath(currentItem)}
                </span>
              </div>

              <span
                className={`text-xs font-mono px-2.5 py-1 rounded-md border ${
                  currentItem.tier === 'core'
                    ? 'border-emerald-800 bg-emerald-950/60 text-emerald-300'
                    : currentItem.tier === 'common'
                    ? 'border-sky-800 bg-sky-950/60 text-sky-300'
                    : 'border-amber-800 bg-amber-950/60 text-amber-300'
                }`}
              >
                {currentItem.tierLabel}
              </span>
            </div>

            {/* RARE FOLDER CALLOUT: REASON & ALTERNATIVE */}
            {currentItem.tier === 'rare' && currentItem.whyRareOrSpecial && (
              <div className="p-3.5 rounded-md border border-amber-900/50 bg-amber-950/20 space-y-1.5 font-content">
                <span className="text-[11px] font-semibold text-amber-300 block font-sidebar uppercase tracking-wide">
                  Mengapa Jarang Digunakan di Next.js Modern?
                </span>
                <p className="text-xs text-amber-200/90 leading-relaxed">
                  {currentItem.whyRareOrSpecial}
                </p>
                {currentItem.recommendationAlternative && (
                  <div className="pt-2 border-t border-amber-900/40 text-xs text-zinc-300">
                    <strong className="text-amber-200 font-medium">Rekomendasi Alternatif: </strong>
                    {currentItem.recommendationAlternative}
                  </div>
                )}
              </div>
            )}

            {/* Main Purpose */}
            <div>
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1 font-sidebar">
                Fungsi &amp; Peruntukan Utama
              </span>
              <p className="text-xs sm:text-sm text-zinc-300 font-content leading-relaxed">
                {currentItem.purpose}
              </p>
            </div>

            {/* Representative Files */}
            {currentItem.exampleFiles && currentItem.exampleFiles.length > 0 && (
              <div>
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1.5 font-sidebar">
                  Contoh File Representatif
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentItem.exampleFiles.map((f, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900 text-[11px] font-mono text-zinc-300"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Import / Code Example */}
            {currentItem.importExample && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider font-sidebar">
                    Contoh Penggunaan
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(currentItem.importExample || '')}
                    className="inline-flex items-center gap-1 text-[10px] font-mono text-zinc-400 hover:text-white cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Salin</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-2.5 rounded-md bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 font-mono overflow-x-auto whitespace-pre leading-relaxed">
                  {currentItem.importExample}
                </pre>
              </div>
            )}

            {/* Best Practices */}
            {currentItem.bestPractices && currentItem.bestPractices.length > 0 && (
              <div>
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1.5 font-sidebar">
                  Aturan &amp; Best Practice
                </span>
                <ul className="space-y-1.5 text-xs text-zinc-300 font-content">
                  {currentItem.bestPractices.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-zinc-500 font-mono text-xs select-none">·</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-6 pt-3 border-t border-zinc-850 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
            <span>Struktur Next.js App Router</span>
            <span>Total 19 Entri Pedoman</span>
          </div>
        </div>
      </div>
    </div>
  );
}
