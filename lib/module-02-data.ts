import { DocModule } from '@/types/docs';

export const MODULE_02: DocModule = {
  slug: '02-form-handling',
  phaseId: 'fase-2',
  order: 2,
  title: 'Form Handling, Autentikasi DAL, & Mutasi Data',
  subtitle:
    'Panduan lengkap integrasi form, autentikasi Better Auth / Auth.js, Data Access Layer (DAL), Server Actions, Zod, proteksi IDOR, dan Optimistic UI.',
  category: 'core-standard',
  layer: 'frontend',
  estimatedMinutes: 45,
  tujuan:
    'Mengimplementasikan alur lengkap web aplikasi modern Next.js: mulai dari perencanaan aturan akses, autentikasi sesi backend & DAL, validasi schema Zod, Server Actions yang aman, form handling (useActionState), mutasi database berpagar IDOR, revalidasi cache, hingga Optimistic UI.',
  prasyarat: [
    'Next.js v15+ (App Router)',
    'React 19 (useActionState, useOptimistic)',
    'Better Auth / Auth.js v5',
    'Zod v3+',
  ],
  tasks: [
    'Langkah 1: Tentukan fitur dan aturan aksesnya (perencanaan)',
    'Langkah 2: Pasang sistem login (BE)',
    'Langkah 3: Buat halaman login/daftar (FE)',
    'Langkah 4: Buat DAL dan pagar proxy (BE)',
    'Langkah 5: Buat Schema Validasi (dipakai bersama)',
    'Langkah 6: Buat file Server Action (BE)',
    'Langkah 7: Tambahkan validasi Zod di action (BE)',
    'Langkah 8: Buat form input (FE)',
    'Langkah 9: Hubungkan form dengan action (FE ↔ BE)',
    'Langkah 10: Tampilkan error validasi (FE)',
    'Langkah 11: Implementasikan mutation (simpan data) (BE)',
    'Langkah 12: Tambahkan revalidasi (BE)',
    'Langkah 13: Uji fitur (FE + BE)',
    'Langkah 14: Implementasikan Update dan Delete jika tersedia (BE + sedikit FE)',
    'Langkah 15: Batasi aksi khusus admin (BE, kalau perlu)',
    'Langkah 16: Pengembangan Optimistic UI (FE, opsional)',
  ],
  adaptationTable: [
    {
      aspect: 'Fitur & Entitas Data',
      universalExample: 'Catatan / Item (title, content, userId)',
      projectExampleA: 'Mahasiswa / Nilai (nim, nama, jurusan, userId)',
      projectExampleB: 'Produk / Stok (kode, nama, harga, stok, userId)',
    },
    {
      aspect: 'Library Autentikasi',
      universalExample: 'Better Auth (atau Auth.js v5)',
      projectExampleA: 'Better Auth + MySQL / PostgreSQL adapter',
      projectExampleB: 'Auth.js v5 Credentials & OAuth Provider',
    },
    {
      aspect: 'Data Access Layer (DAL)',
      universalExample: 'lib/dal.ts (getCurrentUser, verifySession)',
      projectExampleA: 'lib/dal.ts dengan React cache() & redirect(/login)',
      projectExampleB: 'src/lib/dal.ts dengan Prisma session check',
    },
    {
      aspect: 'Pagar Proxy / Middleware',
      universalExample: 'middleware.ts (Pagar kasar matcher /dashboard/*)',
      projectExampleA: 'middleware.ts membaca cookie sesi Better Auth',
      projectExampleB: 'proxy.ts handler interceptor rute dashboard',
    },
    {
      aspect: 'Schema Validasi (Shared)',
      universalExample: 'lib/schemas.ts (z.object, z.coerce.number)',
      projectExampleA: 'lib/validations/mahasiswa.ts (inferred type)',
      projectExampleB: 'lib/validations/product.ts (z.coerce untuk harga)',
    },
    {
      aspect: 'Server Action Keamanan',
      universalExample: 'actions.ts ("use server", DAL, Zod safeParse)',
      projectExampleA: 'app/(dashboard)/mahasiswa/actions.ts',
      projectExampleB: 'app/actions/items.ts (return { errors })',
    },
    {
      aspect: 'Proteksi IDOR (Update/Delete)',
      universalExample: 'where: { id, userId: currentUser.id }',
      projectExampleA: 'db.item.deleteMany({ where: { id, userId } })',
      projectExampleB: 'action.bind(null, id) dengan verifikasi kepemilikan',
    },
    {
      aspect: 'Otorisasi Khusus Admin',
      universalExample: 'if (user.role !== "admin") return { error: "FORBIDDEN" }',
      projectExampleA: 'Pengecekan user.role di dalam Server Action',
      projectExampleB: 'Supervisi approval data khusus Administrator',
    },
  ],
  practicalTasks: [
    // -------------------------------------------------------------
    // TASK 1: Tentukan fitur dan aturan aksesnya (perencanaan)
    // -------------------------------------------------------------
    {
      taskNumber: 1,
      title: 'Langkah 1: Tentukan Fitur & Aturan Akses (Perencanaan)',
      description:
        'Tulis fitur apa yang dibuat (misalnya catatan, produk, atau tugas), data apa yang disimpan, dan siapa yang boleh mengaksesnya. Tentukan juga apakah ada role khusus seperti admin.',
      steps: [
        {
          stepNumber: 1,
          title: 'Matriks Rencana Fitur & Kolom Data',
          description:
            'Tentukan entitas fitur (misal: Catatan / Produk / Tugas), kolom data yang disimpan, relasi kepemilikan (userId), dan tipe datanya:',
          instructions: [
            'Pilih satu fitur utama proyekmu (contoh: Catatan, Produk, Tugas, atau Booking).',
            'Catat kolom/field data apa saja yang wajib disimpan ke database beserta tipe datanya.',
            'Wajib sertakan kolom relasi kepemilikan data: userId (foreign key ke tabel users).',
          ],
          codeSnippet: {
            filename: 'docs/fitur-dan-akses.md',
            language: 'markdown',
            description: 'Dokumen spesifikasi fitur, field database, dan matriks hak akses',
            code: `# Spesifikasi Fitur: Manajemen Catatan / Item

## 1. Data yang Disimpan (Database Schema)
- id: string (UUID) atau number (Auto Increment)
- title: string (Judul, wajib, min 3 karakter, max 100 karakter)
- content: string (Deskripsi/konten, opsional, max 500 karakter)
- status: enum ('draft', 'published', 'archived')
- userId: string (Foreign key ke user pemilik - Wajib untuk isolasi data)
- createdAt: timestamp

## 2. Matriks Hak Akses (Role-Based Access Control)
| Role   | Create Data | Read Data (Milik Sendiri) | Read Data (Semua User) | Update/Delete (Milik Sendiri) | Update/Delete (Semua User) |
|--------|-------------|----------------------------|------------------------|-------------------------------|-----------------------------|
| Guest  | ❌ Tidak    | ❌ Tidak                   | ❌ Tidak               | ❌ Tidak                      | ❌ Tidak                    |
| User   | ✅ Ya       | ✅ Ya                      | ❌ Tidak               | ✅ Ya                         | ❌ Tidak (Cegah IDOR!)      |
| Admin  | ✅ Ya       | ✅ Ya                      | ✅ Ya                  | ✅ Ya                         | ✅ Ya (Supervisi / Moderasi)|`,
          },
          verification: {
            action: 'Diskusikan dan catat struktur data bersama tim PBL',
            expectedResult:
              'Semua anggota tim sepakat mengenai field data, relasi userId, dan aturan RBAC.',
          },
        },
        {
          stepNumber: 2,
          title: 'Menentukan Role & Kepemilikan Data',
          description:
            'Terapkan prinsip isolasi data: user biasa hanya mengelola data miliknya sendiri (userId === session.user.id), sedangkan admin memiliki hak supervisi.',
          instructions: [
            'Pastikan setiap entitas bisnis memiliki kolom userId pemilik.',
            'Jangan pernah izinkan query update/delete data hanya mengandalkan record id tanpa filter userId.',
          ],
          verification: {
            action: 'Periksa dokumentasi skema database proyek',
            expectedResult:
              'Tabel entitas memiliki kolom foreign key userId yang terhubung ke tabel user.',
          },
        },
      ],
    },

    // -------------------------------------------------------------
    // TASK 2: Pasang sistem login (BE)
    // -------------------------------------------------------------
    {
      taskNumber: 2,
      title: 'Langkah 2: Pasang Sistem Login (BE)',
      description:
        'Pilih satu library (Better Auth atau Auth.js v5), sambungkan ke database, lalu aktifkan login email dan, kalau perlu, Google. Password otomatis di-hash oleh library, jadi jangan menyimpannya sendiri.',
      steps: [
        {
          stepNumber: 1,
          title: 'Install Library Autentikasi',
          description:
            'Pilih library autentikasi modern (Better Auth direkomendasikan untuk Next.js App Router & TypeScript):',
          instructions: [
            'Jalankan perintah instalasi Better Auth di terminal proyek:',
          ],
          codeSnippet: {
            filename: 'terminal',
            language: 'bash',
            description: 'Install Better Auth',
            code: 'npm install better-auth',
          },
          verification: {
            action: 'Periksa package.json proyekmu',
            expectedResult: 'Tercantum package "better-auth" pada dependencies.',
          },
        },
        {
          stepNumber: 2,
          title: 'Konfigurasi Instance Auth (lib/auth.ts)',
          description:
            'Buat file lib/auth.ts, sambungkan ke database, dan aktifkan login email & password. Password otomatis di-hash secara aman oleh library (Argon2id/Bcrypt), jadi jangan menyimpannya sendiri:',
          instructions: [
            'Buat file lib/auth.ts di root proyek atau src/lib/.',
            'Hubungkan ke database adapter dan aktifkan opsi emailAndPassword.',
          ],
          codeSnippet: {
            filename: 'lib/auth.ts',
            language: 'typescript',
            description: 'Konfigurasi Better Auth dengan database dan email provider',
            code: `import { betterAuth } from "better-auth";
// Contoh jika memakai adapter Prisma / Drizzle / Pool:
// import { prismaAdapter } from "better-auth/adapters/prisma";
// import { prisma } from "@/lib/db";

export const auth = betterAuth({
  // database: prismaAdapter(prisma, { provider: "mysql" }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true, // Otomatis login setelah registrasi
    // Password otomatis di-hash aman oleh library (Argon2id/Bcrypt)
    // JANGAN MENYIMPAN ATAU HASH PASSWORD SECARA MANUAL!
  },
  socialProviders: {
    // Aktifkan login Google jika diperlukan
    // google: {
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 menit cache cookie
    },
  },
});`,
          },
        },
        {
          stepNumber: 3,
          title: 'Buat Route Handler API Auth',
          description:
            'Buat endpoint catch-all route handler untuk melayani request autentikasi dari client di app/api/auth/[...all]/route.ts:',
          instructions: [
            'Buat file di app/api/auth/[...all]/route.ts.',
            'Ekspor method handler GET dan POST yang disediakan oleh library auth.',
          ],
          codeSnippet: {
            filename: 'app/api/auth/[...all]/route.ts',
            language: 'typescript',
            description: 'Route Handler Auth API catch-all',
            code: `import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);`,
          },
          verification: {
            action: 'Buka browser di http://localhost:3000/api/auth/ok',
            expectedResult: 'Endpoint merespons dengan JSON status autentikasi yang valid.',
          },
        },
      ],
    },

    // -------------------------------------------------------------
    // TASK 3: Buat halaman login/daftar (FE)
    // -------------------------------------------------------------
    {
      taskNumber: 3,
      title: 'Langkah 3: Buat Halaman Login/Daftar (FE)',
      description:
        'Buat form login yang memanggil fungsi login dari library tadi. Isi hanya tampilan dan tombol.',
      steps: [
        {
          stepNumber: 1,
          title: 'Inisialisasi Auth Client Helper',
          description:
            'Buat file lib/auth-client.ts untuk memanggil fungsi auth di sisi browser (Client Component):',
          instructions: [
            'Buat file lib/auth-client.ts.',
            'Ekspor fungsi helper client seperti signIn, signUp, signOut, dan useSession.',
          ],
          codeSnippet: {
            filename: 'lib/auth-client.ts',
            language: 'typescript',
            description: 'Client SDK Better Auth',
            code: `import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

export const { signIn, signUp, signOut, useSession } = authClient;`,
          },
        },
        {
          stepNumber: 2,
          title: 'Buat Komponen Halaman Login',
          description:
            'Buat halaman login di app/(auth)/login/page.tsx dengan tampilan bersih, input email/password, dan tombol masuk:',
          instructions: [
            'Gunakan direktif "use client" karena komponen ini menangani event interaksi form onSubmit.',
            'Panggil fungsi signIn.email() langsung saat tombol Masuk diklik.',
          ],
          codeSnippet: {
            filename: 'app/(auth)/login/page.tsx',
            language: 'tsx',
            description: 'Halaman Form Login memanggil fungsi authClient',
            code: `"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const { data, error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message || "Email atau password salah.");
      setIsLoading(false);
      return;
    }

    // Login sukses: arahkan ke halaman dashboard
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
      <div className="w-full max-w-md p-6 bg-zinc-900 border border-zinc-800 rounded-xl space-y-4">
        <h1 className="text-xl font-bold text-white">Masuk ke Akun</h1>
        <p className="text-xs text-zinc-400">Gunakan email dan password terdaftar.</p>

        {errorMessage && (
          <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs rounded">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm font-semibold disabled:opacity-50 transition-colors"
          >
            {isLoading ? "Memproses..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
}`,
          },
          verification: {
            action: 'Buka http://localhost:3000/login di browser',
            expectedResult: 'Form login tampil rapi dan fungsi submit merespons request login.',
          },
        },
      ],
    },

    // -------------------------------------------------------------
    // TASK 4: Buat DAL dan pagar proxy (BE)
    // -------------------------------------------------------------
    {
      taskNumber: 4,
      title: 'Langkah 4: Buat DAL dan Pagar Proxy (BE)',
      description:
        'Buat lib/dal.ts berisi getCurrentUser(). Fungsi ini mengecek sesi, dan kalau belum login user dialihkan ke /login. Tambahkan proxy.ts untuk redirect cepat dari halaman yang butuh login. Proxy hanya pagar kasar, pengecekan sebenarnya ada di DAL.',
      steps: [
        {
          stepNumber: 1,
          title: 'Buat Data Access Layer (DAL) di lib/dal.ts',
          description:
            'Buat fungsi getCurrentUser() di lib/dal.ts menggunakan React cache(). Fungsi ini bertindak sebagai satu-satunya sumber kebenaran (Single Source of Truth) untuk identitas user di sisi server:',
          instructions: [
            'Gunakan React cache() agar pemanggilan getCurrentUser() berkali-kali dalam 1 render request hanya mengeksekusi 1 query database.',
            'Periksa sesi user. Jika tidak ada sesi valid, lempar redirect("/login") langsung dari server.',
          ],
          codeSnippet: {
            filename: 'lib/dal.ts',
            language: 'typescript',
            description: 'Data Access Layer (DAL) dengan cache dan proteksi sesi',
            code: `import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export type CurrentUser = {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
};

// React cache() memastikan query sesi hanya dieksekusi 1x per render request
export const getCurrentUser = cache(async (): Promise<CurrentUser> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Jika tidak ada sesi aktif, langsung alihkan ke halaman login
  if (!session || !session.user) {
    redirect("/login");
  }

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: (session.user as any).role || "user",
  };
});

// Helper untuk mengecek sesi tanpa auto-redirect (berguna untuk halaman publik)
export const getOptionalUser = cache(async (): Promise<CurrentUser | null> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session || !session.user) return null;
    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: (session.user as any).role || "user",
    };
  } catch {
    return null;
  }
});`,
          },
        },
        {
          stepNumber: 2,
          title: 'Buat Pagar Cepat Proxy / Middleware',
          description:
            'Tambahkan pagar proxy kasar di middleware.ts (atau proxy.ts) untuk intercept cepat rute terproteksi (/dashboard/*). Ingat: proxy hanya pagar kasar, pengecekan sebenarnya ada di DAL.',
          instructions: [
            'Buat middleware.ts di root proyek (atau proxy.ts).',
            'Periksa keberadaan cookie sesi. Jika tidak ada, redirect cepat ke /login.',
          ],
          codeSnippet: {
            filename: 'middleware.ts',
            language: 'typescript',
            description: 'Pagar proxy cepat untuk redirect sebelum komponen dirender',
            code: `import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Hanya periksa rute yang membutuhkan proteksi login
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    const sessionCookie =
      request.cookies.get("better-auth.session_token") ||
      request.cookies.get("__Secure-better-auth.session_token");

    // Pagar kasar: Jika cookie sama sekali tidak ada, redirect cepat ke /login
    if (!sessionCookie) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};`,
          },
          verification: {
            action: 'Coba buka http://localhost:3000/dashboard tanpa login',
            expectedResult: 'Browser otomatis dialihkan ke halaman http://localhost:3000/login.',
          },
        },
      ],
    },

    // -------------------------------------------------------------
    // TASK 5: Buat Schema Validasi (dipakai bersama)
    // -------------------------------------------------------------
    {
      taskNumber: 5,
      title: 'Langkah 5: Buat Schema Validasi (Dipakai Bersama)',
      description:
        'Buat satu file lib/schemas.ts berisi aturan tiap field (wajib diisi, minimal karakter, format email). Nilai dari form selalu berupa string, jadi angka perlu z.coerce.number().',
      steps: [
        {
          stepNumber: 1,
          title: 'Buat Skema Validasi Zod di lib/schemas.ts',
          description:
            'Buat lib/schemas.ts berisi aturan validasi tiap field. Karena data FormData dari browser selalu bertipe string, konversikan angka dengan z.coerce.number():',
          instructions: [
            'Install Zod jika belum ada: npm install zod.',
            'Buat file lib/schemas.ts.',
            'Tulis schema dengan validasi tipe, batasan panjang, format, dan pesan error ramah pengguna.',
          ],
          codeSnippet: {
            filename: 'lib/schemas.ts',
            language: 'typescript',
            description: 'Schema validasi Zod terpusat dengan coercion angka',
            code: `import { z } from "zod";

// Skema untuk Tambah & Edit Data
export const ItemSchema = z.object({
  nama: z
    .string({ required_error: "Nama wajib diisi" })
    .trim()
    .min(3, "Nama minimal harus 3 karakter")
    .max(100, "Nama maksimal 100 karakter"),

  kategori: z
    .string({ required_error: "Kategori wajib dipilih" })
    .min(1, "Kategori tidak boleh kosong"),

  // Data dari form HTML selalu berupa string.
  // Gunakan z.coerce.number() agar string "123" diubah menjadi number 123
  jumlah: z.coerce
    .number({ invalid_type_error: "Jumlah harus berupa angka" })
    .int("Jumlah harus berupa bilangan bulat")
    .min(1, "Jumlah minimal adalah 1"),

  keterangan: z
    .string()
    .trim()
    .max(500, "Keterangan maksimal 500 karakter")
    .optional(),
});

// Inferred TypeScript Type dari skema Zod
export type ItemInput = z.infer<typeof ItemSchema>;

// Tipe representasi State kembalian dari Server Action
export type ActionState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};`,
          },
          verification: {
            action: 'Simpan file lib/schemas.ts',
            expectedResult:
              'Tidak ada error linting TypeScript dan tipe ItemInput berhasil diekspor.',
          },
        },
      ],
    },

    // -------------------------------------------------------------
    // TASK 6: Buat file Server Action (BE)
    // -------------------------------------------------------------
    {
      taskNumber: 6,
      title: 'Langkah 6: Buat File Server Action (BE)',
      description:
        'Buat actions.ts dengan "use server" di atasnya. Anggap setiap action sebagai pintu publik, jadi urutannya harus: cek login, cek role kalau perlu, validasi input, lalu proses data.',
      steps: [
        {
          stepNumber: 1,
          title: 'Anatomi & Pipeline Keamanan Server Action',
          description:
            'Buat file actions.ts (atau app/actions.ts). Ingat bahwa Server Action adalah public HTTP POST endpoint, sehingga setiap pemanggilan WAJIB melewati 4 langkah keamanan berurutan:',
          instructions: [
            'Tulis direktif "use server" di baris paling atas.',
            'Urutan eksekusi: (1) Cek autentikasi sesi -> (2) Cek otorisasi role -> (3) Validasi input schema -> (4) Eksekusi mutasi data.',
          ],
          codeSnippet: {
            filename: 'app/actions.ts',
            language: 'typescript',
            description: 'Kerangka Server Action dengan pipeline keamanan berlapis',
            code: `"use server";

import { getCurrentUser } from "@/lib/dal";
import { ItemSchema, ActionState } from "@/lib/schemas";

export async function createItemAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  // 1. CEK LOGIN (Wajib via DAL)
  const user = await getCurrentUser(); // Otomatis redirect ke /login jika tidak ada sesi

  // 2. CEK ROLE (Kalau fitur memiliki batasan role tertentu)
  // if (user.role !== 'admin') { ... }

  // 3. VALIDASI INPUT (Zod safeParse)
  // ... (dikerjakan pada Langkah 7)

  // 4. PROSES MUTASI DATA
  // ... (dikerjakan pada Langkah 11)

  return { success: true };
}`,
          },
          verification: {
            action: 'Pastikan file memiliki "use server" di baris pertama',
            expectedResult: 'Next.js mengenali fungsi sebagai Server Action yang berjalan di server.',
          },
        },
      ],
    },

    // -------------------------------------------------------------
    // TASK 7: Tambahkan validasi Zod di action (BE)
    // -------------------------------------------------------------
    {
      taskNumber: 7,
      title: 'Langkah 7: Tambahkan Validasi Zod di Action (BE)',
      description:
        'Di dalam action, jalankan safeParse dengan schema dari Langkah 5. Kalau gagal, kembalikan daftar error per field (return { errors }), jangan throw. Validasi server wajib karena validasi klien bisa dilewati.',
      steps: [
        {
          stepNumber: 1,
          title: 'Gunakan safeParse & Kembalikan Objek Errors',
          description:
            'Jalankan safeParse pada data mentah form. Jika tidak valid, kembalikan error terstruktur per field dengan flatten().fieldErrors. Jangan throw error agar UI tidak crash:',
          instructions: [
            'Ekstrak nilai field dari FormData: Object.fromEntries(formData.entries()) atau per-field get().',
            'Panggil ItemSchema.safeParse(rawData).',
            'Jika !validation.success, kembalikan { errors: validation.error.flatten().fieldErrors }.',
          ],
          codeSnippet: {
            filename: 'app/actions.ts',
            language: 'typescript',
            description: 'Penerapan safeParse dan pengembalian field errors',
            code: `"use server";

import { getCurrentUser } from "@/lib/dal";
import { ItemSchema, ActionState } from "@/lib/schemas";

export async function createItemAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  // 1. Cek Login
  const user = await getCurrentUser();

  // 2. Ekstrak data mentah dari FormData
  const rawData = {
    nama: formData.get("nama"),
    kategori: formData.get("kategori"),
    jumlah: formData.get("jumlah"),
    keterangan: formData.get("keterangan"),
  };

  // 3. Validasi dengan safeParse (Zod)
  const validation = ItemSchema.safeParse(rawData);

  if (!validation.success) {
    // Kembalikan daftar error per field, JANGAN THROW!
    return {
      success: false,
      message: "Validasi gagal. Silakan periksa kembali isian form Anda.",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  // validation.data sekarang bertipe aman ItemInput
  console.log("Data tervalidasi:", validation.data);

  return { success: true };
}`,
          },
          verification: {
            action: 'Panggil action dengan data kosong',
            expectedResult:
              'Action mengembalikan objek { success: false, errors: { nama: [...], jumlah: [...] } }.',
          },
        },
      ],
    },

    // -------------------------------------------------------------
    // TASK 8: Buat form input (FE)
    // -------------------------------------------------------------
    {
      taskNumber: 8,
      title: 'Langkah 8: Buat Form Input (FE)',
      description:
        'Buat komponen form berisi field sesuai schema dan tombol simpan. Kalau memakai hook React, komponennya menjadi Client Component ("use client").',
      steps: [
        {
          stepNumber: 1,
          title: 'Buat Komponen Form di components/ItemForm.tsx',
          description:
            'Buat komponen form input. Beri atribut name pada setiap input yang nilainya persis sama dengan nama field di Zod schema:',
          instructions: [
            'Gunakan direktif "use client" di baris pertama.',
            'Sertakan input untuk nama, select untuk kategori, input untuk jumlah, dan tombol simpan.',
          ],
          codeSnippet: {
            filename: 'components/ItemForm.tsx',
            language: 'tsx',
            description: 'Komponen Form Client dengan atribut name standar',
            code: `"use client";

export function ItemForm() {
  return (
    <form className="max-w-lg p-6 bg-zinc-900 border border-zinc-800 rounded-xl space-y-4">
      <h2 className="text-lg font-bold text-white">Tambah Data Baru</h2>

      {/* Field: Nama */}
      <div>
        <label htmlFor="nama" className="block text-xs font-medium text-zinc-300 mb-1">
          Nama Item <span className="text-red-400">*</span>
        </label>
        <input
          id="nama"
          name="nama"
          type="text"
          placeholder="Masukkan nama item..."
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-sm text-white focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Field: Kategori */}
      <div>
        <label htmlFor="kategori" className="block text-xs font-medium text-zinc-300 mb-1">
          Kategori <span className="text-red-400">*</span>
        </label>
        <select
          id="kategori"
          name="kategori"
          defaultValue=""
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-sm text-white focus:outline-none focus:border-blue-500"
        >
          <option value="" disabled>Pilih kategori...</option>
          <option value="elektronik">Elektronik</option>
          <option value="dokumen">Dokumen</option>
          <option value="peralatan">Peralatan</option>
        </select>
      </div>

      {/* Field: Jumlah */}
      <div>
        <label htmlFor="jumlah" className="block text-xs font-medium text-zinc-300 mb-1">
          Jumlah <span className="text-red-400">*</span>
        </label>
        <input
          id="jumlah"
          name="jumlah"
          type="number"
          min="1"
          defaultValue="1"
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-sm text-white focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Tombol Simpan */}
      <button
        type="submit"
        className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm font-semibold transition-colors"
      >
        Simpan Data
      </button>
    </form>
  );
}`,
          },
          verification: {
            action: 'Render <ItemForm /> di halaman dashboard',
            expectedResult: 'Form tampil sempurna tanpa error di console browser.',
          },
        },
      ],
    },

    // -------------------------------------------------------------
    // TASK 9: Hubungkan form dengan action (FE ↔ BE)
    // -------------------------------------------------------------
    {
      taskNumber: 9,
      title: 'Langkah 9: Hubungkan Form dengan Action (FE ↔ BE)',
      description:
        'Pasang action ke form lewat useActionState. Hook ini memberi tiga hal: state (hasil dari server), formAction (dipasang ke <form action>), dan isPending (untuk menonaktifkan tombol saat loading).',
      steps: [
        {
          stepNumber: 1,
          title: 'Integrasikan useActionState pada Komponen Form',
          description:
            'Hubungkan Server Action createItemAction ke komponen form menggunakan hook useActionState dari React 19 / Next.js 15:',
          instructions: [
            'Import useActionState dari "react".',
            'Inisialisasi: const [state, formAction, isPending] = useActionState(createItemAction, initialState).',
            'Pasang formAction ke atribut action pada tag <form action={formAction}>.',
            'Gunakan isPending untuk menonaktifkan tombol (disabled={isPending}) dan menampilkan teks loading.',
          ],
          codeSnippet: {
            filename: 'components/ItemForm.tsx',
            language: 'tsx',
            description: 'Pemasangan useActionState pada form action dan handling isPending',
            code: `"use client";

import { useActionState } from "react";
import { createItemAction } from "@/app/actions";
import { ActionState } from "@/lib/schemas";

const initialState: ActionState = {};

export function ItemForm() {
  // useActionState menghasilkan 3 variabel utama:
  // 1. state: respon hasil return dari server action (success, errors, message)
  // 2. formAction: fungsi handler yang dipasang ke <form action={...}>
  // 3. isPending: boolean status true ketika server sedang memproses request
  const [state, formAction, isPending] = useActionState(createItemAction, initialState);

  return (
    <form action={formAction} className="max-w-lg p-6 bg-zinc-900 border border-zinc-800 rounded-xl space-y-4">
      <h2 className="text-lg font-bold text-white">Tambah Data Baru</h2>

      {/* Input nama */}
      <div>
        <label htmlFor="nama" className="block text-xs font-medium text-zinc-300 mb-1">Nama Item</label>
        <input id="nama" name="nama" type="text" className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-sm text-white" />
      </div>

      {/* Input kategori */}
      <div>
        <label htmlFor="kategori" className="block text-xs font-medium text-zinc-300 mb-1">Kategori</label>
        <select id="kategori" name="kategori" defaultValue="" className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-sm text-white">
          <option value="" disabled>Pilih kategori...</option>
          <option value="elektronik">Elektronik</option>
        </select>
      </div>

      {/* Input jumlah */}
      <div>
        <label htmlFor="jumlah" className="block text-xs font-medium text-zinc-300 mb-1">Jumlah</label>
        <input id="jumlah" name="jumlah" type="number" defaultValue="1" className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-sm text-white" />
      </div>

      {/* Tombol Simpan dengan status isPending */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? "Sedang Menyimpan..." : "Simpan Data"}
      </button>
    </form>
  );
}`,
          },
          verification: {
            action: 'Klik tombol Simpan Data',
            expectedResult:
              'Tombol berubah menjadi "Sedang Menyimpan..." dan disabled selama request berlangsung.',
          },
        },
      ],
    },

    // -------------------------------------------------------------
    // TASK 10: Tampilkan error validasi (FE)
    // -------------------------------------------------------------
    {
      taskNumber: 10,
      title: 'Langkah 10: Tampilkan Error Validasi (FE)',
      description: 'Tampilkan state.errors di bawah field yang bersangkutan.',
      steps: [
        {
          stepNumber: 1,
          title: 'Render Pesan Error Spesifik di Bawah Masing-Masing Field',
          description:
            'Baca state.errors?.[namaField] dan render teks error berwarna merah tepat di bawah kolom input bersangkutan:',
          instructions: [
            'Gunakan ekspresi kondisional: state?.errors?.nama && <p className="text-red-400 text-xs mt-1">{state.errors.nama[0]}</p>.',
            'Tambahkan outline/border merah jika field bersangkutan memiliki error.',
            'Tampilkan pesan banner umum jika state.message ada.',
          ],
          codeSnippet: {
            filename: 'components/ItemForm.tsx',
            language: 'tsx',
            description: 'Tampilan error validasi per-field yang terhubung dengan state.errors',
            code: `"use client";

import { useActionState } from "react";
import { createItemAction } from "@/app/actions";
import { ActionState } from "@/lib/schemas";

const initialState: ActionState = {};

export function ItemForm() {
  const [state, formAction, isPending] = useActionState(createItemAction, initialState);

  return (
    <form action={formAction} className="max-w-lg p-6 bg-zinc-900 border border-zinc-800 rounded-xl space-y-4">
      <h2 className="text-lg font-bold text-white">Tambah Data Baru</h2>

      {/* Pesan Kesalahan / Sukses Umum */}
      {state.message && (
        <div className={\`p-3 rounded text-xs \${state.success ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300' : 'bg-red-950/60 border border-red-800 text-red-300'}\`}>
          {state.message}
        </div>
      )}

      {/* Field: Nama */}
      <div>
        <label htmlFor="nama" className="block text-xs font-medium text-zinc-300 mb-1">Nama Item</label>
        <input
          id="nama"
          name="nama"
          type="text"
          className={\`w-full px-3 py-2 bg-zinc-800 rounded text-sm text-white focus:outline-none \${
            state.errors?.nama ? 'border border-red-500 focus:border-red-500' : 'border border-zinc-700 focus:border-blue-500'
          }\`}
        />
        {/* Tampilkan pesan error nama */}
        {state.errors?.nama && (
          <p className="text-red-400 text-xs mt-1">{state.errors.nama[0]}</p>
        )}
      </div>

      {/* Field: Kategori */}
      <div>
        <label htmlFor="kategori" className="block text-xs font-medium text-zinc-300 mb-1">Kategori</label>
        <select
          id="kategori"
          name="kategori"
          defaultValue=""
          className={\`w-full px-3 py-2 bg-zinc-800 rounded text-sm text-white focus:outline-none \${
            state.errors?.kategori ? 'border border-red-500' : 'border border-zinc-700'
          }\`}
        >
          <option value="" disabled>Pilih kategori...</option>
          <option value="elektronik">Elektronik</option>
          <option value="dokumen">Dokumen</option>
        </select>
        {state.errors?.kategori && (
          <p className="text-red-400 text-xs mt-1">{state.errors.kategori[0]}</p>
        )}
      </div>

      {/* Field: Jumlah */}
      <div>
        <label htmlFor="jumlah" className="block text-xs font-medium text-zinc-300 mb-1">Jumlah</label>
        <input
          id="jumlah"
          name="jumlah"
          type="number"
          className={\`w-full px-3 py-2 bg-zinc-800 rounded text-sm text-white focus:outline-none \${
            state.errors?.jumlah ? 'border border-red-500' : 'border border-zinc-700'
          }\`}
        />
        {state.errors?.jumlah && (
          <p className="text-red-400 text-xs mt-1">{state.errors.jumlah[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm font-semibold disabled:opacity-50 transition-colors"
      >
        {isPending ? "Sedang Menyimpan..." : "Simpan Data"}
      </button>
    </form>
  );
}`,
          },
          verification: {
            action: 'Submit form tanpa mengisi input nama',
            expectedResult:
              'Muncul pesan "Nama minimal harus 3 karakter" tepat di bawah input nama.',
          },
        },
      ],
    },

    // -------------------------------------------------------------
    // TASK 11: Implementasikan mutation (simpan data) (BE)
    // -------------------------------------------------------------
    {
      taskNumber: 11,
      title: 'Langkah 11: Implementasikan Mutation (Simpan Data) (BE)',
      description:
        'Kalau validasi lolos, simpan ke database lewat fungsi di DAL dan sertakan userId dari getCurrentUser(). Jangan ambil userId dari form.',
      steps: [
        {
          stepNumber: 1,
          title: 'Tulis Fungsi Mutasi di DAL dengan userId Sesi',
          description:
            'Buat fungsi mutasi di DAL (misal createItem) yang menerima data valid dan userId. Jangan pernah menerima userId dari input form klien yang bisa dimanipulasi!',
          instructions: [
            'Buka lib/dal.ts, tambahkan fungsi createItem().',
            'Panggil createItem di app/actions.ts dengan menyertakan user.id dari getCurrentUser().',
          ],
          codeSnippet: {
            filename: 'lib/dal.ts',
            language: 'typescript',
            description: 'Fungsi mutasi database dengan parameter userId dari sesi',
            code: `// Di dalam lib/dal.ts
import { ItemInput } from "@/lib/schemas";
// import { db } from "@/lib/db"; // instance Prisma / Drizzle / MySQL

export async function createItem(data: ItemInput, userId: string) {
  // Simpan data dengan mengikat kepemilikan ke userId sesi login
  // Contoh dengan ORM (misal Prisma):
  /*
  return await db.item.create({
    data: {
      nama: data.nama,
      kategori: data.kategori,
      jumlah: data.jumlah,
      keterangan: data.keterangan || null,
      userId: userId, // DARI SESI SERVER, BUKAN FORM KLIEN!
    },
  });
  */

  console.log(\`[DB MUTATION] Menyimpan item "\${data.nama}" untuk userId: \${userId}\`);
  return { id: "item-generated-id", ...data, userId };
}`,
          },
        },
        {
          stepNumber: 2,
          title: 'Hubungkan Mutasi ke Server Action',
          description:
            'Di app/actions.ts, panggil createItem setelah safeParse berhasil lolos:',
          instructions: [
            'Gunakan user.id yang didapat dari getCurrentUser().',
          ],
          codeSnippet: {
            filename: 'app/actions.ts',
            language: 'typescript',
            description: 'Panggilan mutasi DAL di Server Action',
            code: `  // Setelah if (!validation.success) di app/actions.ts:
  try {
    // Panggil fungsi DAL dengan userId terverifikasi dari sesi server
    await createItem(validation.data, user.id);

    return {
      success: true,
      message: "Data item berhasil disimpan!",
    };
  } catch (error) {
    console.error("Gagal menyimpan ke database:", error);
    return {
      success: false,
      message: "Terjadi kesalahan server saat menyimpan data.",
    };
  }`,
          },
          verification: {
            action: 'Submit data valid di browser',
            expectedResult:
              'Data tersimpan di tabel database dengan kolom userId terisi ID user yang sedang login.',
          },
        },
      ],
    },

    // -------------------------------------------------------------
    // TASK 12: Tambahkan revalidasi (BE)
    // -------------------------------------------------------------
    {
      taskNumber: 12,
      title: 'Langkah 12: Tambahkan Revalidasi (BE)',
      description:
        'Panggil revalidatePath("/halaman-daftar") setelah data berubah supaya daftar menampilkan data terbaru. Kalau lupa, user akan melihat data basi.',
      steps: [
        {
          stepNumber: 1,
          title: 'Panggil revalidatePath di Server Action',
          description:
            'Import revalidatePath dari "next/cache" dan panggil setelah mutasi berhasil agar cache halaman daftar diperbarui secara instan:',
          instructions: [
            'Panggil revalidatePath("/dashboard/items") tepat setelah baris query mutasi database berhasil.',
            'Jika ingin langsung mengarahkan user kembali ke halaman tabel, tambahkan redirect("/dashboard/items").',
          ],
          codeSnippet: {
            filename: 'app/actions.ts',
            language: 'typescript',
            description: 'Revalidasi cache rute dengan revalidatePath',
            code: `"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { ItemSchema, ActionState } from "@/lib/schemas";
import { createItem } from "@/lib/dal";

export async function createItemAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await getCurrentUser();

  const rawData = {
    nama: formData.get("nama"),
    kategori: formData.get("kategori"),
    jumlah: formData.get("jumlah"),
    keterangan: formData.get("keterangan"),
  };

  const validation = ItemSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
    };
  }

  // 1. Eksekusi mutasi
  await createItem(validation.data, user.id);

  // 2. REVALIDASI CACHE: Bersihkan cache halaman daftar agar data baru langsung muncul
  revalidatePath("/dashboard/items");

  // 3. Opsional: redirect ke halaman daftar
  // redirect("/dashboard/items");

  return {
    success: true,
    message: "Data item berhasil disimpan dan cache telah diperbarui!",
  };
}`,
          },
          verification: {
            action: 'Simpan item baru lalu buka halaman daftar',
            expectedResult:
              'Item baru langsung muncul di tabel tanpa perlu menekan tombol refresh browser (F5).',
          },
        },
      ],
    },

    // -------------------------------------------------------------
    // TASK 13: Uji fitur (FE + BE)
    // -------------------------------------------------------------
    {
      taskNumber: 13,
      title: 'Langkah 13: Uji Fitur (FE + BE) - 5 Checkpoint',
      description:
        'Cek lima hal ini:\n1. Data tidak valid memunculkan error di field yang benar.\n2. Server menolak data tidak valid walau validasi klien dilewati (coba dengan curl).\n3. User yang belum login ditolak action dan diarahkan ke /login.\n4. Dengan dua akun, user A tidak bisa melihat atau mengubah data user B.\n5. Di DevTools, cookie sesi punya flag HttpOnly, Secure, dan SameSite.',
      steps: [
        {
          stepNumber: 1,
          title: '5 Checkpoint Pengujian Kualitas & Keamanan',
          description:
            'Lakukan verifikasi menyeluruh terhadap 5 skenario penting sebelum menganggap fitur selesai:',
          instructions: [
            'Checkpoint 1 (Validasi UI): Kirim form kosong, pastikan pesan error Zod muncul di bawah kolom yang tepat.',
            'Checkpoint 2 (Uji Server Bypass): Coba kirim request POST via terminal (curl) dengan payload tidak valid. Buktikan server menolaknya!',
            'Checkpoint 3 (Proteksi Unauthenticated): Akses action tanpa cookie login, pastikan ditolak dan dialihkan ke /login.',
            'Checkpoint 4 (Isolasi Multi-Tenant / Anti-IDOR): Login Akun A di Chrome, Login Akun B di Edge/Firefox. Pastikan Akun A tidak bisa melihat/mengedit data Akun B.',
            'Checkpoint 5 (Keamanan Cookie): Buka Chrome DevTools -> Application -> Cookies. Periksa centang HttpOnly, Secure, dan SameSite.',
          ],
          codeSnippet: {
            filename: 'terminal',
            language: 'bash',
            description: 'Uji bypass validasi klien menggunakan curl langsung ke Server Action / API',
            code: `# Uji Checkpoint 2: Kirim data kosong langsung ke endpoint server
curl -X POST http://localhost:3000/api/items \\
  -H "Content-Type: application/json" \\
  -d '{"nama": "", "jumlah": -5}'

# Respons yang diharapkan dari server:
# {"success": false, "errors": {"nama": ["Nama minimal harus 3 karakter"], "jumlah": ["Jumlah minimal adalah 1"]}}`,
          },
          verification: {
            action: 'Jalankan kelima skenario pengujian',
            expectedResult:
              'Kelima checkpoint lulus 100%: validasi ketat, bypass ditolak, unauthenticated dicegah, isolasi data aman, dan cookie terproteksi.',
          },
        },
      ],
    },

    // -------------------------------------------------------------
    // TASK 14: Implementasikan Update dan Delete jika tersedia (BE + sedikit FE)
    // -------------------------------------------------------------
    {
      taskNumber: 14,
      title: 'Langkah 14: Implementasikan Update & Delete Berpagar IDOR',
      description:
        'Pola sama dengan tambah data. Kirim ID lewat action.bind(null, id), tapi jangan percaya ID dari klien. Query harus selalu dibatasi ke pemilik (where: { id, userId }), supaya orang tidak bisa mengakses data orang lain hanya dengan mengganti angka di URL (IDOR). Kalau datanya tidak ketemu, kembalikan 404.',
      steps: [
        {
          stepNumber: 1,
          title: 'Buat Server Action Delete & Update Berpagar IDOR',
          description:
            'Buat deleteItemAction dan updateItemAction di app/actions.ts. Query wajib menyertakan where: { id, userId: currentUser.id }:',
          instructions: [
            'Gunakan getCurrentUser() untuk mengambil user yang sedang login.',
            'Query penghapusan atau pembaruan database WAJIB menyertakan userId pemilik.',
            'Jika data tidak ditemukan dengan kombinasi id dan userId tersebut, kembalikan error 404/Not Found atau penolakan akses.',
          ],
          codeSnippet: {
            filename: 'app/actions.ts',
            language: 'typescript',
            description: 'Server Action Hapus & Update dengan proteksi Insecure Direct Object Reference (IDOR)',
            code: `"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/dal";
// import { db } from "@/lib/db";

export async function deleteItemAction(itemId: string) {
  // 1. Ambil user dari sesi server
  const user = await getCurrentUser();

  // 2. MUTASI HAPUS BERPAGAR IDOR:
  // JANGAN HANYA: where: { id: itemId } -> RENTAN IDOR!
  // WAJIB: where: { id: itemId, userId: user.id }
  /*
  const deleted = await db.item.deleteMany({
    where: {
      id: itemId,
      userId: user.id, // HANYA BISA HAPUS JIKA ITEM DIMILIKI OLEH USER INI!
    },
  });

  if (deleted.count === 0) {
    return { success: false, message: "Item tidak ditemukan atau Anda tidak berhak menghapusnya." };
  }
  */

  console.log(\`[DELETE IDOR-SAFE] Item \${itemId} dihapus oleh pemilik \${user.id}\`);

  revalidatePath("/dashboard/items");
  return { success: true };
}`,
          },
        },
        {
          stepNumber: 2,
          title: 'Hubungkan Tombol Hapus Menggunakan action.bind()',
          description:
            'Kirim ID item ke Server Action menggunakan action.bind(null, item.id) pada tombol hapus:',
          instructions: [
            'Pada komponen tabel/daftar, pasang <form action={deleteItemAction.bind(null, item.id)}>.'
          ],
          codeSnippet: {
            filename: 'components/DeleteItemButton.tsx',
            language: 'tsx',
            description: 'Tombol hapus dengan Server Action bind',
            code: `"use client";

import { deleteItemAction } from "@/app/actions";

export function DeleteItemButton({ itemId }: { itemId: string }) {
  // Mengirim ID melalui action.bind(null, id)
  const deleteWithId = deleteItemAction.bind(null, itemId);

  return (
    <form action={deleteWithId}>
      <button
        type="submit"
        onClick={(e) => {
          if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) {
            e.preventDefault();
          }
        }}
        className="px-2.5 py-1 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/40 border border-red-900/60 rounded transition-colors"
      >
        Hapus
      </button>
    </form>
  );
}`,
          },
          verification: {
            action: 'Klik tombol Hapus pada data milik sendiri vs manipulasi ID milik user lain',
            expectedResult:
              'Item sendiri terhapus; percobaan manipulasi ID orang lain ditolak oleh filter query server.',
          },
        },
      ],
    },

    // -------------------------------------------------------------
    // TASK 15: Batasi aksi khusus admin (BE, kalau perlu)
    // -------------------------------------------------------------
    {
      taskNumber: 15,
      title: 'Langkah 15: Batasi Aksi Khusus Admin (BE, Kalau Perlu)',
      description:
        'Tambahkan cek user.role di dalam action itu sendiri. Kalau bukan admin, kembalikan error FORBIDDEN.',
      steps: [
        {
          stepNumber: 1,
          title: 'Pengecekan Role Administrator di Server Action',
          description:
            'Untuk aksi administratif (seperti mengubah status verifikasi, reset akun, hapus massal), lakukan pengecekan user.role === "admin" langsung di dalam Server Action:',
          instructions: [
            'Ambil user dari getCurrentUser().',
            'Periksa apakah user.role === "admin".',
            'Jika bukan admin, segera hentikan eksekusi dan kembalikan { success: false, message: "FORBIDDEN: Tindakan ini hanya boleh dilakukan oleh Administrator." }.',
          ],
          codeSnippet: {
            filename: 'app/admin-actions.ts',
            language: 'typescript',
            description: 'Proteksi Role Administrator (RBAC) di Server Action',
            code: `"use server";

import { getCurrentUser } from "@/lib/dal";
import { revalidatePath } from "next/cache";

export async function approveItemAdminAction(itemId: string) {
  // 1. Cek sesi login
  const user = await getCurrentUser();

  // 2. CEK ROLE KHUSUS ADMIN (WAJIB DI SERVER ACTION)
  if (user.role !== "admin") {
    return {
      success: false,
      error: "FORBIDDEN",
      message: "Akses ditolak: Anda tidak memiliki wewenang Administrator.",
    };
  }

  // 3. Eksekusi aksi administratif (misal verifikasi status)
  console.log(\`[ADMIN APPROVED] Item \${itemId} disetujui oleh admin \${user.email}\`);

  revalidatePath("/admin/items");
  return { success: true, message: "Item berhasil disetujui." };
}`,
          },
          verification: {
            action: 'Coba panggil action admin menggunakan akun biasa (role: user)',
            expectedResult: 'Server menolak request dengan pesan FORBIDDEN.',
          },
        },
      ],
    },

    // -------------------------------------------------------------
    // TASK 16: Pengembangan Optimistic UI (FE, opsional)
    // -------------------------------------------------------------
    {
      taskNumber: 16,
      title: 'Langkah 16: Pengembangan Optimistic UI (FE, Opsional)',
      description:
        'Pakai useOptimistic supaya item langsung muncul di daftar sebelum server selesai. Kalau server gagal, item sementara hilang sendiri. Pakai hanya untuk aksi ringan seperti catatan, like, atau centang to-do, bukan pembayaran.',
      steps: [
        {
          stepNumber: 1,
          title: 'Implementasi useOptimistic untuk Respon Instan',
          description:
            'Gunakan hook useOptimistic pada interaksi ringan (seperti toggle status, centang to-do, atau hapus item) agar perubahan langsung terlihat di layar tanpa menunggu latency server:',
          instructions: [
            'Import useOptimistic dari "react".',
            'Definisikan state optimistik: const [optimisticItems, setOptimisticItems] = useOptimistic(items, reducer).',
            'Panggil setOptimisticItems() sebelum request server dieksekusi.',
            'Jika server gagal, React akan otomatis me-rollback tampilan ke state semula.',
            'INGAT: Hanya gunakan untuk aksi ringan (catatan, like, to-do), JANGAN gunakan untuk transaksi finansial/pembayaran!',
          ],
          codeSnippet: {
            filename: 'components/OptimisticItemList.tsx',
            language: 'tsx',
            description: 'Daftar interaktif dengan hook useOptimistic',
            code: `"use client";

import { useOptimistic } from "react";
import { deleteItemAction } from "@/app/actions";

type Item = {
  id: string;
  nama: string;
  kategori: string;
  jumlah: number;
};

export function OptimisticItemList({ initialItems }: { initialItems: Item[] }) {
  // State optimistik: asumsikan aksi selalu langsung berhasil di layar
  const [optimisticItems, setOptimisticItems] = useOptimistic(
    initialItems,
    (currentItems, deletedId: string) =>
      currentItems.filter((item) => item.id !== deletedId)
  );

  const handleDelete = async (id: string) => {
    // 1. Tampilan langsung berubah seketika (optimistik)
    setOptimisticItems(id);

    // 2. Jalankan Server Action di latar belakang
    const result = await deleteItemAction(id);

    // Jika server gagal, React otomatis me-revert daftar ke kondisi asli
    if (!result.success) {
      alert("Gagal menghapus item dari server!");
    }
  };

  return (
    <div className="space-y-2">
      {optimisticItems.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between p-3 bg-zinc-900 border border-zinc-800 rounded-lg"
        >
          <div>
            <p className="text-sm font-medium text-white">{item.nama}</p>
            <p className="text-xs text-zinc-400">
              Kategori: {item.kategori} · Jumlah: {item.jumlah}
            </p>
          </div>

          <button
            onClick={() => handleDelete(item.id)}
            className="px-2.5 py-1 text-xs text-red-400 hover:bg-red-950/40 rounded transition-colors"
          >
            Hapus Cepat
          </button>
        </div>
      ))}
    </div>
  );
}`,
          },
          verification: {
            action: 'Klik tombol Hapus Cepat',
            expectedResult:
              'Item langsung lenyap seketika dari layar tanpa loading spinner.',
          },
        },
      ],
    },
  ],
  // Backward compatibility
  steps: [
    { title: 'Langkah 1: Tentukan fitur dan aturan aksesnya (perencanaan)', description: 'Tulis fitur yang dibuat, data disimpan, dan hak akses/role' },
    { title: 'Langkah 2: Pasang sistem login (BE)', description: 'Better Auth / Auth.js v5, adapter DB, email login, auto hash' },
    { title: 'Langkah 3: Buat halaman login/daftar (FE)', description: 'Form login memanggil fungsi signIn dari library auth' },
    { title: 'Langkah 4: Buat DAL dan pagar proxy (BE)', description: 'lib/dal.ts getCurrentUser() auto-redirect & proxy/middleware' },
    { title: 'Langkah 5: Buat Schema Validasi (dipakai bersama)', description: 'lib/schemas.ts dengan z.coerce.number() untuk FormData' },
    { title: 'Langkah 6: Buat file Server Action (BE)', description: 'actions.ts urutan: cek login -> cek role -> validasi -> mutasi' },
    { title: 'Langkah 7: Tambahkan validasi Zod di action (BE)', description: 'safeParse, kembalikan return { errors }, jangan throw' },
    { title: 'Langkah 8: Buat form input (FE)', description: 'Komponen Client Component ("use client") dengan field sesuai skema' },
    { title: 'Langkah 9: Hubungkan form dengan action (FE ↔ BE)', description: 'useActionState (state, formAction, isPending)' },
    { title: 'Langkah 10: Tampilkan error validasi (FE)', description: 'Render state.errors di bawah masing-masing field bersangkutan' },
    { title: 'Langkah 11: Implementasikan mutation (simpan data) (BE)', description: 'Simpan data via DAL dengan userId dari getCurrentUser()' },
    { title: 'Langkah 12: Tambahkan revalidasi (BE)', description: 'revalidatePath("/halaman-daftar") agar data terbaru tampil' },
    { title: 'Langkah 13: Uji fitur (FE + BE)', description: '5 checkpoint: error field, curl bypass ditolak, unauthenticated, anti-IDOR, cookies' },
    { title: 'Langkah 14: Implementasikan Update dan Delete (BE + sedikit FE)', description: 'action.bind(null, id), query berpagar where: { id, userId } anti IDOR' },
    { title: 'Langkah 15: Batasi aksi khusus admin (BE, kalau perlu)', description: 'Validasi user.role === "admin" di action, tolak FORBIDDEN jika bukan admin' },
    { title: 'Langkah 16: Pengembangan Optimistic UI (FE, opsional)', description: 'useOptimistic untuk aksi ringan agar item berubah seketika di layar' },
  ],
  fileTree: [
    { path: 'lib/dal.ts', type: 'file', status: 'added', description: 'Data Access Layer (getCurrentUser, verifySession)' },
    { path: 'lib/schemas.ts', type: 'file', status: 'added', description: 'Schema Validasi Zod Shared (z.coerce.number)' },
    { path: 'lib/auth.ts', type: 'file', status: 'added', description: 'Konfigurasi Backend Auth (Better Auth / Auth.js)' },
    { path: 'lib/auth-client.ts', type: 'file', status: 'added', description: 'Client Auth Helper (signIn, signUp, signOut)' },
    { path: 'middleware.ts', type: 'file', status: 'added', description: 'Pagar Proxy Kasar (Redirect unauthenticated)' },
    { path: 'app/actions.ts', type: 'file', status: 'added', description: 'Server Actions Berpagar Sesi & Zod safeParse' },
    { path: 'app/(auth)/login/page.tsx', type: 'file', status: 'added', description: 'Halaman Form Login (Client Component)' },
    { path: 'components/ItemForm.tsx', type: 'file', status: 'added', description: 'Form Input (useActionState, field errors)' },
    { path: 'components/OptimisticItemList.tsx', type: 'file', status: 'added', description: 'Daftar Interaktif dengan useOptimistic' },
  ],
  codeSnippets: [],
  acceptanceCriteria: [
    {
      id: 'ac-1',
      text: 'Perencanaan fitur, relasi data kepemilikan (userId), dan matriks hak akses peran (RBAC) terdokumentasi jelas.',
    },
    {
      id: 'ac-2',
      text: 'Sistem login (Better Auth atau Auth.js v5) terhubung ke database dengan fitur login email, dan password otomatis di-hash aman oleh library.',
    },
    {
      id: 'ac-3',
      text: 'Halaman login/daftar di Frontend berhasil memanggil fungsi login library autentikasi.',
    },
    {
      id: 'ac-4',
      text: 'DAL (lib/dal.ts) menyediakan getCurrentUser() yang mengecek sesi dan mengalihkan ke /login jika tidak valid, didukung pagar proxy di middleware.',
    },
    {
      id: 'ac-5',
      text: 'File lib/schemas.ts mendefinisikan aturan tiap field dengan Zod dan menggunakan z.coerce.number() untuk kolom angka.',
    },
    {
      id: 'ac-6',
      text: 'File Server Action memiliki direktif "use server" dengan urutan eksekusi aman: cek login -> cek role -> validasi input -> proses data.',
    },
    {
      id: 'ac-7',
      text: 'Server Action memvalidasi input dengan safeParse dan mengembalikan { errors } per field tanpa throw exception jika tidak valid.',
    },
    {
      id: 'ac-8',
      text: 'Komponen form input merupakan Client Component ("use client") dengan field sesuai schema dan tombol simpan.',
    },
    {
      id: 'ac-9',
      text: 'Form terhubung dengan Server Action menggunakan hook useActionState (state, formAction, isPending).',
    },
    {
      id: 'ac-10',
      text: 'Error validasi (state.errors) ditampilkan tepat di bawah masing-masing field yang bersangkutan.',
    },
    {
      id: 'ac-11',
      text: 'Mutasi simpan data ke database menyertakan userId yang bersumber dari getCurrentUser() DAL, bukan dari input form klien.',
    },
    {
      id: 'ac-12',
      text: 'Fungsi revalidatePath dipanggil di akhir mutasi Server Action agar tampilan daftar selalu menampilkan data terbaru.',
    },
    {
      id: 'ac-13',
      text: 'Lolos pengujian 5 checkpoint: error field muncul, server tolak curl bypass, unauthenticated diarahkan ke /login, isolasi data antar user terjaga, dan cookie sesi terproteksi HttpOnly/Secure/SameSite.',
    },
    {
      id: 'ac-14',
      text: 'Implementasi Update dan Delete menggunakan action.bind(null, id) dengan query berpagar kepemilikan (where: { id, userId }) guna mencegah celah IDOR.',
    },
    {
      id: 'ac-15',
      text: 'Aksi khusus administrator memverifikasi user.role di Server Action dan menolak user non-admin dengan pesan FORBIDDEN.',
    },
    {
      id: 'ac-16',
      text: 'Hook useOptimistic diterapkan pada aksi ringan untuk memberikan pengalaman antarmuka instan tanpa jeda loading server.',
    },
  ],
  gitStandard: {
    branchName: 'feat/fullstack-auth-actions-crud',
    commitExample:
      'feat(crud): implement fullstack form with auth dal, zod validation, and idor protection',
    prTitle: 'feat: add fullstack crud with auth dal, server actions, and optimistic ui',
  },
  pitfalls: [
    {
      symptom: 'Celah IDOR (Insecure Direct Object Reference) pada Edit / Hapus data',
      cause:
        'Hanya menggunakan where: { id } tanpa menyertakan { userId } di query database, sehingga user lain bisa menghapus/mengubah data orang lain hanya dengan mengganti ID.',
      solution:
        'Wajib batasi query mutasi ke pemilik sah: where: { id: targetId, userId: currentUser.id }.',
    },
    {
      symptom: 'UserId dipalsukan oleh penyerang melalui manipulasi DOM / DevTools',
      cause:
        'Mengambil userId dari hidden input form (<input type="hidden" name="userId">).',
      solution:
        'DILARANG keras mempercayai userId dari form! Ambil userId murni dari sesi server via getCurrentUser() di dalam DAL / Server Action.',
    },
    {
      symptom: 'Aplikasi crash atau layar putih saat validasi input gagal',
      cause:
        'Melempar uncaught error (throw new Error) di dalam Server Action saat validasi Zod gagal.',
      solution:
        'Gunakan safeParse dan kembalikan objek error: return { errors: validation.error.flatten().fieldErrors }.',
    },
    {
      symptom: 'Tampilan tabel daftar data tidak berubah setelah form disubmit',
      cause: 'Lupa memanggil revalidatePath() setelah mutasi database berhasil.',
      solution:
        'Panggil revalidatePath("/path-halaman-tabel") tepat setelah baris simpan database berhasil.',
    },
    {
      symptom: 'Validasi form di-bypass oleh pengguna menggunakan curl atau Postman',
      cause:
        'Hanya mengandalkan validasi di browser (HTML5 required / client check) tanpa validasi schema di Server Action.',
      solution:
        'Validasi server dengan Zod safeParse adalah pintu wajib yang tidak boleh dilewati dalam keadaan apapun.',
    },
    {
      symptom:
        'Password tersimpan dalam format teks biasa (plain text) atau crash saat hash manual',
      cause:
        'Mencoba membuat algoritma hashing password sendiri alih-alih menyerahkannya ke library autentikasi.',
      solution:
        'Gunakan library autentikasi modern (Better Auth / Auth.js) yang otomatis meng-hash password menggunakan Argon2id/Bcrypt berstandar industri.',
    },
  ],
  nextStep: {
    title: 'Manajemen File Upload & Cloud Storage',
    slug: '03-file-upload-cloud-storage',
    description:
      'Materi berikutnya: upload file (Express Multer), dual-mode storage service, anti-IDOR, dan antarmuka Next.js.',
  },
};
