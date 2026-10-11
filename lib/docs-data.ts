import { PhaseGroup, DocModule, BlueprintCase } from '@/types/docs';

export const DOC_MODULES: DocModule[] = [
  // ==========================================
  // MODUL 01
  // ==========================================
  {
    slug: '01-app-router-page-structure',
    phaseId: 'fase-1',
    order: 1,
    title: '01. App Router & Page Structure',
    subtitle: 'Standarisasi struktur routing Next.js, layout, error boundary, dan state halaman.',
    category: 'core-standard',
    layer: 'frontend',
    estimatedMinutes: 30,
    tujuan: 'Membangun struktur routing dasar yang rapi pada Next.js App Router dengan pemisahan page, layout, loading state, dan error boundary sebelum masuk ke logika backend.',
    prasyarat: [
      'Node.js v18+ dan package manager (npm/pnpm) terinstal',
      'Proyek Next.js App Router baru telah diinisialisasi',
      'Memahami konsep dasar komponen React & URL path',
    ],
    tasks: [
      'Membuat root layout bersih dengan navigasi global',
      'Membuat modul halaman domain pertama (misal: /products atau /dashboard)',
      'Menyediakan file loading.tsx dan error.tsx khusus per segmen rute',
      'Mengatur metadata title & description halaman',
    ],
    steps: [
      {
        title: 'Langkah 1: Periksa Root Layout (app/layout.tsx)',
        description: 'Pastikan root layout membungkus seluruh aplikasi dan hanya memuat struktur HTML dasar, font, serta shell global (Header/Footer).',
        detail: 'Hindari meletakkan logika state yang berat atau data fetching langsung di root layout jika itu hanya relevan untuk halaman tertentu.',
      },
      {
        title: 'Langkah 2: Buat Folder Domain Fitur (app/<nama-fitur>/page.tsx)',
        description: 'Buat folder baru di bawah app/ sesuai entitas utama proyekmu (contoh: app/bookings/, app/items/, app/campaigns/, app/products/). Lalu tambahkan page.tsx di dalamnya.',
        detail: 'Folder ini menentukan URL rute di browser. Jika foldernya bernama "bookings", URL-nya otomatis menjadi http://localhost:3000/bookings.',
      },
      {
        title: 'Langkah 3: Tambahkan State Boundary (loading.tsx & error.tsx)',
        description: 'Di dalam folder app/<nama-fitur>/, sediakan loading.tsx untuk skeleton loading otomatis, dan error.tsx untuk menangani error tanpa mematikan seluruh aplikasi.',
        detail: 'File error.tsx WAJIB bertipe Client Component dengan deklarasi "use client" di baris paling atas.',
      },
      {
        title: 'Langkah 4: Buat Sub-rute Detail Dinamis (app/<nama-fitur>/[id]/page.tsx)',
        description: 'Untuk halaman detail entitas (misal detail booking, detail item, atau detail donasi), buat folder dengan kurung siku [id] di dalam folder fitur.',
        detail: 'Next.js otomatis meneruskan parameter ID dari URL (contoh: /bookings/123) ke prop params di page.tsx.',
      },
    ],
    fileTree: [
      { path: 'app/layout.tsx', type: 'file', status: 'modified', description: 'Root shell & fonts' },
      { path: 'app/page.tsx', type: 'file', status: 'modified', description: 'Landing / redirect' },
      { path: 'app/dashboard/', type: 'folder', status: 'added' },
      { path: 'app/dashboard/page.tsx', type: 'file', status: 'added', description: 'Clean Code: panggil <Dashboard />' },
      { path: 'app/dashboard/loading.tsx', type: 'file', status: 'added', description: 'Skeleton loading otomatis' },
      { path: 'app/dashboard/error.tsx', type: 'file', status: 'added', description: 'Error boundary (use client)' },
      { path: 'app/dashboard/[id]/', type: 'folder', status: 'added' },
      { path: 'app/dashboard/[id]/page.tsx', type: 'file', status: 'added', description: 'Detail view' },
      { path: 'components/dashboard/Dashboard.tsx', type: 'file', status: 'added', description: 'Komponen view dashboard' },
    ],
    codeSnippets: [
      {
        filename: 'app/dashboard/page.tsx',
        language: 'tsx',
        description: 'Clean Code: page.tsx tipis & rapi, bertindak sebagai entry point yang memanggil komponen view utama.',
        code: `import { Metadata } from 'next';
import { Dashboard } from '@/components/dashboard/Dashboard';
// Atau jika memiliki komponen modular pendukung:
// import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

export const metadata: Metadata = {
  title: 'Dashboard | PBL App',
  description: 'Ringkasan data dan metrik operasional',
};

// STANDAR CLEAN CODE:
// page.tsx TIDAK boleh bloated dengan ratusan baris JSX tampilan.
// Cukup panggil komponen view utama seperti <Dashboard />.
export default function DashboardPage() {
  return <Dashboard />;
}

// Catatan: Jika butuh komponen pendukung, panggil secara modular:
// export default function DashboardPage() {
//   return (
//     <div className="space-y-6">
//       <DashboardHeader />
//       <Dashboard />
//     </div>
//   );
// }`,
      },
      {
        filename: 'app/dashboard/loading.tsx',
        language: 'tsx',
        description: 'Skeleton loading state otomatis yang muncul saat halaman atau data sedang dimuat.',
        code: `export default function DashboardLoading() {
  return (
    <div className="space-y-6 p-6 animate-pulse">
      {/* Skeleton Header */}
      <div className="h-8 bg-zinc-800 rounded w-1/4"></div>
      <div className="h-4 bg-zinc-850 rounded w-1/2"></div>

      {/* Skeleton Grid Kartu Metrik */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <div className="h-28 bg-zinc-900 rounded-xl border border-zinc-800"></div>
        <div className="h-28 bg-zinc-900 rounded-xl border border-zinc-800"></div>
        <div className="h-28 bg-zinc-900 rounded-xl border border-zinc-800"></div>
      </div>
    </div>
  );
}`,
      },
      {
        filename: 'app/dashboard/error.tsx',
        language: 'tsx',
        description: 'Error boundary rute (WAJIB "use client") untuk menangkap kegagalan tanpa merusak aplikasi.',
        code: `'use client';

import { useEffect } from 'react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Tangkap error untuk logging
    console.error('Captured dashboard error:', error);
  }, [error]);

  return (
    <div className="my-6 p-8 text-center rounded-xl border border-zinc-800 bg-zinc-950">
      <h2 className="text-base font-bold text-rose-400 mb-2">
        Gagal Memuat Halaman
      </h2>
      <p className="text-xs text-zinc-400 mb-4 max-w-md mx-auto leading-relaxed">
        {error.message || 'Terjadi kesalahan sistem saat memuat data halaman.'}
      </p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold border border-zinc-700 transition-colors cursor-pointer"
      >
        Coba Lagi
      </button>
    </div>
  );
}`,
      },
    ],
    integration: {
      title: 'Integrasi dengan Desain Sistem & Navigasi Global',
      explanation: 'Halaman ini langsung di-render di dalam app/layout.tsx melalui prop {children}. Ketika URL /products diakses, Next.js menyusun layout -> loading (jika async) -> page.',
      connectedWith: ['app/layout.tsx', 'components/layout/Navbar.tsx'],
    },
    testingGuide: {
      manualSteps: [
        'Jalankan "npm run dev" dan buka browser di http://localhost:3000/products',
        'Pastikan judul tab browser sesuai dengan metadata yang diatur',
        'Buka http://localhost:3000/products/123 untuk memastikan dynamic route bekerja',
        'Simulasikan error dengan sengaja melempar throw new Error() di page.tsx dan pastikan error.tsx muncul',
      ],
      expectedResult: 'Halaman render tanpa hydration mismatch, tab title sesuai, dan fallback error berfungsi saat disimulasikan.',
    },
    acceptanceCriteria: [
      { id: 'ac-1', text: 'Folder app/<domain>/page.tsx dapat dibuka di browser tanpa error console.' },
      { id: 'ac-2', text: 'Tersedia file loading.tsx dengan skeleton placeholder yang nyaman dipandang.' },
      { id: 'ac-3', text: 'Tersedia file error.tsx dengan tombol retry reset().' },
      { id: 'ac-4', text: 'Dynamic route [id]/page.tsx dapat menerima params secara benar.' },
      { id: 'ac-5', text: 'Metadata title dan description telah didefinisikan.' },
    ],
    gitStandard: {
      branchName: 'feat/page-structure',
      commitExample: 'feat(router): setup products page and route boundary states',
      prTitle: 'Setup App Router: Products Pages and State Boundaries',
    },
    pitfalls: [
      {
        symptom: 'Error: "ReactServerComponentsError: You may not use \'use client\' in layout or page..."',
        cause: 'Lupa bahwa error.tsx WAJIB bertipe Client Component ("use client"), sementara page.tsx bisa Server Component.',
        solution: 'Tambahkan "use client" di baris paling atas error.tsx.',
      },
      {
        symptom: 'Loading skeleton tidak pernah muncul saat navigasi.',
        cause: 'Komponen page.tsx tidak memiliki asynchronous action (fetch/promise).',
        solution: 'Di Next.js, loading.tsx hanya aktif jika page atau komponen di dalamnya bersifat async.',
      },
    ],
    nextStep: {
      title: '02. Components per Page / Feature',
      slug: '02-components-per-page-feature',
      description: 'Pelajari aturan penempatan komponen agar kode tidak menumpuk di folder global.',
    },
  },

  // ==========================================
  // MODUL 02
  // ==========================================
  {
    slug: '02-components-per-page-feature',
    phaseId: 'fase-1',
    order: 2,
    title: '02. Component Architecture: Page vs Feature vs Global',
    subtitle: 'Standar pembagian komponen berdasarkan scope dan domain bisnis.',
    category: 'core-standard',
    layer: 'frontend',
    estimatedMinutes: 35,
    tujuan: 'Menghilangkan kebiasaan memasukkan semua komponen ke global components/ dengan menetapkan aturan 3-Scope: Page-specific, Feature-specific, dan Global UI.',
    prasyarat: [
      'Modul 01: App Router & Page Structure telah diselesaikan',
      'Memahami props dan modularitas React',
    ],
    tasks: [
      'Membuat folder components/ui/ untuk komponen primitif non-bisnis (Button, Modal, Input)',
      'Membuat folder app/<route>/components/ untuk komponen yang hanya dipakai halaman tersebut',
      'Memindahkan sub-bagian halaman dari monolithic page.tsx menjadi potongan komponen modular',
    ],
    steps: [
      {
        title: 'Langkah 1: Identifikasi Scope Komponen',
        description: 'Tanyakan: Apakah komponen ini dipakai di banyak fitur berbeda? Jika HANYA dipakai di satu halaman, simpan di dekat halaman tersebut.',
      },
      {
        title: 'Langkah 2: Buat Primitif Global (components/ui/Button.tsx)',
        description: 'Button, Input, Badge, Dialog tidak boleh memiliki business logic (misal: memanggil API produk). Komponen ini murni UI.',
      },
      {
        title: 'Langkah 3: Buat Komponen Lokal (app/products/components/ProductHeader.tsx)',
        description: 'Komponen judul halaman dan action tombol tambah khusus domain produk ditaruh di folder lokal rute.',
      },
    ],
    fileTree: [
      { path: 'components/', type: 'folder', status: 'modified' },
      { path: 'components/ui/Button.tsx', type: 'file', status: 'added', description: 'Global UI button primitive' },
      { path: 'components/ui/Badge.tsx', type: 'file', status: 'added', description: 'Global UI badge primitive' },
      { path: 'app/products/components/', type: 'folder', status: 'added' },
      { path: 'app/products/components/ProductHeader.tsx', type: 'file', status: 'added', description: 'Page-specific component' },
      { path: 'app/products/components/ProductStats.tsx', type: 'file', status: 'added', description: 'Page-specific component' },
      { path: 'app/products/page.tsx', type: 'file', status: 'modified', description: 'Komposisi komponen modular' },
    ],
    codeSnippets: [
      {
        filename: 'components/ui/Button.tsx',
        language: 'tsx',
        description: 'Contoh komponen Global UI murni (bebas business logic)',
        code: `import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  isLoading = false,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const styles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={\`px-4 py-2 rounded-lg font-medium text-sm transition-all disabled:opacity-50 \${styles[variant]} \${className}\`}
      {...props}
    >
      {isLoading ? 'Memproses...' : children}
    </button>
  );
}`,
      },
      {
        filename: 'app/products/components/ProductHeader.tsx',
        language: 'tsx',
        description: 'Page-specific component yang hanya dipakai di app/products/page.tsx',
        code: `import { Button } from '@/components/ui/Button';

interface ProductHeaderProps {
  totalCount: number;
  onAddNew?: () => void;
}

export function ProductHeader({ totalCount, onAddNew }: ProductHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Manajemen Produk</h1>
        <p className="text-sm text-slate-500">
          Total {totalCount} produk terdaftar dalam katalog sistem.
        </p>
      </div>

      <Button onClick={onAddNew}>
        + Tambah Produk Baru
      </Button>
    </div>
  );
}`,
      },
    ],
    integration: {
      title: 'Komposisi di Tingkat Page',
      explanation: 'page.tsx bertindak sebagai orkestrator yang mengimpor komponen lokal (ProductHeader) dan komponen global (Button, Navbar), bukan menulis seluruh JSX ratusan baris di satu file.',
      connectedWith: ['app/products/page.tsx', 'components/ui/Button.tsx'],
    },
    testingGuide: {
      manualSteps: [
        'Buka app/products/page.tsx, pastikan file terbaca rapi < 100 baris kode',
        'Pastikan components/ui/Button tidak mengimpor file apa pun dari dalam folder app/',
        'Verifikasi tampilan di browser tetap berfungsi seperti sebelumnya',
      ],
      expectedResult: 'Kode bersih, ketergantungan file mengalir ke satu arah (Page mengimpor Components, bukan sebaliknya).',
    },
    acceptanceCriteria: [
      { id: 'ac-2-1', text: 'Tidak ada komponen khusus produk yang disimpan di root components/ui/.' },
      { id: 'ac-2-2', text: 'Folder app/<domain>/components/ dibuat untuk komponen yang spesifik rute.' },
      { id: 'ac-2-3', text: 'Semua komponen UI global menerima varian lewat props (Button, Badge).' },
      { id: 'ac-2-4', text: 'File page.tsx menjadi ringkas dan mudah dibaca (clean orchestration).' },
    ],
    gitStandard: {
      branchName: 'refactor/component-scoping',
      commitExample: 'refactor(components): isolate page-specific components from global ui',
      prTitle: 'Refactor: Implement 3-Scope Component Architecture',
    },
    pitfalls: [
      {
        symptom: 'Circular Dependency Warning saat build.',
        cause: 'Komponen global di components/ui mengimpor data atau tipe dari app/products/.',
        solution: 'Global component dilarang bergantung pada modul domain. Gunakan generic props atau callback.',
      },
    ],
    nextStep: {
      title: '03. Feature Structure',
      slug: '03-feature-structure',
      description: 'Organisasi file berbasis domain untuk proyek berskala menengah ke atas.',
    },
  },

  // ==========================================
  // MODUL 03
  // ==========================================
  {
    slug: '03-feature-structure',
    phaseId: 'fase-1',
    order: 3,
    title: '03. Domain / Feature-Based Structure',
    subtitle: 'Mengelompokkan kode berdasarkan modul bisnis, bukan tipe file.',
    category: 'architecture',
    layer: 'frontend',
    estimatedMinutes: 25,
    tujuan: 'Menerapkan pola Feature-Based Architecture agar kode per fitur (products, users, orders) terisolasi dan mudah dihapus atau dimodifikasi tanpa merusak fitur lain.',
    prasyarat: ['Modul 02 telah selesai.'],
    tasks: [
      'Membuat folder features/<nama-fitur>/ jika komponen digunakan lintas halaman dalam domain yang sama',
      'Mendefinisikan tipe data domain di types/<domain>.ts',
      'Memisahkan service/API hook ke dalam domain feature',
    ],
    steps: [
      {
        title: 'Langkah 1: Tentukan Kapan Menggunakan folder features/',
        description: 'Gunakan features/ jika sebuah komponen (misal ProductCard) dibutuhkan baik di halaman list (app/products/page.tsx) maupun di halaman dashboard ringkasan (app/dashboard/page.tsx).',
      },
      {
        title: 'Langkah 2: Susun Struktur Feature',
        description: 'features/products/ berisi components/, types/, dan api/.',
      },
    ],
    fileTree: [
      { path: 'features/', type: 'folder', status: 'added' },
      { path: 'features/products/components/ProductCard.tsx', type: 'file', status: 'added' },
      { path: 'features/products/types.ts', type: 'file', status: 'added' },
      { path: 'app/products/page.tsx', type: 'file', status: 'modified' },
      { path: 'app/dashboard/page.tsx', type: 'file', status: 'modified' },
    ],
    codeSnippets: [
      {
        filename: 'features/products/types.ts',
        language: 'typescript',
        code: `export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  status: 'active' | 'draft' | 'archived';
  createdAt: string;
}`,
      },
    ],
    integration: {
      title: 'Shared Cross-Route Feature Domain',
      explanation: 'Berbagai halaman dapat mengimpor komponen ProductCard dari features/products/components/ProductCard tanpa harus menduplikasi kode.',
      connectedWith: ['app/products/page.tsx', 'app/dashboard/page.tsx'],
    },
    testingGuide: {
      manualSteps: ['Cek file import di kedua halaman', 'Pastikan tidak ada duplikasi definisi tipe'],
      expectedResult: 'Satu tipe data domain dipakai bersama oleh seluruh halaman terkait.',
    },
    acceptanceCriteria: [
      { id: 'ac-3-1', text: 'Entitas domain memiliki file types.ts yang jelas.' },
      { id: 'ac-3-2', text: 'Komponen yang digunakan lintas halaman dalam satu domain berada di features/<domain>/.' },
    ],
    gitStandard: {
      branchName: 'feat/feature-structure',
      commitExample: 'feat(architecture): organize products into feature folder',
      prTitle: 'Setup Feature Structure for Products Module',
    },
    pitfalls: [
      {
        symptom: 'Bingung memilih antara app/<route>/components vs features/<domain>/components.',
        cause: 'Belum mengecek apakah komponen dipakai di > 1 rute.',
        solution: 'Jika baru dipakai di 1 rute, taruh di app/<route>/components/. Jangan over-engineering terlalu dini!',
      },
    ],
    nextStep: {
      title: '04. Form Handling & Validation',
      slug: '04-form-handling-validation',
      description: 'Menangkap input form dan memvalidasinya menggunakan Zod.',
    },
  },

  // ==========================================
  // MODUL 04
  // ==========================================
  {
    slug: '04-form-handling-validation',
    phaseId: 'fase-1',
    order: 4,
    title: '04. Form Handling & Client-Side Validation',
    subtitle: 'Standarisasi validasi form interaktif dengan Zod dan penanganan error state.',
    category: 'core-standard',
    layer: 'frontend',
    estimatedMinutes: 40,
    tujuan: 'Membuat form interaktif yang aman, memiliki validasi schema (Zod), feedback visual instan pada field error, dan penanganan status loading saat pengiriman.',
    prasyarat: ['Modul 02 & 03 telah selesai.'],
    tasks: [
      'Install Zod untuk validasi skema (npm install zod)',
      'Membuat skema validasi form dengan pesan bahasa Indonesia yang ramah',
      'Membuat komponen form dengan state loading, field error, dan success banner',
    ],
    steps: [
      {
        title: 'Langkah 1: Definisikan Schema Zod',
        description: 'Tentukan tipe data, batas karakter minimal/maksimal, format email, dan angka positif.',
      },
      {
        title: 'Langkah 2: Hubungkan Form State',
        description: 'Validasi form saat user menekan Submit sebelum mengirimkan ke backend.',
      },
      {
        title: 'Langkah 3: Tampilkan Inline Error Message',
        description: 'Setiap input yang bermasalah harus menampilkan pesan merah tepat di bawah input tersebut.',
      },
    ],
    fileTree: [
      { path: 'app/products/create/', type: 'folder', status: 'added' },
      { path: 'app/products/create/page.tsx', type: 'file', status: 'added' },
      { path: 'app/products/components/ProductForm.tsx', type: 'file', status: 'added' },
      { path: 'lib/schemas/product.schema.ts', type: 'file', status: 'added' },
    ],
    codeSnippets: [
      {
        filename: 'lib/schemas/product.schema.ts',
        language: 'typescript',
        code: `import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(3, 'Nama produk minimal 3 karakter').max(100, 'Nama terlalu panjang'),
  price: z.coerce.number().positive('Harga harus lebih dari 0'),
  stock: z.coerce.number().int().nonnegative('Stok tidak boleh negatif'),
  category: z.string().min(1, 'Kategori wajib dipilih'),
});

export type ProductFormValues = z.infer<typeof productSchema>;`,
      },
      {
        filename: 'app/products/components/ProductForm.tsx',
        language: 'tsx',
        code: `'use client';

import { useState } from 'react';
import { productSchema, ProductFormValues } from '@/lib/schemas/product.schema';

export function ProductForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    
    const formData = new FormData(e.currentTarget);
    const rawData = Object.fromEntries(formData.entries());
    
    const result = productSchema.safeParse(rawData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[issue.path[0].toString()] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    // Simulasi submit ke API
    await new Promise((r) => setTimeout(r, 1000));
    setIsSubmitting(false);
    alert('Form valid & siap dikirim ke backend!');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg bg-white p-6 rounded-xl border">
      <div>
        <label className="block text-sm font-semibold mb-1">Nama Produk</label>
        <input name="name" className="w-full border rounded-lg px-3 py-2 text-sm" />
        {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Harga (Rp)</label>
        <input type="number" name="price" className="w-full border rounded-lg px-3 py-2 text-sm" />
        {errors.price && <p className="text-xs text-rose-600 mt-1">{errors.price}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50"
      >
        {isSubmitting ? 'Memvalidasi...' : 'Simpan Produk'}
      </button>
    </form>
  );
}`,
      },
    ],
    integration: {
      title: 'Pintu Masuk Data ke Backend',
      explanation: 'Schema Zod yang sama nantinya dapat di-reuse di Backend Express untuk memastikan data yang diterima sama persis dengan yang divalidasi frontend.',
      connectedWith: ['Backend Express Validation Middleware'],
    },
    testingGuide: {
      manualSteps: [
        'Klik submit dalam keadaan input kosong, pastikan semua error inline muncul',
        'Isi harga dengan angka minus, pastikan pesan "Harga harus lebih dari 0" tampil',
        'Isi data valid, klik submit, tombol harus disable dan menampilkan status loading',
      ],
      expectedResult: 'Semua validasi tertangkap di frontend tanpa mengirim bad payload ke server.',
    },
    acceptanceCriteria: [
      { id: 'ac-4-1', text: 'Schema Zod terdefinisi dengan pesan error bahasa Indonesia yang jelas.' },
      { id: 'ac-4-2', text: 'Tombol submit otomatis disabled saat request sedang berjalan.' },
      { id: 'ac-4-3', text: 'Inline error muncul tepat di bawah input yang tidak valid.' },
    ],
    gitStandard: {
      branchName: 'feat/form-validation',
      commitExample: 'feat(form): add zod validation schema and inline error states',
      prTitle: 'Form Validation with Zod and Loading States',
    },
    pitfalls: [
      {
        symptom: 'Input number terbaca sebagai string di Zod sehingga validasi gagal.',
        cause: 'FormData secara default mengembalikan nilai bertipe string.',
        solution: 'Gunakan z.coerce.number() pada schema Zod agar otomatis diubah menjadi angka.',
      },
    ],
    nextStep: {
      title: '05. Database Architecture',
      slug: '05-database-schema-migrations',
      description: 'Merancang database schema, migration, dan seeder di database relasional.',
    },
  },

  // ==========================================
  // MODUL 05
  // ==========================================
  {
    slug: '05-database-schema-migrations',
    phaseId: 'fase-2',
    order: 5,
    title: '05. Database Modeling & Migration Workflow',
    subtitle: 'Standarisasi perancangan skema relasional, migrasi database, dan seed data.',
    category: 'core-standard',
    layer: 'database',
    estimatedMinutes: 45,
    tujuan: 'Mengajarkan alur pembuatan database profesional: merancang relasi entitas berdasarkan form requirement, menulis migration script tanpa drift, dan menyiapkan seed data dummy.',
    prasyarat: ['Modul 04 selesai (form field sudah jelas).', 'Database PostgreSQL / MySQL lokal sudah aktif.'],
    tasks: [
      'Menentukan tabel entitas dan kolom berdasarkan kebutuhan UI',
      'Membuat file migration resmi (bukan membuat tabel manual via GUI phpMyAdmin/DBeaver)',
      'Membuat seeder dengan minimal 5 data realistis untuk pengujian',
    ],
    steps: [
      {
        title: 'Langkah 1: Identifikasi Kolom dari Form Requirement',
        description: 'Setiap field yang ada di form Modul 04 dipetakan ke kolom database dengan tipe data SQL yang tepat (VARCHAR, INTEGER, TIMESTAMP).',
      },
      {
        title: 'Langkah 2: Eksekusi Migration',
        description: 'Jalankan migration agar struktur tabel tercatat dalam version control Git.',
      },
      {
        title: 'Langkah 3: Jalankan Seeder',
        description: 'Eksekusi script seeder agar mahasiswa tidak memulai dengan database kosong saat mengembangkan fitur.',
      },
    ],
    fileTree: [
      { path: 'backend/src/db/migrations/20260301_create_products.sql', type: 'file', status: 'added' },
      { path: 'backend/src/db/seeds/products.seed.ts', type: 'file', status: 'added' },
      { path: 'backend/src/config/database.ts', type: 'file', status: 'added' },
    ],
    codeSnippets: [
      {
        filename: 'backend/src/db/migrations/20260301_create_products.sql',
        language: 'sql',
        code: `CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_category ON products(category);`,
      },
    ],
    integration: {
      title: 'Pondasi Data Backend',
      explanation: 'Tabel ini nantinya akan di-query oleh Service Layer di Express.js.',
      connectedWith: ['Express.js Services', 'Database Pool/Client'],
    },
    testingGuide: {
      manualSteps: [
        'Jalankan migration command',
        'Buka database viewer (DBeaver/pgAdmin) dan pastikan tabel products terbuat dengan indeks',
        'Jalankan seed script dan pastikan 5 baris data masuk',
      ],
      expectedResult: 'Tabel terbuat dengan constraint CHECK dan data seed berhasil dimasukkan.',
    },
    acceptanceCriteria: [
      { id: 'ac-5-1', text: 'Tabel dibuat melalui migration script yang ter-commit di Git.' },
      { id: 'ac-5-2', text: 'Terdapat primary key, timestamp created_at & updated_at.' },
      { id: 'ac-5-3', text: 'Seeder berhasil mengisi minimal 5 data dummy.' },
    ],
    gitStandard: {
      branchName: 'feat/db-migration',
      commitExample: 'feat(db): add products table migration and seed script',
      prTitle: 'Database Schema: Products Table and Seeders',
    },
    pitfalls: [
      {
        symptom: 'Rekan tim mengalami database error saat pull kode.',
        cause: 'Membuat tabel langsung lewat GUI tanpa membuat file migration di Git.',
        solution: 'Selalu buat file migration script agar rekan tim bisa menjalankan perintah yang sama.',
      },
    ],
    nextStep: {
      title: '06. Express.js Layered Architecture',
      slug: '06-backend-express-architecture',
      description: 'Membangun REST API berlayer: Router -> Controller -> Service.',
    },
  },

  // ==========================================
  // MODUL 06
  // ==========================================
  {
    slug: '06-backend-express-architecture',
    phaseId: 'fase-2',
    order: 6,
    title: '06. Express.js Layered Architecture',
    subtitle: 'Standarisasi pemisahan Router, Controller, Service, dan Error Middleware.',
    category: 'core-standard',
    layer: 'backend',
    estimatedMinutes: 45,
    tujuan: 'Menghindari penulisan logic dan query database di dalam route handler. Membangun struktur backend berlapis yang rapi dan mudah di-test.',
    prasyarat: ['Modul 05 selesai (tabel database siap diakses).'],
    tasks: [
      'Membuat route handler terpisah (src/routes/product.routes.ts)',
      'Membuat controller untuk mengelola req/res (src/controllers/product.controller.ts)',
      'Membuat service untuk business logic dan DB query (src/services/product.service.ts)',
      'Menerapkan centralized error handling middleware',
    ],
    steps: [
      {
        title: 'Langkah 1: Setup Service Layer',
        description: 'Service hanya berurusan dengan data: query database, kalkulasi bisnis. Tidak boleh mengakses objek req atau res.',
      },
      {
        title: 'Langkah 2: Setup Controller Layer',
        description: 'Controller menerima req, memvalidasi input, memanggil service, dan mengirim response JSON dengan HTTP status code yang tepat.',
      },
      {
        title: 'Langkah 3: Setup Router Layer',
        description: 'Router hanya memetakan URL path (GET /api/products) ke method controller terkait.',
      },
    ],
    fileTree: [
      { path: 'backend/src/routes/product.routes.ts', type: 'file', status: 'added' },
      { path: 'backend/src/controllers/product.controller.ts', type: 'file', status: 'added' },
      { path: 'backend/src/services/product.service.ts', type: 'file', status: 'added' },
      { path: 'backend/src/middlewares/errorHandler.ts', type: 'file', status: 'added' },
      { path: 'backend/src/app.ts', type: 'file', status: 'modified' },
    ],
    codeSnippets: [
      {
        filename: 'backend/src/controllers/product.controller.ts',
        language: 'typescript',
        code: `import { Request, Response, NextFunction } from 'express';
import * as productService from '../services/product.service';

export async function getAllProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const products = await productService.findAll();
    res.status(200).json({
      success: true,
      message: 'Berhasil mengambil daftar produk',
      data: products,
    });
  } catch (error) {
    next(error);
  }
}`,
      },
    ],
    integration: {
      title: 'Penyedia Data Terpusat',
      explanation: 'Endpoint ini menjadi penyedia data JSON bagi frontend Next.js.',
      connectedWith: ['Next.js Fetcher', 'Database PostgreSQL/MySQL'],
    },
    testingGuide: {
      manualSteps: [
        'Jalankan server backend (npm run dev)',
        'Buka Insomnia / Postman / cURL: GET http://localhost:5000/api/products',
        'Pastikan menerima status 200 OK dengan format { success: true, data: [...] }',
      ],
      expectedResult: 'Format response konsisten dengan envelope { success, message, data }.',
    },
    acceptanceCriteria: [
      { id: 'ac-6-1', text: 'Tidak ada SQL query yang ditulis langsung di file router.' },
      { id: 'ac-6-2', text: 'Controller menggunakan try-catch dan meneruskan error ke next(err).' },
      { id: 'ac-6-3', text: 'Response selalu menggunakan envelope { success, message, data }.' },
    ],
    gitStandard: {
      branchName: 'feat/backend-products-api',
      commitExample: 'feat(api): implement layered product router, controller, and service',
      prTitle: 'Backend: Layered Architecture for Products API',
    },
    pitfalls: [
      {
        symptom: 'Request menggantung (hanging) dan browser loading terus menerus saat terjadi error.',
        cause: 'Controller menangkap error tapi lupa memanggil next(error) atau mengirim res.status(500).',
        solution: 'Selalu panggil next(error) di blok catch agar ditangani centralized errorHandler middleware.',
      },
    ],
    nextStep: {
      title: '07. Frontend ↔ Backend Integration',
      slug: '07-frontend-backend-integration',
      description: 'Menghubungkan frontend Next.js ke Express.js API dengan contract yang kuat.',
    },
  },

  // ==========================================
  // MODUL 07
  // ==========================================
  {
    slug: '07-frontend-backend-integration',
    phaseId: 'fase-3',
    order: 7,
    title: '07. Frontend ↔ Backend Integration',
    subtitle: 'Standarisasi kontrak API, HTTP status, centralized fetcher, dan error parsing.',
    category: 'core-standard',
    layer: 'integration',
    estimatedMinutes: 40,
    tujuan: 'Menghubungkan form dan view Next.js dengan API Express.js menggunakan fetcher terpusat, penanganan CORS, dan pengelolaan environment variables (.env.local).',
    prasyarat: ['Modul 04 (Form) dan Modul 06 (Backend API) telah berjalan lokal.'],
    tasks: [
      'Menyiapkan file .env.local untuk menyimpan NEXT_PUBLIC_API_URL',
      'Membuat client fetcher terpusat (lib/api-client.ts) dengan interceptor error',
      'Menampilkan data live dari backend di app/products/page.tsx',
    ],
    steps: [
      {
        title: 'Langkah 1: Setup Konfigurasi Environment',
        description: 'Jangan pernah hardcode URL backend seperti http://localhost:5000 di dalam komponen. Gunakan process.env.NEXT_PUBLIC_API_URL.',
      },
      {
        title: 'Langkah 2: Buat Centralized API Client',
        description: 'Bungkus fungsi fetch bawaan dengan handling token otomatis dan standard error parser.',
      },
      {
        title: 'Langkah 3: Integrasikan ke Komponen',
        description: 'Tampilkan loading saat request berlangsung dan tampilkan data saat berhasil.',
      },
    ],
    fileTree: [
      { path: '.env.local', type: 'file', status: 'added', description: 'Simpan URL backend' },
      { path: 'lib/api-client.ts', type: 'file', status: 'added', description: 'Centralized fetcher wrapper' },
      { path: 'app/products/page.tsx', type: 'file', status: 'modified', description: 'Live data fetching' },
    ],
    codeSnippets: [
      {
        filename: 'lib/api-client.ts',
        language: 'typescript',
        code: `const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = \`\${BASE_URL}\${endpoint.startsWith('/') ? endpoint : \`/\${endpoint}\`}\`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, { ...options, headers });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Terjadi kesalahan saat memproses data.');
  }

  return data;
}`,
      },
    ],
    integration: {
      title: 'Penyambung Jalur Fullstack',
      explanation: 'Fetcher menghubungkan komponen UI dengan controller Express.js secara terstandar.',
      connectedWith: ['Express.js Backend', 'Next.js Client Components'],
    },
    testingGuide: {
      manualSteps: [
        'Pastikan backend menyala di port 5000 dan frontend di port 3000',
        'Buka browser di /products, periksa tab Network di Developer Tools',
        'Pastikan request berhasil dengan status 200 tanpa CORS blocked error',
      ],
      expectedResult: 'Data dari database Express berhasil tampil di tabel Next.js.',
    },
    acceptanceCriteria: [
      { id: 'ac-7-1', text: 'URL API diambil dari process.env.NEXT_PUBLIC_API_URL.' },
      { id: 'ac-7-2', text: 'Fetcher melempar error deskriptif saat status response !== 200.' },
      { id: 'ac-7-3', text: 'Backend telah dikonfigurasi CORS untuk mengizinkan origin frontend.' },
    ],
    gitStandard: {
      branchName: 'feat/api-integration',
      commitExample: 'feat(api): connect products frontend with express api client',
      prTitle: 'Fullstack Integration: Products Live Data',
    },
    pitfalls: [
      {
        symptom: 'CORS policy blocked: No "Access-Control-Allow-Origin" header present.',
        cause: 'Backend Express belum mengaktifkan package cors untuk port frontend.',
        solution: 'Install dan gunakan middleware app.use(cors({ origin: "http://localhost:3000" })) di backend.',
      },
    ],
    nextStep: {
      title: '08. Authentication & Authorization',
      slug: '08-authentication-authorization',
      description: 'Mengamankan sistem dengan login, JWT/Session, dan protected routes.',
    },
  },

  // ==========================================
  // MODUL 08
  // ==========================================
  {
    slug: '08-authentication-authorization',
    phaseId: 'fase-3',
    order: 8,
    title: '08. Authentication & Authorization (RBAC)',
    subtitle: 'Standarisasi alur registrasi, login, token management, dan proteksi halaman.',
    category: 'core-standard',
    layer: 'backend',
    estimatedMinutes: 50,
    tujuan: 'Mengajarkan arsitektur autentikasi yang aman setelah dasar integrasi selesai: password hashing (bcrypt), token JWT/Cookie, Auth context di frontend, dan proteksi rute.',
    prasyarat: ['Modul 07 selesai (integrasi API bekerja).'],
    tasks: [
      'Membuat tabel users dengan password ter-hash',
      'Membuat endpoint POST /api/auth/login dan POST /api/auth/register',
      'Membuat middleware requireAuth dan requireRole di backend',
      'Menerapkan protected route redirect di frontend',
    ],
    steps: [
      {
        title: 'Langkah 1: Hashing Password Wajib',
        description: 'DILARANG menyimpan plain-text password! Gunakan bcrypt dengan salt minimal 10 rounds.',
      },
      {
        title: 'Langkah 2: Generate Token & Response User Profile',
        description: 'Saat login berhasil, kirim JWT token dan data user (id, nama, role) tanpa field password.',
      },
      {
        title: 'Langkah 3: Proteksi Rute Frontend',
        description: 'Jika user belum login dan mencoba membuka halaman dashboard, redirect ke /login.',
      },
    ],
    fileTree: [
      { path: 'backend/src/routes/auth.routes.ts', type: 'file', status: 'added' },
      { path: 'backend/src/middlewares/auth.middleware.ts', type: 'file', status: 'added' },
      { path: 'app/(auth)/login/page.tsx', type: 'file', status: 'added' },
      { path: 'context/auth-context.tsx', type: 'file', status: 'added' },
    ],
    codeSnippets: [
      {
        filename: 'backend/src/middlewares/auth.middleware.ts',
        language: 'typescript',
        code: `import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Akses ditolak: Token tidak ditemukan' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    (req as any).user = payload;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Sesi kedaluwarsa atau token tidak valid' });
  }
}`,
      },
    ],
    integration: {
      title: 'Penjaga Seluruh Akses Data',
      explanation: 'Middleware auth dipasang di router yang membutuhkan login sebelum controller dieksekusi.',
      connectedWith: ['Router Backend', 'Route Protection Frontend'],
    },
    testingGuide: {
      manualSteps: [
        'Coba panggil endpoint produk tanpa token, pastikan menerima 401 Unauthorized',
        'Lakukan login dengan password yang benar, simpan token',
        'Panggil endpoint dengan header Authorization: Bearer <token>, pastikan 200 OK',
      ],
      expectedResult: 'Endpoint terlindungi dari akses tanpa kredensial.',
    },
    acceptanceCriteria: [
      { id: 'ac-8-1', text: 'Password disimpan dalam bentuk hash bcrypt (tidak ada plain-text).' },
      { id: 'ac-8-2', text: 'Endpoint terproteksi mengembalikan 401 jika token absen atau salah.' },
      { id: 'ac-8-3', text: 'Frontend otomatis mengarahkan ke /login saat user belum login.' },
    ],
    gitStandard: {
      branchName: 'feat/auth-system',
      commitExample: 'feat(auth): add password hashing, jwt token, and route protection',
      prTitle: 'Authentication and Role-Based Authorization',
    },
    pitfalls: [
      {
        symptom: 'JWT_SECRET bocor di repository GitHub.',
        cause: 'Menulis string secret langsung di kode sumber.',
        solution: 'Selalu simpan secret di file .env dan tambahkan .env ke dalam .gitignore.',
      },
    ],
    nextStep: {
      title: '09. CRUD & Data Management',
      slug: '09-crud-data-management',
      description: 'Resep terstandar untuk Create, Read, Update, Delete dengan dialog konfirmasi.',
    },
  },

  // ==========================================
  // MODUL 09
  // ==========================================
  {
    slug: '09-crud-data-management',
    phaseId: 'fase-3',
    order: 9,
    title: '09. Reusable CRUD Master Pattern',
    subtitle: 'Template alur Create, Read, Update, Delete dengan state feedback dan konfirmasi modal.',
    category: 'core-standard',
    layer: 'integration',
    estimatedMinutes: 45,
    tujuan: 'Menggabungkan form, API client, dan modal ke dalam satu pola alur CRUD yang seragam untuk semua jenis entitas proyek mahasiswa.',
    prasyarat: ['Modul 07 & 08 selesai.'],
    tasks: [
      'Menyediakan list view dengan empty state yang informatif',
      'Membuat aksi Create dengan form dan refresh data otomatis',
      'Membuat aksi Update dengan auto-fill form',
      'Membuat aksi Delete dengan dialog konfirmasi agar tidak terhapus tidak sengaja',
    ],
    steps: [
      {
        title: 'Langkah 1: Buat Empty State',
        description: 'Jika data kosong (length === 0), jangan biarkan tabel putih kosong. Tampilkan ilustrasi dan tombol "Tambah Data Pertama".',
      },
      {
        title: 'Langkah 2: Buat Modal Konfirmasi Hapus',
        description: 'Tindakan delete tidak boleh langsung dieksekusi tanpa konfirmasi pengguna.',
      },
    ],
    fileTree: [
      { path: 'app/products/components/ProductTable.tsx', type: 'file', status: 'added' },
      { path: 'app/products/components/DeleteConfirmModal.tsx', type: 'file', status: 'added' },
      { path: 'app/products/[id]/edit/page.tsx', type: 'file', status: 'added' },
    ],
    codeSnippets: [
      {
        filename: 'app/products/components/DeleteConfirmModal.tsx',
        language: 'tsx',
        code: `import { Button } from '@/components/ui/Button';

interface DeleteModalProps {
  isOpen: boolean;
  itemName: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmModal({
  isOpen,
  itemName,
  isDeleting,
  onConfirm,
  onCancel,
}: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-2">Hapus Item?</h3>
        <p className="text-sm text-slate-600 mb-6">
          Apakah kamu yakin ingin menghapus <strong>&quot;{itemName}&quot;</strong>? Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel} disabled={isDeleting}>
            Batal
          </Button>
          <Button variant="primary" className="bg-rose-600 hover:bg-rose-700" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
          </Button>
        </div>
      </div>
    </div>
  );
}`,
      },
    ],
    integration: {
      title: 'Full Lifecycle Data Management',
      explanation: 'Menghubungkan operasi frontend ke seluruh endpoint CRUD backend.',
      connectedWith: ['Backend CRUD Controllers'],
    },
    testingGuide: {
      manualSteps: [
        'Tambah produk baru, pastikan langsung muncul di list',
        'Edit data produk, pastikan nilai baru tersimpan',
        'Klik tombol hapus, batalkan di modal, pastikan data tidak hilang',
        'Klik hapus dan konfirmasi, pastikan data terhapus dari database',
      ],
      expectedResult: 'Siklus CRUD 100% bekerja dengan feedback visual.',
    },
    acceptanceCriteria: [
      { id: 'ac-9-1', text: 'Tersedia tampilan Empty State jika database kosong.' },
      { id: 'ac-9-2', text: 'Tindakan hapus selalu dilindungi modal konfirmasi.' },
      { id: 'ac-9-3', text: 'Data di list otomatis sinkron setelah aksi Create/Update/Delete.' },
    ],
    gitStandard: {
      branchName: 'feat/crud-lifecycle',
      commitExample: 'feat(crud): implement table list, edit form, and delete modal confirmation',
      prTitle: 'Full CRUD Flow with Confirmation Modal',
    },
    pitfalls: [
      {
        symptom: 'User menghapus data tanpa sengaja karena klik satu kali.',
        cause: 'Langsung memanggil API DELETE saat icon tempat sampah diklik.',
        solution: 'Wajib gunakan modal konfirmasi dengan tombol Batal dan Konfirmasi.',
      },
    ],
    nextStep: {
      title: '10. File Upload & Storage',
      slug: '10-file-upload-storage',
      description: 'Menangani upload gambar/dokumen dengan validasi ukuran dan MIME type.',
    },
  },

  // ==========================================
  // MODUL 10
  // ==========================================
  {
    slug: '10-file-upload-storage',
    phaseId: 'fase-4',
    order: 10,
    title: '10. File Upload & Storage',
    subtitle: 'Standarisasi upload file, validasi ekstensi/ukuran, dan penyimpanan gambar.',
    category: 'feature-recipe',
    layer: 'backend',
    estimatedMinutes: 35,
    tujuan: 'Mengajarkan pipeline upload file yang aman: validasi client-side, sanitasi ekstensi di Multer, batas ukuran file (max 2MB), dan penyimpanan referensi URL di database.',
    prasyarat: ['Modul 09 selesai.'],
    tasks: [
      'Memvalidasi file di input frontend (hanya JPG/PNG, maks 2MB)',
      'Membuat route upload file di backend menggunakan Multer',
      'Menyajikan static file publik atau cloud object storage',
    ],
    steps: [
      {
        title: 'Langkah 1: Validasi MIME Type & Ukuran',
        description: 'Tolak file yang bukan gambar atau melebihi batas 2MB sebelum memproses.',
      },
      {
        title: 'Langkah 2: Simpan Path ke Database',
        description: 'Database hanya menyimpan string path (misal: /uploads/img-123.jpg), bukan file biner mentah.',
      },
    ],
    fileTree: [
      { path: 'backend/src/middlewares/upload.middleware.ts', type: 'file', status: 'added' },
      { path: 'backend/uploads/', type: 'folder', status: 'added' },
      { path: 'app/products/components/ImageUploadInput.tsx', type: 'file', status: 'added' },
    ],
    codeSnippets: [
      {
        filename: 'backend/src/middlewares/upload.middleware.ts',
        language: 'typescript',
        code: `import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

export const uploadImage = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Hanya format JPG, PNG, atau WebP yang diperbolehkan'));
    }
  },
});`,
      },
    ],
    integration: {
      title: 'Penyimpanan Aset Statis',
      explanation: 'File disimpan di storage fisik/cloud, URL disimpan di tabel produk.',
      connectedWith: ['Tabel Produk (kolom image_url)', 'Static File Middleware'],
    },
    testingGuide: {
      manualSteps: [
        'Coba upload file .pdf atau .exe, pastikan backend menolak dengan error',
        'Coba upload gambar > 5MB, pastikan batas ukuran tertangkap',
        'Upload gambar 500KB, pastikan file tersimpan di folder uploads/',
      ],
      expectedResult: 'Hanya file gambar valid yang dapat terunggah.',
    },
    acceptanceCriteria: [
      { id: 'ac-10-1', text: 'Validasi MIME type hanya mengizinkan gambar yang aman.' },
      { id: 'ac-10-2', text: 'Ukuran file dibatasi maksimal 2MB.' },
      { id: 'ac-10-3', text: 'Nama file di-generate secara acak/unik untuk menghindari overwrite.' },
    ],
    gitStandard: {
      branchName: 'feat/file-upload',
      commitExample: 'feat(upload): add multer file validation and upload pipeline',
      prTitle: 'File Upload Pipeline with MIME and Size Verification',
    },
    pitfalls: [
      {
        symptom: 'Folder uploads ter-commit dan mengotori repo Git.',
        cause: 'Lupa menambahkan folder uploads/ ke .gitignore.',
        solution: 'Tambahkan "backend/uploads/*" dan "!backend/uploads/.gitkeep" di .gitignore.',
      },
    ],
    nextStep: {
      title: '11. Search, Filter & Pagination',
      slug: '11-search-filter-pagination',
      description: 'Menyinkronkan query URL dengan pencarian dan pagination database.',
    },
  },

  // ==========================================
  // MODUL 11
  // ==========================================
  {
    slug: '11-search-filter-pagination',
    phaseId: 'fase-4',
    order: 11,
    title: '11. Search, Filter & Pagination',
    subtitle: 'Standarisasi query parameter URL, debounce input, dan pagination backend.',
    category: 'core-standard',
    layer: 'integration',
    estimatedMinutes: 40,
    tujuan: 'Menghindari pengambilan seluruh data database sekaligus. Mengajarkan pagination (limit & page), sinkronisasi parameter URL (useSearchParams), dan debounce search.',
    prasyarat: ['Modul 09 selesai.'],
    tasks: [
      'Menambahkan LIMIT dan OFFSET di query database backend',
      'Mengirimkan metadata pagination (currentPage, totalPages, totalItems)',
      'Membuat input search dengan debounce agar tidak membanjiri server',
      'Menyinkronkan state filter dengan URL query params',
    ],
    steps: [
      {
        title: 'Langkah 1: Standarkan Response Pagination',
        description: 'Kirimkan data beserta objek meta: { page: 1, limit: 10, total: 45, totalPages: 5 }.',
      },
      {
        title: 'Langkah 2: Sinkronkan dengan URL',
        description: 'Jika user mencari "sepatu", URL harus berubah menjadi ?search=sepatu&page=1 sehingga halaman dapat di-share/bookmark.',
      },
    ],
    fileTree: [
      { path: 'app/products/components/ProductFilter.tsx', type: 'file', status: 'added' },
      { path: 'app/products/components/Pagination.tsx', type: 'file', status: 'added' },
      { path: 'backend/src/services/product.service.ts', type: 'file', status: 'modified' },
    ],
    codeSnippets: [
      {
        filename: 'app/products/components/Pagination.tsx',
        language: 'tsx',
        code: `interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between py-4 border-t border-slate-200">
      <button
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-3 py-1.5 text-xs font-semibold rounded border border-slate-300 disabled:opacity-40"
      >
        &larr; Sebelumnya
      </button>

      <span className="text-xs text-slate-600">
        Halaman <strong>{currentPage}</strong> dari <strong>{totalPages}</strong>
      </span>

      <button
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-1.5 text-xs font-semibold rounded border border-slate-300 disabled:opacity-40"
      >
        Selanjutnya &rarr;
      </button>
    </div>
  );
}`,
      },
    ],
    integration: {
      title: 'Sinkronisasi URL dan Query SQL',
      explanation: 'Search param di browser diteruskan langsung ke controller backend untuk diformulasikan ke klausa WHERE dan LIMIT.',
      connectedWith: ['Next.js useSearchParams', 'SQL WHERE & LIMIT'],
    },
    testingGuide: {
      manualSteps: [
        'Ketik keyword di input pencarian, pastikan URL berubah setelah selesai mengetik',
        'Klik halaman 2, pastikan URL menjadi ?page=2 dan data berpindah',
        'Refresh halaman, pastikan filter dan halaman tetap sama (state tidak hilang)',
      ],
      expectedResult: 'URL dan tabel tetap sinkron bahkan setelah browser di-refresh.',
    },
    acceptanceCriteria: [
      { id: 'ac-11-1', text: 'Query URL tersinkronisasi saat pencarian atau ganti halaman.' },
      { id: 'ac-11-2', text: 'Backend menghitung totalPages secara akurat berdasarkan total rows.' },
      { id: 'ac-11-3', text: 'Input search menggunakan debounce minimal 300ms.' },
    ],
    gitStandard: {
      branchName: 'feat/search-pagination',
      commitExample: 'feat(products): add debounced search and url query pagination',
      prTitle: 'Search, Filter, and Server-Side Pagination',
    },
    pitfalls: [
      {
        symptom: 'Server overload karena setiap tombol ditekan langsung trigger query ke DB.',
        cause: 'Tidak menggunakan debounce pada input pencarian teks.',
        solution: 'Terapkan teknik debounce 300-500ms sebelum memicu request API.',
      },
    ],
    nextStep: {
      title: '12. Error Handling & Security',
      slug: '12-error-handling-security',
      description: 'Merapikan sanitasi input, CORS, dan penanganan unhandled errors.',
    },
  },

  // ==========================================
  // MODUL 12
  // ==========================================
  {
    slug: '12-error-handling-security',
    phaseId: 'fase-4',
    order: 12,
    title: '12. Error Handling & Security Best Practices',
    subtitle: 'Standarisasi keamanan HTTP, proteksi CORS, helmet, dan sanitasi input.',
    category: 'architecture',
    layer: 'backend',
    estimatedMinutes: 35,
    tujuan: 'Mengamankan API Express dari kerentanan umum (SQL Injection, XSS, kebocoran stack trace error) dan membungkus error sistem ke dalam format standar.',
    prasyarat: ['Modul 06 & 08 selesai.'],
    tasks: [
      'Install Helmet middleware untuk keamanan header HTTP',
      'Menyembunyikan stack trace error saat NODE_ENV=production',
      'Menggunakan parameterized query untuk mencegah SQL Injection',
    ],
    steps: [
      {
        title: 'Langkah 1: Setup Helmet & Limit Body Size',
        description: 'Gunakan helmet() dan batasi JSON body parser ke ukuran wajar (misal: 1mb).',
      },
      {
        title: 'Langkah 2: Sembunyikan Error Detail di Production',
        description: 'Jangan pernah menampilkan error.stack ke pengguna umum di lingkungan live.',
      },
    ],
    fileTree: [
      { path: 'backend/src/middlewares/security.middleware.ts', type: 'file', status: 'added' },
      { path: 'backend/src/middlewares/errorHandler.ts', type: 'file', status: 'modified' },
    ],
    codeSnippets: [
      {
        filename: 'backend/src/middlewares/errorHandler.ts',
        language: 'typescript',
        code: `import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  const statusCode = err.statusCode || 500;
  const isProd = process.env.NODE_ENV === 'production';

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Terjadi kesalahan internal pada server',
    ...(isProd ? {} : { stack: err.stack }),
  });
}`,
      },
    ],
    integration: {
      title: 'Pagar Perlindungan Seluruh API',
      explanation: 'Middleware keamanan dijalankan sebelum rute mana pun diproses.',
      connectedWith: ['Express app.ts', 'Environment Variables'],
    },
    testingGuide: {
      manualSteps: [
        'Jalankan aplikasi dengan NODE_ENV=production',
        'Trigger error 500, pastikan stack trace tidak terlihat di response JSON',
      ],
      expectedResult: 'Pesan error aman dan header keamanan HTTP terpasang.',
    },
    acceptanceCriteria: [
      { id: 'ac-12-1', text: 'Helmet middleware terpasang di root Express app.' },
      { id: 'ac-12-2', text: 'Stack trace disembunyikan saat mode produksi.' },
      { id: 'ac-12-3', text: 'Semua query database menggunakan parameterized input ($1, $2 atau ?).' },
    ],
    gitStandard: {
      branchName: 'feat/security-hardening',
      commitExample: 'chore(security): add helmet, parameterized queries, and safe error handler',
      prTitle: 'Security Hardening and Error Normalization',
    },
    pitfalls: [
      {
        symptom: 'SQL Injection berhasil ditembus.',
        cause: 'Menyambungkan string query manual: `SELECT * FROM users WHERE name = \'${input}\'`.',
        solution: 'Selalu gunakan parameterized values ($1, $2) yang disediakan database driver.',
      },
    ],
    nextStep: {
      title: '13. Testing & Verification',
      slug: '13-testing-verification',
      description: 'Menulis skenario pengujian Happy Path dan Edge Cases.',
    },
  },

  // ==========================================
  // MODUL 13
  // ==========================================
  {
    slug: '13-testing-verification',
    phaseId: 'fase-5',
    order: 13,
    title: '13. Testing & Verification',
    subtitle: 'Standarisasi pengujian manual, automated test dasar, dan verifikasi edge cases.',
    category: 'core-standard',
    layer: 'devops',
    estimatedMinutes: 35,
    tujuan: 'Membuktikan bahwa fitur mahasiswa benar-benar bekerja, tahan terhadap input aneh (edge cases), dan memiliki dokumentasi pengujian yang dapat diverifikasi oleh dosen/mentor.',
    prasyarat: ['Modul 09 telah berjalan.'],
    tasks: [
      'Menulis skenario pengujian (Happy Path, Validation Error, Auth Failure)',
      'Membuat koleksi file pengujian API (misal: postman_collection.json atau test.http)',
      'Memverifikasi edge case (angka 0, input teks kosong, token kedaluwarsa)',
    ],
    steps: [
      {
        title: 'Langkah 1: Siapkan File HTTP Test (REST Client)',
        description: 'Buat file requests.http di root proyek agar tim dapat menjalankan uji endpoint dengan 1 klik.',
      },
      {
        title: 'Langkah 2: Uji Happy Path vs Negative Path',
        description: 'Jangan hanya menguji skenario sukses. Uji skenario input sengaja salah dan pastikan server tidak crash.',
      },
    ],
    fileTree: [
      { path: 'backend/tests/requests.http', type: 'file', status: 'added' },
      { path: 'docs/TEST_SCENARIOS.md', type: 'file', status: 'added' },
    ],
    codeSnippets: [
      {
        filename: 'backend/tests/requests.http',
        language: 'http',
        code: `### 1. Test List Produk (Happy Path)
GET http://localhost:5000/api/products
Authorization: Bearer {{token}}

### 2. Test Create Produk - Invalid Validation (Negative Path)
POST http://localhost:5000/api/products
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "name": "",
  "price": -500
}

### 3. Test Unauthorized Access (Security Path)
GET http://localhost:5000/api/products
# Tanpa token -> Harus return 401`,
      },
    ],
    integration: {
      title: 'Penjamin Mutu Sebelum Rilis',
      explanation: 'Skenario pengujian dijalankan oleh penguji atau sebelum merge Pull Request.',
      connectedWith: ['Pull Request Review Checklist'],
    },
    testingGuide: {
      manualSteps: [
        'Buka ekstensi REST Client di VS Code atau Insomnia',
        'Jalankan request #1, #2, dan #3, catat status code yang kembali',
      ],
      expectedResult: 'Seluruh skenario pengujian mengembalikan status code yang sesuai harapan.',
    },
    acceptanceCriteria: [
      { id: 'ac-13-1', text: 'Tersedia dokumentasi uji untuk Happy Path dan Error Path.' },
      { id: 'ac-13-2', text: 'Tidak ada unhandled rejection atau server crash saat payload salah.' },
      { id: 'ac-13-3', text: 'Semua edge cases terverifikasi.' },
    ],
    gitStandard: {
      branchName: 'test/api-scenarios',
      commitExample: 'test(api): document and verify happy path and edge case scenarios',
      prTitle: 'Verification: Test Scenarios and HTTP Client Tests',
    },
    pitfalls: [
      {
        symptom: 'Mahasiswa hanya menguji kasus sukses saat demo.',
        cause: 'Tidak pernah mencoba input negatif (misal tanggal lampau, harga 0).',
        solution: 'Wajibkan skenario pengujian negatif di dalam Acceptance Criteria.',
      },
    ],
    nextStep: {
      title: '14. Git & Development Workflow',
      slug: '14-git-development-workflow',
      description: 'Standarisasi branching, Conventional Commits, dan Code Review.',
    },
  },

  // ==========================================
  // MODUL 14
  // ==========================================
  {
    slug: '14-git-development-workflow',
    phaseId: 'fase-5',
    order: 14,
    title: '14. Git & Collaborative Workflow',
    subtitle: 'Standarisasi branching strategy, Conventional Commits, dan Pull Request review.',
    category: 'devops',
    layer: 'devops',
    estimatedMinutes: 30,
    tujuan: 'Mengubah kebiasaan commit "update 1" atau kerja langsung di branch main. Mahasiswa wajib menggunakan feature branches, conventional commits, dan peer code review.',
    prasyarat: ['Memahami perintah dasar Git (clone, add, commit, push).'],
    tasks: [
      'Membuat branch dengan prefix feat/, fix/, atau refactor/',
      'Menulis pesan commit dengan format: tipe(cakupan): pesan deskriptif',
      'Membuat Pull Request template di GitHub (.github/pull_request_template.md)',
    ],
    steps: [
      {
        title: 'Langkah 1: Jangan Pernah Coding Langsung di "main"',
        description: 'Branch "main" harus selalu siap rilis. Setiap pekerjaan baru WAJIB dibuat di branch baru: git checkout -b feat/nama-fitur.',
      },
      {
        title: 'Langkah 2: Terapkan Conventional Commits',
        description: 'Gunakan awalan: feat (fitur baru), fix (bug), refactor (merapikan kode), chore (config/deps).',
      },
      {
        title: 'Langkah 3: Buka Pull Request dan Lakukan Review',
        description: 'Rekan satu tim harus membaca perubahan kode dan mencentang Acceptance Criteria sebelum di-merge.',
      },
    ],
    fileTree: [
      { path: '.github/pull_request_template.md', type: 'file', status: 'added' },
      { path: '.gitignore', type: 'file', status: 'modified' },
    ],
    codeSnippets: [
      {
        filename: '.github/pull_request_template.md',
        language: 'markdown',
        code: `## Deskripsi Fitur
Jelaskan perubahan apa yang dibuat dan tujuannya.

## Modul yang Diikuti
- [ ] Modul: ...

## Bukti Pengujian (Screenshot / Video)
Tautkan hasil screenshot atau catatan demo di sini.

## Checklist Mandiri
- [ ] Tidak ada file .env atau secret yang ter-commit.
- [ ] Linter lulus tanpa error (\`npm run lint\`).
- [ ] Acceptance criteria modul telah terpenuhi seluruhnya.`,
      },
    ],
    integration: {
      title: 'Pintu Gerbang Kode Tim',
      explanation: 'Workflow Git memastikan seluruh anggota tim sinkron tanpa terjadi konflik besar.',
      connectedWith: ['GitHub Pull Requests', 'CI/CD Pipelines'],
    },
    testingGuide: {
      manualSteps: [
        'Buat branch uji coba: git checkout -b test/git-flow',
        'Lakukan commit dengan pesan rapi: git commit -m "docs: add pr template"',
        'Buka PR di GitHub dan pastikan template muncul otomatis',
      ],
      expectedResult: 'Template PR muncul dan alur review dapat dijalankan.',
    },
    acceptanceCriteria: [
      { id: 'ac-14-1', text: 'Tidak ada commit langsung ke branch main.' },
      { id: 'ac-14-2', text: 'Semua commit mematuhi aturan Conventional Commits.' },
      { id: 'ac-14-3', text: 'Setiap fitur digabungkan melalui Pull Request dengan minimal 1 peer approval.' },
    ],
    gitStandard: {
      branchName: 'chore/git-pr-workflow',
      commitExample: 'chore(git): setup pull request template and branch policy',
      prTitle: 'DevOps: Git Collaborative Workflow and PR Template',
    },
    pitfalls: [
      {
        symptom: 'Merge conflict raksasa ratusan baris saat akhir semester.',
        cause: 'Satu anggota tim tidak pernah pull dari main selama berbulan-bulan.',
        solution: 'Lakukan rebase atau merge dari main secara berkala setiap hari.',
      },
    ],
    nextStep: {
      title: '15. Deployment & Production',
      slug: '15-deployment-production',
      description: 'Menyiapkan build produksi, environment variables, dan deployment hosting.',
    },
  },

  // ==========================================
  // MODUL 15
  // ==========================================
  {
    slug: '15-deployment-production',
    phaseId: 'fase-5',
    order: 15,
    title: '15. Deployment & Production Readiness',
    subtitle: 'Standarisasi production build, database migration di cloud, dan deployment.',
    category: 'devops',
    layer: 'devops',
    estimatedMinutes: 45,
    tujuan: 'Mengajarkan proses rilis aplikasi ke internet: production build (npm run build), konfigurasi hosting (Vercel/Railway/VPS), database cloud, dan verifikasi akhir.',
    prasyarat: ['Seluruh modul 01 sampai 14 selesai dan lulus tes lokal.'],
    tasks: [
      'Menjalankan "npm run build" lokal untuk memastikan tidak ada error TypeScript',
      'Menyiapkan database cloud (Supabase / Neon / Railway PostgreSQL)',
      'Menjalankan migration di database cloud',
      'Deploy backend Express dan frontend Next.js dengan environment variables yang benar',
    ],
    steps: [
      {
        title: 'Langkah 1: Verifikasi Production Build Lokal',
        description: 'Jalankan "npm run build" di lokal. Jika ada error tipe data TypeScript, perbaiki terlebih dahulu sebelum deploy.',
      },
      {
        title: 'Langkah 2: Masukkan Environment Variables di Dashboard Hosting',
        description: 'Isi DATABASE_URL, JWT_SECRET, dan NEXT_PUBLIC_API_URL di menu Settings > Environment Variables platform hosting.',
      },
      {
        title: 'Langkah 3: Live Smoke Testing',
        description: 'Buka URL publik di browser smartphone dan laptop teman untuk memastikan fitur utama dapat diakses di internet.',
      },
    ],
    fileTree: [
      { path: '.env.example', type: 'file', status: 'added', description: 'Template env untuk tim' },
      { path: 'package.json', type: 'file', status: 'modified', description: 'Build scripts verified' },
    ],
    codeSnippets: [
      {
        filename: '.env.example',
        language: 'ini',
        code: `# Database Configuration
DATABASE_URL="postgresql://user:password@cloud-host:5432/dbname"

# Security Secrets
JWT_SECRET="ganti-dengan-string-acak-panjang-di-production"

# Frontend Integration
NEXT_PUBLIC_API_URL="https://api-kamu.railway.app/api"
NODE_ENV="production"`,
      },
    ],
    integration: {
      title: 'Puncak Penyelesaian Proyek',
      explanation: 'Aplikasi sekarang hidup di internet dan siap didemonstrasikan di hadapan klien dan penguji.',
      connectedWith: ['Public Internet URL', 'Cloud Database Instance'],
    },
    testingGuide: {
      manualSteps: [
        'Buka domain publik di browser',
        'Lakukan login dengan akun dummy',
        'Coba buat 1 data baru, pastikan tersimpan ke database cloud',
      ],
      expectedResult: 'Aplikasi online 100% fungsional tanpa error 500.',
    },
    acceptanceCriteria: [
      { id: 'ac-15-1', text: 'Perintah "npm run build" sukses 0 error di frontend dan backend.' },
      { id: 'ac-15-2', text: 'Aplikasi memiliki URL live yang dapat diakses publik.' },
      { id: 'ac-15-3', text: 'Tersedia file .env.example sebagai dokumentasi environment tim.' },
    ],
    gitStandard: {
      branchName: 'release/v1.0.0',
      commitExample: 'chore(release): configure production environment and deployment scripts',
      prTitle: 'Release: Production Deployment and Cloud Database Setup',
    },
    pitfalls: [
      {
        symptom: 'Deploy Vercel gagal dengan error: "Type error: Property \'xyz\' does not exist on type...".',
        cause: 'Tidak pernah mencoba npm run build di komputer lokal sebelum push.',
        solution: 'Selalu jalankan "npm run build" sebelum push ke repository deployment.',
      },
    ],
    nextStep: {
      title: 'Selamat! Proyek PBL Selesai',
      slug: '01-app-router-page-structure',
      description: 'Kamu telah menyelesaikan siklus rekayasa perangkat lunak berstandar industri!',
    },
  },
];

export const PHASE_GROUPS: PhaseGroup[] = [
  {
    id: 'fase-1',
    number: 1,
    title: 'Fase 1: Frontend Architecture',
    description: 'Pondasi App Router, component scoping (3-Scope Rule), struktur feature, dan form validation.',
    modules: DOC_MODULES.filter((m) => m.phaseId === 'fase-1'),
  },
  {
    id: 'fase-2',
    number: 2,
    title: 'Fase 2: Data & Backend Engine',
    description: 'Pemodelan skema database relasional, migrasi zero-drift, dan arsitektur berlapis Express.js.',
    modules: DOC_MODULES.filter((m) => m.phaseId === 'fase-2'),
  },
  {
    id: 'fase-3',
    number: 3,
    title: 'Fase 3: Fullstack Integration & Auth',
    description: 'Integrasi API terpusat, autentikasi berbasis role (RBAC), dan reusable CRUD lifecycle.',
    modules: DOC_MODULES.filter((m) => m.phaseId === 'fase-3'),
  },
  {
    id: 'fase-4',
    number: 4,
    title: 'Fase 4: Advanced Modules & Robustness',
    description: 'Upload file dengan Multer, sinkronisasi URL search/pagination, dan hardening keamanan API.',
    modules: DOC_MODULES.filter((m) => m.phaseId === 'fase-4'),
  },
  {
    id: 'fase-5',
    number: 5,
    title: 'Fase 5: Verification & DevOps',
    description: 'Pengujian edge cases, Conventional Commits, Pull Request review, dan production deployment.',
    modules: DOC_MODULES.filter((m) => m.phaseId === 'fase-5'),
  },
];

export const BLUEPRINTS: BlueprintCase[] = [
  {
    id: 'booking-system',
    title: 'Sistem Booking & Reservasi Lapangan',
    archetype: 'Schedule & Slot Allocation',
    description: 'Bagaimana memetakan modul 01 s.d. 15 ke kasus pemesanan lapangan olahraga dengan pengecekan jadwal ganda.',
    domainEntities: ['Lapangan (Court)', 'Jadwal (TimeSlot)', 'Booking', 'Pembayaran (Payment)'],
    workflowMapping: [
      { stage: 'App Router (01)', implementation: 'app/courts/page.tsx (Katalog lapangan) & app/booking/[courtId]/page.tsx (Form sewa).' },
      { stage: 'Component Scoping (02)', implementation: 'SlotPicker.tsx disimpan di app/booking/components/SlotPicker.tsx.' },
      { stage: 'Database (05)', implementation: 'Tabel bookings memiliki relasi foreign key ke courts dan kolom status enum (pending, confirmed).' },
      { stage: 'Backend Logic (06)', implementation: 'BookingService memeriksa apakah slot waktu sudah dipesan orang lain sebelum menyimpan ke DB.' },
    ],
  },
  {
    id: 'inventory-system',
    title: 'Sistem Manajemen Inventaris & Approval',
    archetype: 'Warehouse & Asset Tracking',
    description: 'Penerapan standar engineering ke kasus pencatatan stok barang, mutasi gudang, dan persetujuan manajer.',
    domainEntities: ['Barang (Item)', 'Kategori (Category)', 'Mutasi (StockMovement)', 'Gudang (Warehouse)'],
    workflowMapping: [
      { stage: 'App Router (01)', implementation: 'app/inventory/page.tsx (List stok) & app/inventory/stock-in/page.tsx (Input barang masuk).' },
      { stage: 'Validation (04)', implementation: 'Zod memvalidasi jumlah stok > 0 dan SKU tidak boleh memiliki spasi.' },
      { stage: 'Auth & RBAC (08)', implementation: 'Hanya role "manager" yang dapat mengakses tombol POST /api/inventory/approve.' },
      { stage: 'Pagination (11)', implementation: 'Tabel inventaris memuat 20 barang per halaman dengan pencarian nama & SKU.' },
    ],
  },
];
