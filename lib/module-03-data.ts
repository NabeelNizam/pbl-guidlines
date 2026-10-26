import { DocModule } from '@/types/docs';

export const MODULE_03: DocModule = {
  slug: '03-file-upload-cloud-storage',
  phaseId: 'fase-3',
  order: 3,
  title: 'Manajemen File Upload & Cloud Storage',
  subtitle:
    'Panduan lengkap integrasi upload file Express Multer & Next.js: validasi MIME type, batasan 5 MB, dual-mode storage service (Cloud & Local fallback), anti-IDOR, dan pencegahan orphaned files.',
  category: 'core-standard',
  layer: 'integration',
  estimatedMinutes: 45,
  tujuan:
    'Mengimplementasikan alur upload file end-to-end yang aman dan skalabel: mulai dari pemisahan konsep penyimpanan biner vs metadata relasional SQL, konfigurasi middleware Multer di Express, dual-mode storage service dengan proteksi rollback anti-file yatim, otorisasi penghapusan anti-IDOR, hingga antarmuka drag-and-drop Next.js dengan tracking progres upload riil dan modal pratinjau.',
  prasyarat: [
    'Node.js v18+',
    'Express.js & TypeScript (Backend)',
    'Next.js v15+ App Router (Frontend)',
    'Multer & @types/multer',
    'Database SQL (MySQL / PostgreSQL / SQLite)',
  ],
  tasks: [
    'Langkah 1: Pahami Perbedaan Database dan Cloud Storage',
    'Langkah 2: Siapkan Storage Service (Cloud Storage & Local Fallback)',
    'Langkah 3: Buat Middleware Validasi & Batasan Ukuran Multer',
    'Langkah 4: Simpan File dan Referensi ke Database dengan Proteksi Rollback',
    'Langkah 5: Sediakan Endpoint Tampilkan dan Hapus File (Cegah IDOR)',
    'Langkah 6: Buat Komponen Upload Berkas dengan Drag & Drop (FE)',
    'Langkah 7: Kirim File dan Tampilkan Progres dengan XMLHttpRequest (FE)',
    'Langkah 8: Tampilkan File & Modal Pratinjau (FE)',
    'Langkah 9: Implementasikan Fitur Hapus Berkas (FE & BE)',
    'Langkah 10: Uji Kasus Fungsional & Keamanan (6 Checkpoint)',
  ],
  adaptationTable: [
    {
      aspect: 'Format & Tipe File yang Diizinkan',
      universalExample: 'Gambar (JPEG, PNG, WEBP) & PDF (Maksimal 5 MB)',
      projectExampleA: 'PDF proposal skripsi & dokumen revisi (Sistem Akademik)',
      projectExampleB: 'Foto produk JPEG/PNG & dokumen faktur PDF (E-Commerce)',
    },
    {
      aspect: 'Media Penyimpanan Fisik (Storage Provider)',
      universalExample: 'Dual-Mode: Cloud Storage (Vercel Blob / S3) + Local Disk Fallback (uploads/)',
      projectExampleA: 'Local disk uploads/ untuk praktikum lab kampus offline',
      projectExampleB: 'AWS S3 / Supabase Storage / Cloudinary untuk environment production',
    },
    {
      aspect: 'Entitas Metadata di Database SQL',
      universalExample: 'documents (id, name, file_key, file_type, file_size, url, user_id)',
      projectExampleA: 'attachments (id, title, file_path, mime_type, byte_size, task_id, user_id)',
      projectExampleB: 'product_assets (id, product_id, file_key, public_url, is_primary)',
    },
    {
      aspect: 'Penanganan Progres Upload di Frontend',
      universalExample: 'XMLHttpRequest (xhr.upload.onprogress) untuk kalkulasi persentase nyata',
      projectExampleA: 'Axios onUploadProgress event handler di Client Component',
      projectExampleB: 'Fetch multipart stream sederhana tanpa indikator progress bar',
    },
    {
      aspect: 'Keamanan & Hak Akses (Anti-IDOR)',
      universalExample: 'Validasi kepemilikan dokumen: doc.userId === req.user.id || req.user.role === "admin"',
      projectExampleA: 'Mahasiswa hanya dapat melihat & menghapus dokumen miliknya sendiri',
      projectExampleB: 'Dosen pembimbing atau Administrator memiliki hak moderasi menghapus berkas apapun',
    },
  ],
  practicalTasks: [
    // -------------------------------------------------------------
    // TASK 1: Konsep File Upload
    // -------------------------------------------------------------
    {
      taskNumber: 1,
      title: 'Langkah 1: Pahami Perbedaan Database dan Cloud Storage',
      description:
        'Pahami pemisahan tanggung jawab arsitektural: file biner statis tidak boleh disimpan sebagai BLOB di database SQL. Database SQL hanya menyimpan referensi metadata terstruktur, sedangkan file fisik disimpan di Object/Cloud Storage atau direktori statis.',
      steps: [
        {
          stepNumber: 1,
          title: 'Konsep Pemisahan Biner & Relasional Metadata',
          description:
            'Mengapa file tidak disimpan langsung ke database SQL sebagai tipe data BLOB (Binary Large Object)?',
          instructions: [
            'File biner berukuran megabyte akan membuat ukuran backup database membengkak dan memperlambat latensi kueri secara drastis.',
            'Database SQL dioptimalkan untuk pengindeksan data relasional terstruktur (angka, string, foreign key, tanggal).',
            'File biner statis dialihkan ke Object Storage (Cloud Storage seperti S3, Vercel Blob, Cloudinary) atau folder file terisolasi (/uploads) pada server.',
            'Database hanya menyimpan rekaman referensi (metadata): nama file, URL akses, fileKey, MIME type, ukuran bytes, dan relasi pemilik (userId).',
          ],
          codeSnippet: {
            filename: 'architecture-concept.md',
            language: 'text',
            description: 'Perbandingan penyimpanan file fisik vs metadata database SQL',
            code: `[Browser Klien]
       │
       │ 1. Kirim FormData (File biner PDF / Gambar)
       ▼
[Express.js Backend]
       │
       ├─► 2. Simpan fisik file ke Object Storage (Cloud / Local uploads/)
       │      └─► Dapatkan fileKey & URL publik
       │
       └─► 3. Simpan METADATA ke Database SQL (Tabel documents):
              - id        : UUID / Auto Increment
              - name      : "laporan-akhir.pdf" (nama asli)
              - file_key  : "uploads/174000-a8f1-laporan-akhir.pdf"
              - file_type : "application/pdf"
              - file_size : 2415082 (bytes)
              - url       : "/uploads/174000-a8f1-laporan-akhir.pdf"
              - user_id   : "usr-123" (Foreign Key)`,
          },
          verification: {
            action: 'Diskusikan bersama tim peran kolom file_key dan url pada tabel documents',
            expectedResult:
              'Tim memahami bahwa file_key digunakan backend untuk operasi hapus storage, sedangkan url digunakan frontend untuk menampilkan file.',
          },
        },
        {
          stepNumber: 2,
          title: 'Definisi Skema Migrasi Tabel Dokumen SQL',
          description:
            'Buat berkas migrasi database untuk membuat tabel dokumen yang menampung metadata berkas.',
          instructions: [
            'Buat migrasi SQL baru di direktori migrasi backend (misal: be/src/db/migrations/005-create-documents.ts).',
            'Pastikan kolom user_id memiliki relasi Foreign Key ke tabel users (ON DELETE CASCADE).',
          ],
          codeSnippet: {
            filename: 'be/src/db/migrations/005-create-documents.ts',
            language: 'typescript',
            description: 'Migrasi database SQL untuk tabel dokumen',
            code: `import { pool } from '../index';

export async function up(): Promise<void> {
  const query = \`
    CREATE TABLE IF NOT EXISTS documents (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      file_key VARCHAR(500) NOT NULL UNIQUE,
      file_type VARCHAR(100) NOT NULL,
      file_size INT NOT NULL,
      url VARCHAR(1000) NOT NULL,
      user_id VARCHAR(36) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_documents_user_id (user_id),
      CONSTRAINT fk_documents_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  \`;
  await pool.query(query);
}

export async function down(): Promise<void> {
  await pool.query('DROP TABLE IF EXISTS documents;');
}`,
          },
          verification: {
            action: 'Jalankan runner migrasi backend di terminal',
            expectedResult: 'Tabel "documents" berhasil terbentuk di basis data SQL.',
          },
        },
      ],
    },

    // -------------------------------------------------------------
    // TASK 2: Storage Service (Cloud Storage & Local Fallback)
    // -------------------------------------------------------------
    {
      taskNumber: 2,
      title: 'Langkah 2: Siapkan Storage Service (Cloud Storage & Local Fallback)',
      description:
        'Siapkan media penyimpanan file yang fleksibel melalui pola Dual-Mode Storage Service: mendukung Cloud Storage jika token disetel, serta fallback otomatis ke penyimpanan lokal (/uploads) saat bekerja offline di lab.',
      steps: [
        {
          stepNumber: 1,
          title: 'Instalasi Pustaka Multer di Backend',
          description:
            'Multer adalah middleware penanganan multipart/form-data standar pada ekosistem Express.js.',
          instructions: [
            'Buka terminal di dalam folder backend (be/).',
            'Instal multer untuk runtime dan @types/multer untuk deklarasi tipe TypeScript.',
          ],
          codeSnippet: {
            filename: 'terminal',
            language: 'bash',
            description: 'Instalasi multer dan types di backend Express',
            code: `cd be
npm install multer
npm install -D @types/multer`,
          },
          verification: {
            action: 'Periksa file be/package.json',
            expectedResult: 'Tercantum "multer" pada dependencies dan "@types/multer" pada devDependencies.',
          },
        },
        {
          stepNumber: 2,
          title: 'Buat Service Penyimpanan File Terabstraksi',
          description:
            'Buat modul be/src/services/storage.service.ts yang mengisolasi proses upload dan delete file fisik.',
          instructions: [
            'Gunakan generator nama file acak (timestamp + hash hex) untuk mencegah tabrakan nama file yang sama.',
            'Sanitasi nama file asli untuk mencegah kerentanan directory traversal (path traversal).',
            'Sediakan fungsi uploadFile dan deleteFile yang seragam baik untuk mode cloud maupun lokal.',
          ],
          codeSnippet: {
            filename: 'be/src/services/storage.service.ts',
            language: 'typescript',
            description: 'Dual-mode storage service dengan sanitasi path dan fallback lokal',
            code: `import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface StorageUploadResult {
  name: string;
  fileKey: string;
  fileType: string;
  fileSize: number;
  url: string;
}

export class StorageService {
  private localUploadDir: string;
  private hasCloudToken: boolean;

  constructor() {
    this.localUploadDir = path.join(process.cwd(), 'uploads');
    // Cek apakah token cloud tersedia di .env (misal VERCEL_BLOB_TOKEN atau S3 credentials)
    this.hasCloudToken = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

    // Buat direktori lokal uploads jika belum ada
    if (!fs.existsSync(this.localUploadDir)) {
      fs.mkdirSync(this.localUploadDir, { recursive: true });
    }
  }

  public async uploadFile(
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string
  ): Promise<StorageUploadResult> {
    // Sanitasi nama file dan tambahkan string acak unik
    const sanitizedExt = path.extname(originalName).toLowerCase();
    const cleanBaseName = path
      .basename(originalName, sanitizedExt)
      .replace(/[^a-zA-Z0-9-_]/g, '_')
      .slice(0, 50);
    const uniqueHash = crypto.randomBytes(4).toString('hex');
    const safeFilename = \`\${Date.now()}-\${uniqueHash}-\${cleanBaseName}\${sanitizedExt}\`;

    // 1. Opsi Cloud Storage (jika token terpasang)
    if (this.hasCloudToken) {
      // Implementasi Cloud Provider SDK (contoh Vercel Blob / AWS S3 PutObject)
      // return { ... }
    }

    // 2. Opsi Fallback Penyimpanan Lokal (Default & Offline Lab Friendly)
    const targetFilePath = path.join(this.localUploadDir, safeFilename);
    await fs.promises.writeFile(targetFilePath, fileBuffer);

    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    return {
      name: originalName,
      fileKey: safeFilename,
      fileType: mimeType,
      fileSize: fileBuffer.length,
      url: \`\${backendUrl}/uploads/\${safeFilename}\`,
    };
  }

  public async deleteFile(fileKey: string): Promise<void> {
    if (this.hasCloudToken) {
      // Hapus dari cloud storage provider
      return;
    }

    // Mencegah path traversal dengan path.basename
    const safeKey = path.basename(fileKey);
    const filePath = path.join(this.localUploadDir, safeKey);

    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  }
}

export const storageService = new StorageService();`,
          },
          verification: {
            action: 'Pastikan file be/src/services/storage.service.ts tersimpan tanpa error kompilasi',
            expectedResult: 'Class StorageService siap diimpor oleh controller upload.',
          },
        },
        {
          stepNumber: 3,
          title: 'Konfigurasi Static File Serving & .gitignore',
          description:
            'Aktifkan penyedia file statis di Express agar URL /uploads/:filename dapat diakses publik, dan amankan berkas dari Git.',
          instructions: [
            'Buka be/src/app.ts, tambahkan express.static untuk rute /uploads.',
            'Tambahkan folder uploads/ ke file be/.gitignore agar file hasil pengujian mahasiswa tidak terdorong ke repositori Git.',
          ],
          codeSnippet: {
            filename: 'be/src/app.ts',
            language: 'typescript',
            description: 'Static serving untuk folder uploads di Express',
            code: `import express from 'express';
import path from 'path';

const app = express();

// Konfigurasi static file serving untuk folder uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Middleware json, cors, dsb...
export default app;`,
          },
          verification: {
            action: 'Periksa be/.gitignore dan pastikan terdapat baris "uploads/"',
            expectedResult: 'File fisik hasil upload tidak akan masuk ke git staging.',
          },
        },
      ],
    },

    // -------------------------------------------------------------
    // TASK 3: Middleware Validasi Multer
    // -------------------------------------------------------------
    {
      taskNumber: 3,
      title: 'Langkah 3: Buat Middleware Validasi & Batasan Ukuran Multer',
      description:
        'Validasi tipe berkas dan batasi ukuran file maksimal 5 MB di pintu gerbang middleware sebelum file diproses lebih lanjut oleh controller.',
      steps: [
        {
          stepNumber: 1,
          title: 'Konfigurasi Multer Memory Storage & File Filter',
          description:
            'Gunakan memoryStorage() agar file biner ditampung sementara di Buffer RAM, sehingga memudahkan validasi dan pengiriman ke storage.',
          instructions: [
            'Buat be/src/middlewares/upload.middleware.ts.',
            'Tentukan whitelist tipe MIME yang diizinkan (hanya JPEG, PNG, WEBP, dan PDF).',
            'Tentukan batas ukuran maksimum 5 * 1024 * 1024 (5 MB).',
          ],
          codeSnippet: {
            filename: 'be/src/middlewares/upload.middleware.ts',
            language: 'typescript',
            description: 'Middleware Multer dengan memoryStorage, 5MB limit, dan whitelist MIME',
            code: `import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
];

const storage = multer.memoryStorage();

const rawUpload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const err = new Error('Tipe file tidak diizinkan. Hanya menerima berkas JPG, PNG, WEBP, dan PDF.');
      (err as any).code = 'INVALID_FILE_TYPE';
      cb(err);
    }
  },
}).single('file');

// Error Handler Wrapper untuk mencegah crash 500 saat upload melebihi 5 MB
export const uploadMiddleware = (req: Request, res: Response, next: NextFunction) => {
  rawUpload(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'Ukuran file melebihi batas maksimum 5 MB.',
          });
        }
        return res.status(400).json({
          success: false,
          message: \`Kesalahan upload: \${err.message}\`,
        });
      }

      if (err.code === 'INVALID_FILE_TYPE') {
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }

      return res.status(400).json({
        success: false,
        message: err.message || 'Gagal memproses file upload.',
      });
    }

    next();
  });
};`,
          },
          verification: {
            action: 'Periksa fungsi uploadMiddleware pada terminal',
            expectedResult: 'Middleware dapat menangani error LIMIT_FILE_SIZE tanpa melempar uncaught exception.',
          },
        },
      ],
    },

    // -------------------------------------------------------------
    // TASK 4: Controller Simpan File & Proteksi Rollback
    // -------------------------------------------------------------
    {
      taskNumber: 4,
      title: 'Langkah 4: Simpan File dan Referensi ke Database dengan Proteksi Rollback',
      description:
        'Terapkan pola Rollback Safety: jika penyimpanan fisik di storage berhasil namun kueri pencatatan database SQL gagal, hapus file fisik secara otomatis agar tidak menyisakan file yatim (orphaned file).',
      steps: [
        {
          stepNumber: 1,
          title: 'Buat Data Access Layer (DAL) Dokumen',
          description:
            'Buat modul be/src/dal/document.dal.ts untuk memisahkan kueri SQL dokumen dari controller.',
          instructions: [
            'Implementasikan fungsi createDocument, getDocumentsByUserId, getAllDocuments, getDocumentById, dan deleteDocument.',
          ],
          codeSnippet: {
            filename: 'be/src/dal/document.dal.ts',
            language: 'typescript',
            description: 'DAL dokumen SQL dengan sanitasi dan filter',
            code: `import { pool } from '../db';
import crypto from 'crypto';

export interface DocumentRecord {
  id: string;
  name: string;
  fileKey: string;
  fileType: string;
  fileSize: number;
  url: string;
  userId: string;
  createdAt: string;
}

export async function createDocument(data: {
  name: string;
  fileKey: string;
  fileType: string;
  fileSize: number;
  url: string;
  userId: string;
}): Promise<DocumentRecord> {
  const id = crypto.randomUUID();
  const query = \`
    INSERT INTO documents (id, name, file_key, file_type, file_size, url, user_id, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, NOW());
  \`;
  await pool.query(query, [
    id,
    data.name,
    data.fileKey,
    data.fileType,
    data.fileSize,
    data.url,
    data.userId,
  ]);

  return {
    id,
    ...data,
    createdAt: new Date().toISOString(),
  };
}

export async function getDocumentById(id: string): Promise<DocumentRecord | null> {
  const [rows] = await pool.query('SELECT * FROM documents WHERE id = ?', [id]);
  const records = rows as any[];
  if (!records.length) return null;

  const r = records[0];
  return {
    id: r.id,
    name: r.name,
    fileKey: r.file_key,
    fileType: r.file_type,
    fileSize: r.file_size,
    url: r.url,
    userId: r.user_id,
    createdAt: r.created_at,
  };
}

export async function deleteDocumentFromDb(id: string): Promise<boolean> {
  const [result] = await pool.query('DELETE FROM documents WHERE id = ?', [id]);
  return (result as any).affectedRows > 0;
}`,
          },
          verification: {
            action: 'Simpan file be/src/dal/document.dal.ts',
            expectedResult: 'Kueri SQL dokumen siap dipanggil oleh controller.',
          },
        },
        {
          stepNumber: 2,
          title: 'Upload Controller dengan Mekanisme Rollback',
          description:
            'Tulis handler POST /api/upload di be/src/controllers/upload.controller.ts dengan blok try/catch rollback.',
          instructions: [
            'Pastikan user terotentikasi (req.user tersedia dari authMiddleware).',
            'Unggah file biner ke storageService.',
            'Bungkus penyimpanan SQL dalam blok try/catch. Jika terjadi error SQL, panggil storageService.deleteFile(fileKey).',
          ],
          codeSnippet: {
            filename: 'be/src/controllers/upload.controller.ts',
            language: 'typescript',
            description: 'Controller upload dengan jaminan rollback anti-file yatim',
            code: `import { Request, Response } from 'express';
import { storageService } from '../services/storage.service';
import { createDocument } from '../dal/document.dal';

export const handleUpload = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ success: false, message: 'Autentikasi diperlukan.' });
  }

  const file = req.file;
  if (!file) {
    return res.status(400).json({ success: false, message: 'File tidak ditemukan dalam request form-data.' });
  }

  // 1. Simpan fisik/object file ke Storage (Cloud / Local)
  const uploadResult = await storageService.uploadFile(
    file.buffer,
    file.originalname,
    file.mimetype
  );

  try {
    // 2. Simpan referensi metadata ke basis data SQL
    const docRecord = await createDocument({
      name: uploadResult.name,
      fileKey: uploadResult.fileKey,
      fileType: uploadResult.fileType,
      fileSize: uploadResult.fileSize,
      url: uploadResult.url,
      userId: user.id,
    });

    return res.status(201).json({
      success: true,
      message: 'File berhasil diunggah.',
      data: docRecord,
    });
  } catch (dbError: any) {
    // 3. Rollback Safety: Hapus file fisik jika pencatatan database SQL gagal
    console.error('Database insert failed, rolling back uploaded file:', dbError);
    await storageService.deleteFile(uploadResult.fileKey);

    return res.status(500).json({
      success: false,
      message: 'Gagal mencatat metadata dokumen ke database. File fisik telah dibersihkan.',
    });
  }
};`,
          },
          verification: {
            action: 'Periksa alur rollback pada controller',
            expectedResult: 'Tidak akan terjadi orphaned file jika koneksi SQL terputus di tengah proses.',
          },
        },
      ],
    },

    // -------------------------------------------------------------
    // TASK 5: Endpoint Tampilkan & Hapus File (Cegah IDOR)
    // -------------------------------------------------------------
    {
      taskNumber: 5,
      title: 'Langkah 5: Sediakan Endpoint Tampilkan dan Hapus File (Cegah IDOR)',
      description:
        'Buat endpoint GET dan DELETE dokumen dengan proteksi kepemilikan ketat: user biasa hanya boleh mengakses dan menghapus berkas miliknya sendiri (mencegah celah IDOR).',
      steps: [
        {
          stepNumber: 1,
          title: 'Implementasikan Handler GET & DELETE dengan Verifikasi Kepemilikan',
          description:
            'Tambahkan handler list dokumen dan hapus dokumen pada be/src/controllers/upload.controller.ts.',
          instructions: [
            'Pada aksi GET /api/documents: user biasa hanya menerima daftar file miliknya (WHERE user_id = req.user.id), sedangkan role admin dapat melihat semua.',
            'Pada aksi DELETE /api/upload/:id: periksa apakah dokumen ditemukan dan milik user yang sedang login.',
            'Jika ID dokumen bukan milik user dan user bukan admin, kembalikan HTTP 404/403 (Cegah IDOR).',
            'Jika sah, hapus fisik file dari storageService lalu hapus record SQL.',
          ],
          codeSnippet: {
            filename: 'be/src/controllers/upload.controller.ts',
            language: 'typescript',
            description: 'Handler GET & DELETE dokumen berpagar anti-IDOR',
            code: `import { Request, Response } from 'express';
import { storageService } from '../services/storage.service';
import { getDocumentById, deleteDocumentFromDb } from '../dal/document.dal';
import { pool } from '../db';

export const handleGetDocuments = async (req: Request, res: Response) => {
  const user = req.user!;
  const isAdmin = user.role === 'admin';

  const query = isAdmin
    ? 'SELECT * FROM documents ORDER BY created_at DESC'
    : 'SELECT * FROM documents WHERE user_id = ? ORDER BY created_at DESC';
  const params = isAdmin ? [] : [user.id];

  const [rows] = await pool.query(query, params);
  return res.status(200).json({ success: true, data: rows });
};

export const handleDeleteDocument = async (req: Request, res: Response) => {
  const user = req.user!;
  const { id } = req.params;

  // 1. Cari dokumen di database
  const doc = await getDocumentById(id);

  // 2. Cegah IDOR: Hanya pemilik dokumen atau admin yang diizinkan menghapus
  if (!doc || (doc.userId !== user.id && user.role !== 'admin')) {
    return res.status(404).json({
      success: false,
      message: 'Dokumen tidak ditemukan atau Anda tidak memiliki akses untuk menghapusnya.',
    });
  }

  // 3. Hapus file fisik dari storage
  await storageService.deleteFile(doc.fileKey);

  // 4. Hapus record dari database SQL
  await deleteDocumentFromDb(id);

  return res.status(200).json({
    success: true,
    message: 'Dokumen berhasil dihapus dari storage dan database.',
  });
};`,
          },
          verification: {
            action: 'Periksa logika IDOR pada baris pengecekan doc.userId !== user.id',
            expectedResult: 'User lain tidak dapat menghapus berkas yang bukan miliknya.',
          },
        },
        {
          stepNumber: 2,
          title: 'Daftarkan Router Upload ke Pipeline API',
          description:
            'Buat be/src/routes/upload.routes.ts dan hubungkan ke router utama be/src/routes/api.ts.',
          instructions: [
            'Terapkan middleware autentikasi (authMiddleware) pada seluruh rute upload.',
            'Pasang uploadMiddleware khusus pada rute POST /api/upload.',
          ],
          codeSnippet: {
            filename: 'be/src/routes/upload.routes.ts',
            language: 'typescript',
            description: 'Rute upload file dan manajemen dokumen',
            code: `import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { uploadMiddleware } from '../middlewares/upload.middleware';
import {
  handleUpload,
  handleGetDocuments,
  handleDeleteDocument,
} from '../controllers/upload.controller';

const router = Router();

// Seluruh endpoint wajib terautentikasi
router.use(authMiddleware);

router.post('/', uploadMiddleware, handleUpload);
router.get('/list', handleGetDocuments);
router.delete('/:id', handleDeleteDocument);

export default router;`,
          },
          verification: {
            action: 'Kaitkan uploadRoutes ke router utama: apiRouter.use("/upload", uploadRoutes)',
            expectedResult: 'Rute /api/upload dapat diakses oleh client dengan bearer token / cookie.',
          },
        },
      ],
    },

    // -------------------------------------------------------------
    // TASK 6: Komponen Upload Drag & Drop (FE)
    // -------------------------------------------------------------
    {
      taskNumber: 6,
      title: 'Langkah 6: Buat Komponen Upload Berkas dengan Drag & Drop (FE)',
      description:
        'Sediakan antarmuka drag & drop di Next.js dengan validasi awal format dan batas ukuran di sisi peramban sebelum data dikirimkan.',
      steps: [
        {
          stepNumber: 1,
          title: 'Buat Komponen FileUploadZone di Frontend',
          description:
            'Buat fe/app/(dashboard)/documents/components/FileUploadZone.tsx sebagai Client Component ("use client").',
          instructions: [
            'Sediakan elemen <input type="file" /> tersembunyi dengan tombol pemicu.',
            'Tangani event onDragOver, onDragLeave, dan onDrop.',
            'Lakukan validasi lokal: tolak file > 5 MB dan format di luar JPG/PNG/WEBP/PDF sebelum proses kirim.',
          ],
          codeSnippet: {
            filename: 'fe/app/(dashboard)/documents/components/FileUploadZone.tsx',
            language: 'typescript',
            description: 'Komponen drag & drop upload berkas dengan validasi sisi browser',
            code: `'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, File, AlertCircle } from 'lucide-react';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

interface FileUploadZoneProps {
  onUploadSuccess: () => void;
}

export function FileUploadZone({ onUploadSuccess }: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndUpload = (file: File) => {
    setErrorMessage(null);

    // 1. Validasi Ukuran (Maks 5 MB)
    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage('Ukuran file melebihi batas 5 MB.');
      return;
    }

    // 2. Validasi Tipe Berkas
    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrorMessage('Tipe berkas tidak didukung. Harap pilih gambar (JPG/PNG/WEBP) atau PDF.');
      return;
    }

    // Lanjutkan ke fungsi upload (Langkah 7)
    performUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={\`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all \${
          isDragging
            ? 'border-blue-500 bg-blue-950/20'
            : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700'
        }\`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.webp"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              validateAndUpload(e.target.files[0]);
            }
          }}
        />

        <div className="flex flex-col items-center justify-center gap-2">
          <UploadCloud className="w-10 h-10 text-zinc-400" />
          <p className="text-sm font-semibold text-white">
            Tarik &amp; lepas berkas ke sini, atau klik untuk memilih
          </p>
          <p className="text-xs text-zinc-500">
            Mendukung berkas PDF, PNG, JPG, dan WEBP (Maksimal 5 MB)
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="mt-3 flex items-center gap-2 text-xs text-red-400 bg-red-950/40 border border-red-900/60 p-2.5 rounded-lg">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}`,
          },
          verification: {
            action: 'Uji drag berkas ke area FileUploadZone',
            expectedResult: 'Area memberikan visual feedback saat berkas ditarik di atasnya.',
          },
        },
      ],
    },

    // -------------------------------------------------------------
    // TASK 7: Tracking Progres Upload dengan XMLHttpRequest (FE)
    // -------------------------------------------------------------
    {
      taskNumber: 7,
      title: 'Langkah 7: Kirim File dan Tampilkan Progres dengan XMLHttpRequest (FE)',
      description:
        'Kirim FormData menggunakan XMLHttpRequest dengan event listener xhr.upload.onprogress untuk menyajikan animasi progress bar persentase (0% - 100%) secara riil.',
      steps: [
        {
          stepNumber: 1,
          title: 'Implementasikan Pengiriman File via XHR',
          description:
            'Mengapa menggunakan XMLHttpRequest dan bukan standard fetch? Karena fetch bawaan browser saat ini belum menyediakan progress event untuk request body.',
          instructions: [
            'Buat objek FormData dan lampirkan berkas dengan key "file".',
            'Buat instance XMLHttpRequest dengan properti withCredentials = true agar sesi cookie/auth terkirim.',
            'Pasang listener pada event xhr.upload.onprogress untuk menghitung (loaded / total) * 100.',
          ],
          codeSnippet: {
            filename: 'fe/app/(dashboard)/documents/components/FileUploadZone.tsx',
            language: 'typescript',
            description: 'Implementasi XHR progress listener dan visual progress bar',
            code: `// Tambahkan fungsi performUpload di dalam FileUploadZone:
const performUpload = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const xhr = new XMLHttpRequest();
  xhr.withCredentials = true; // Kirim cookie sesi autentikasi

  // Pantau progress unggah berkas secara riil
  xhr.upload.onprogress = (event) => {
    if (event.lengthComputable) {
      const percent = Math.round((event.loaded / event.total) * 100);
      setUploadProgress(percent);
    }
  };

  xhr.onload = () => {
    setUploadProgress(null);
    if (xhr.status >= 200 && xhr.status < 300) {
      onUploadSuccess();
    } else {
      try {
        const res = JSON.parse(xhr.responseText);
        setErrorMessage(res.message || 'Gagal mengunggah file.');
      } catch {
        setErrorMessage('Gagal menghubungi server.');
      }
    }
  };

  xhr.onerror = () => {
    setUploadProgress(null);
    setErrorMessage('Terjadi kesalahan jaringan saat upload.');
  };

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  xhr.open('POST', \`\${apiUrl}/upload\`);
  xhr.send(formData);
};`,
          },
          verification: {
            action: 'Unggah file berukuran 2-4 MB di browser',
            expectedResult: 'Progress bar meningkat secara bertahap dari 0% hingga 100%.',
          },
        },
      ],
    },

    // -------------------------------------------------------------
    // TASK 8: Tampilkan File & Modal Pratinjau (FE)
    // -------------------------------------------------------------
    {
      taskNumber: 8,
      title: 'Langkah 8: Tampilkan File & Modal Pratinjau (FE)',
      description:
        'Sajikan daftar file yang telah diunggah dalam format kartu responsif, lengkap dengan informasi format berkas, ukuran yang diformat (KB/MB), serta modal pratinjau langsung.',
      steps: [
        {
          stepNumber: 1,
          title: 'Buat Komponen DocumentCard',
          description:
            'Buat fe/app/(dashboard)/documents/components/DocumentCard.tsx untuk menampilkan representasi tiap file.',
          instructions: [
            'Format ukuran berkas menggunakan helper formatBytes (contoh: 2.4 MB alih-alih angka raw bytes).',
            'Sediakan tombol "Lihat" untuk membuka pratinjau, tombol "Unduh", dan tombol "Hapus".',
          ],
          codeSnippet: {
            filename: 'fe/app/(dashboard)/documents/components/DocumentCard.tsx',
            language: 'typescript',
            description: 'Kartu dokumen dengan badge tipe, ukuran, tanggal, dan aksi',
            code: `'use client';

import React from 'react';
import { FileText, Image as ImageIcon, Eye, Download, Trash2 } from 'lucide-react';

export interface DocumentItem {
  id: string;
  name: string;
  fileType: string;
  fileSize: number;
  url: string;
  userId: string;
  createdAt: string;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return \`\${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} \${sizes[i]}\`;
}

interface DocumentCardProps {
  doc: DocumentItem;
  onPreview: (doc: DocumentItem) => void;
  onDelete: (id: string) => void;
}

export function DocumentCard({ doc, onPreview, onDelete }: DocumentCardProps) {
  const isImage = doc.fileType.startsWith('image/');
  const isPdf = doc.fileType === 'application/pdf';

  return (
    <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 flex flex-col justify-between hover:border-zinc-700 transition-colors">
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-lg bg-zinc-800 text-zinc-300">
          {isImage ? <ImageIcon className="w-5 h-5 text-blue-400" /> : <FileText className="w-5 h-5 text-emerald-400" />}
        </div>
        <div className="overflow-hidden flex-1">
          <h4 className="text-sm font-semibold text-white truncate" title={doc.name}>
            {doc.name}
          </h4>
          <p className="text-xs text-zinc-400 font-mono mt-0.5">
            {formatBytes(doc.fileSize)} • {isPdf ? 'PDF' : 'Gambar'}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
        <button
          onClick={() => onPreview(doc)}
          className="text-xs text-zinc-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Lihat</span>
        </button>

        <a
          href={doc.url}
          download={doc.name}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Unduh</span>
        </a>

        <button
          onClick={() => onDelete(doc.id)}
          className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1.5 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Hapus</span>
        </button>
      </div>
    </div>
  );
}`,
          },
          verification: {
            action: 'Periksa tampilan kartu dokumen di layar',
            expectedResult: 'Nama file yang panjang terpotong rapi dengan truncate dan tombol aksi aktif.',
          },
        },
        {
          stepNumber: 2,
          title: 'Buat Modal Pratinjau Dokumen (Gambar & PDF)',
          description:
            'Buat fe/app/(dashboard)/documents/components/DocumentPreviewModal.tsx untuk menampilkan isi berkas secara instan.',
          instructions: [
            'Jika berkas adalah gambar: tampilkan menggunakan tag <img> dengan max-h-screen.',
            'Jika berkas adalah PDF: gunakan tag <iframe src={doc.url} /> agar pengguna dapat membaca dokumen langsung tanpa berpindah tab.',
          ],
          codeSnippet: {
            filename: 'fe/app/(dashboard)/documents/components/DocumentPreviewModal.tsx',
            language: 'typescript',
            description: 'Modal pratinjau dokumen responsif untuk Gambar dan PDF iframe',
            code: `'use client';

import React from 'react';
import { X, ExternalLink } from 'lucide-react';
import { DocumentItem } from './DocumentCard';

interface PreviewModalProps {
  doc: DocumentItem | null;
  onClose: () => void;
}

export function DocumentPreviewModal({ doc, onClose }: PreviewModalProps) {
  if (!doc) return null;
  const isImage = doc.fileType.startsWith('image/');
  const isPdf = doc.fileType === 'application/pdf';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="truncate">
            <h3 className="text-sm font-semibold text-white truncate">{doc.name}</h3>
            <p className="text-xs text-zinc-400 font-mono">{doc.fileType}</p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body Preview */}
        <div className="p-4 flex-1 overflow-auto flex items-center justify-center bg-zinc-950/50 min-h-[350px]">
          {isImage && (
            <img
              src={doc.url}
              alt={doc.name}
              className="max-h-[70vh] max-w-full rounded-lg object-contain shadow-lg"
            />
          )}

          {isPdf && (
            <iframe
              src={doc.url}
              title={doc.name}
              className="w-full h-[70vh] rounded-lg border border-zinc-800"
            />
          )}
        </div>
      </div>
    </div>
  );
}`,
          },
          verification: {
            action: 'Klik tombol "Lihat" pada dokumen PDF dan Gambar',
            expectedResult: 'Modal terbuka dan menampilkan konten berkas dengan jernih.',
          },
        },
      ],
    },

    // -------------------------------------------------------------
    // TASK 9: Fitur Hapus Berkas
    // -------------------------------------------------------------
    {
      taskNumber: 9,
      title: 'Langkah 9: Implementasikan Fitur Hapus Berkas (FE & BE)',
      description:
        'Sambungkan tombol hapus di frontend ke endpoint DELETE /api/upload/:id dengan konfirmasi dialog dan pembaruan antarmuka secara instan.',
      steps: [
        {
          stepNumber: 1,
          title: 'Integrasikan Aksi Hapus dengan Konfirmasi Dialog',
          description:
            'Tulis fungsi penghapusan dokumen di frontend yang memanggil backend dan memperbarui state lokal.',
          instructions: [
            'Tampilkan konfirmasi browser sebelum penghapusan dieksekusi.',
            'Kirim request DELETE dengan credentials: "include".',
            'Setelah berhasil, perbarui state daftar dokumen dan tampilkan notifikasi berhasil.',
          ],
          codeSnippet: {
            filename: 'fe/app/(dashboard)/documents/components/DocumentsContainer.tsx',
            language: 'typescript',
            description: 'Fungsi hapus dokumen dengan konfirmasi dan sinkronisasi tampilan',
            code: `const handleDelete = async (id: string) => {
  const confirmed = window.confirm('Apakah Anda yakin ingin menghapus berkas ini secara permanen?');
  if (!confirmed) return;

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(\`\${apiUrl}/upload/\${id}\`, {
      method: 'DELETE',
      credentials: 'include',
    });

    const data = await res.json();
    if (res.ok && data.success) {
      // Hapus dokumen dari state lokal secara instan
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    } else {
      alert(data.message || 'Gagal menghapus berkas.');
    }
  } catch {
    alert('Terjadi kesalahan jaringan saat menghapus berkas.');
  }
};`,
          },
          verification: {
            action: 'Hapus salah satu berkas dan periksa folder be/uploads/',
            expectedResult: 'Berkas fisik terhapus dari disk/storage dan baris data hilang dari tabel.',
          },
        },
      ],
    },

    // -------------------------------------------------------------
    // TASK 10: Uji Kasus Fungsional & Keamanan
    // -------------------------------------------------------------
    {
      taskNumber: 10,
      title: 'Langkah 10: Uji Kasus Fungsional & Keamanan (6 Checkpoint)',
      description:
        'Lakukan verifikasi menyeluruh mencakup validasi tipe, batas ukuran, proteksi IDOR antar-pengguna, dan penghapusan non-orphaned files.',
      steps: [
        {
          stepNumber: 1,
          title: 'Uji 6 Checkpoint Fungsional & Keamanan',
          description:
            'Jalankan pengujian manual atau automated test suite untuk memvalidasi ketahanan sistem upload berkas:',
          instructions: [
            '1. Checkpoint 1 (Upload Valid): Unggah berkas PDF dan JPG berukuran < 5 MB. Server harus mengembalikan status 201 Created dengan URL yang valid.',
            '2. Checkpoint 2 (Tolak MIME Berbahaya): Unggah berkas executable (.exe, .sh) atau skrip HTML. Server harus menolak dengan status 400 Bad Request.',
            '3. Checkpoint 3 (Tolak File > 5 MB): Unggah file berukuran 6-10 MB. Server harus menolak dengan kode LIMIT_FILE_SIZE (status 400).',
            '4. Checkpoint 4 (Proteksi IDOR Hapus): Login sebagai Akun B, lalu kirim request DELETE ke ID dokumen milik Akun A. Server wajib menolak dengan HTTP 404/403.',
            '5. Checkpoint 5 (Hapus Sah): Login sebagai Akun A dan hapus dokumen miliknya. Dokumen terhapus dari storage dan database.',
            '6. Checkpoint 6 (Bebas File Yatim): Pastikan file fisik yang telah dihapus tidak lagi tersisa di folder uploads/ maupun Cloud Storage.',
          ],
          codeSnippet: {
            filename: 'be/test-suite.ts',
            language: 'typescript',
            description: 'Cuplikan pengujian otomatis untuk Pertemuan 11',
            code: `// Cuplikan skenario uji otomatis Pertemuan 11
describe('Pertemuan 11: File Upload & Cloud Storage', () => {
  it('P11-1: Menolak upload file tanpa autentikasi (401)', async () => { /* ... */ });
  it('P11-2: Berhasil mengunggah file valid PDF < 5 MB (201)', async () => { /* ... */ });
  it('P11-3: Menolak tipe file tidak sah seperti text/plain atau script (400)', async () => { /* ... */ });
  it('P11-4: Menolak file berukuran melebihi batas 5 MB (400 LIMIT_FILE_SIZE)', async () => { /* ... */ });
  it('P11-5: Anti-IDOR: User B tidak boleh menghapus file milik User A (404)', async () => { /* ... */ });
  it('P11-6: Pemilik sah dapat menghapus file & file fisik terhapus dari storage (200)', async () => { /* ... */ });
});`,
          },
          verification: {
            action: 'Jalankan "npm test" pada direktori backend',
            expectedResult: 'Seluruh skenario pengujian Pertemuan 11 berhasil lulus 100% tanpa kegagalan.',
          },
        },
      ],
    },
  ],
  steps: [
    { title: 'Langkah 1: Pahami Perbedaan Database dan Cloud Storage', description: 'Pemisahan biner statis vs metadata relasional SQL' },
    { title: 'Langkah 2: Siapkan Storage Service (Cloud Storage & Local Fallback)', description: 'Multer & dual-mode storage service (Cloud / local uploads/)' },
    { title: 'Langkah 3: Buat Middleware Validasi & Batasan Ukuran Multer', description: 'Whitelist MIME (JPG, PNG, WEBP, PDF) dan batas 5 MB' },
    { title: 'Langkah 4: Simpan File dan Referensi ke Database dengan Proteksi Rollback', description: 'DAL dokumen SQL dan rollback safety anti-file yatim' },
    { title: 'Langkah 5: Sediakan Endpoint Tampilkan dan Hapus File (Cegah IDOR)', description: 'Pencegahan IDOR (doc.userId === req.user.id)' },
    { title: 'Langkah 6: Buat Komponen Upload Berkas dengan Drag & Drop (FE)', description: 'FileUploadZone di Next.js dengan validasi browser' },
    { title: 'Langkah 7: Kirim File dan Tampilkan Progres dengan XMLHttpRequest (FE)', description: 'Tracking progress bar riil via xhr.upload.onprogress' },
    { title: 'Langkah 8: Tampilkan File & Modal Pratinjau (FE)', description: 'DocumentCard dan DocumentPreviewModal (Gambar & PDF)' },
    { title: 'Langkah 9: Implementasikan Fitur Hapus Berkas (FE & BE)', description: 'Dialog konfirmasi hapus dan sinkronisasi tampilan' },
    { title: 'Langkah 10: Uji Kasus Fungsional & Keamanan (6 Checkpoint)', description: 'Uji 6 checkpoint validasi MIME, ukuran, IDOR, dan orphan files' },
  ],
  fileTree: [
    { path: 'be/src/services/storage.service.ts', type: 'file', status: 'added', description: 'Dual-mode storage service (Cloud / local uploads/)' },
    { path: 'be/src/middlewares/upload.middleware.ts', type: 'file', status: 'added', description: 'Multer memory storage, 5MB limit & MIME filter' },
    { path: 'be/src/dal/document.dal.ts', type: 'file', status: 'added', description: 'Data Access Layer query dokumen SQL' },
    { path: 'be/src/controllers/upload.controller.ts', type: 'file', status: 'added', description: 'Handler upload, get, & delete dengan proteksi IDOR' },
    { path: 'be/src/routes/upload.routes.ts', type: 'file', status: 'added', description: 'Rute API /api/upload & /api/documents' },
    { path: 'be/src/db/migrations/005-create-documents.ts', type: 'file', status: 'added', description: 'Migrasi skema tabel documents' },
    { path: 'fe/app/(dashboard)/documents/page.tsx', type: 'file', status: 'added', description: 'Halaman manajemen dokumen & file Next.js' },
    { path: 'fe/app/(dashboard)/documents/components/FileUploadZone.tsx', type: 'file', status: 'added', description: 'Area drag & drop dan XHR progress upload' },
    { path: 'fe/app/(dashboard)/documents/components/DocumentCard.tsx', type: 'file', status: 'added', description: 'Kartu berkas, info ukuran, format, & aksi' },
    { path: 'fe/app/(dashboard)/documents/components/DocumentPreviewModal.tsx', type: 'file', status: 'added', description: 'Modal preview langsung file gambar dan PDF' },
    { path: 'fe/app/(dashboard)/documents/components/DocumentsContainer.tsx', type: 'file', status: 'added', description: 'Container tab filter, search, & kuota' },
  ],
  codeSnippets: [],
  acceptanceCriteria: [
    {
      id: 'ac-1',
      text: 'File biner statis tidak disimpan langsung sebagai BLOB di database SQL, melainkan disimpan pada Cloud/Local Storage dengan pencatatan metadata.',
    },
    {
      id: 'ac-2',
      text: 'Backend Express menggunakan Multer dengan penyimpanan memoryStorage(), membatasi ukuran maksimal 5 MB.',
    },
    {
      id: 'ac-3',
      text: 'Validasi whitelist MIME type diterapkan di server (hanya menerima JPEG, PNG, WEBP, dan PDF), menolak tipe file executable atau berbahaya.',
    },
    {
      id: 'ac-4',
      text: 'Kesalahan batas ukuran file (LIMIT_FILE_SIZE) ditangkap oleh middleware error handler dan mengembalikan status HTTP 400 Bad Request JSON ramah.',
    },
    {
      id: 'ac-5',
      text: 'Storage service mendukung mode ganda (dual-mode): otomatis beralih ke direktori lokal uploads/ jika token cloud tidak disetel (mendukung praktikum offline).',
    },
    {
      id: 'ac-6',
      text: 'Pola rollback diterapkan: jika query pencatatan metadata database SQL gagal, file fisik di storage otomatis dihapus untuk mencegah file yatim (orphaned files).',
    },
    {
      id: 'ac-7',
      text: 'Endpoint DELETE /api/upload/:id memvalidasi kepemilikan file (doc.userId === req.user.id) untuk mencegah celah IDOR (kecuali akun dengan role admin).',
    },
    {
      id: 'ac-8',
      text: 'Frontend Next.js menyediakan antarmuka drag & drop dengan validasi awal format dan ukuran sebelum request dikirim ke server.',
    },
    {
      id: 'ac-9',
      text: 'Pengiriman file menggunakan XMLHttpRequest (xhr.upload.onprogress) untuk menampilkan indikator persentase proses unggah (0% - 100%) secara riil.',
    },
    {
      id: 'ac-10',
      text: 'Modal pratinjau menampilkan gambar secara langsung dan menyediakan iframe/tab baru untuk file PDF.',
    },
    {
      id: 'ac-11',
      text: 'Lolos seluruh 6 skenario pengujian: upload valid, tolak MIME berbahaya, tolak ukuran > 5 MB, cegah IDOR delete, hapus sah, dan verifikasi non-orphaned files.',
    },
  ],
  gitStandard: {
    branchName: 'feat/file-upload-cloud-storage',
    commitExample: 'feat(upload): implement multer storage service, rollback safety, and nextjs progress upload',
    prTitle: 'feat: implement file upload, dual-mode storage service, and documents preview',
  },
  pitfalls: [
    {
      symptom: 'req.file bernilai undefined saat mengakses endpoint upload di Express',
      cause: 'Express tidak memiliki parser multipart/form-data bawaan; express.json() dan express.urlencoded() tidak bisa membaca FormData.',
      solution: 'Gunakan middleware Multer (uploadMiddleware) sebelum controller handler dieksekusi.',
    },
    {
      symptom: 'Server Express crash atau menampilkan error HTML 500 saat upload file > 5 MB',
      cause: 'Multer melempar error LIMIT_FILE_SIZE yang tidak tertangkap oleh middleware penanganan error khusus.',
      solution: 'Bungkus middleware upload dengan fungsi penangkap (err instanceof multer.MulterError) dan kembalikan status HTTP 400 berformat JSON.',
    },
    {
      symptom: 'File menumpuk di Cloud Storage atau disk tetapi tidak tercatat di database (Orphaned Files)',
      cause: 'Upload ke storage berhasil tetapi query INSERT INTO database gagal (misal koneksi terputus atau constraint error), dan tidak ada mekanisme pembersihan.',
      solution: 'Terapkan blok try/catch di controller. Jika query SQL gagal, panggil storageService.deleteFile(fileKey) untuk membersihkan file fisik.',
    },
    {
      symptom: 'User B bisa menghapus file milik User A dengan mengirimkan ID dokumen (Celah IDOR)',
      cause: 'Query hapus database hanya memeriksa WHERE id = ? tanpa mencocokkan userId pemilik dokumen.',
      solution: 'Verifikasi kepemilikan dokumen (doc.userId === req.user.id || req.user.role === "admin"). Jika tidak cocok, kembalikan HTTP 404/403.',
    },
    {
      symptom: 'Upload file 3-5 MB gagal seketika di Next.js saat menggunakan Server Action ("Body exceeded 1MB limit")',
      cause: 'Next.js App Router secara default membatasi ukuran body Server Action sebesar 1 MB.',
      solution: 'Untuk upload file biner, kirimkan FormData langsung dari Client Component ke endpoint Backend Express via XMLHttpRequest atau fetch dengan credentials include.',
    },
    {
      symptom: 'Progress bar upload tidak bergerak dan langsung melonjak dari 0% ke 100%',
      cause: 'Menggunakan standard fetch() yang tidak mendukung event pengawasan progress unggah request body.',
      solution: 'Gunakan XMLHttpRequest dan pasang listener pada event xhr.upload.onprogress untuk menghitung (loaded / total) * 100.',
    },
  ],
  nextStep: {
    title: 'Deployment & Production Hardening',
    slug: '04-production-deployment',
    description: 'Materi berikutnya: konfigurasi environment production, SSL/HTTPS, rate limiting, dan monitoring.',
  },
};
