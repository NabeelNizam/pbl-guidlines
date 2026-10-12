# Standar Format Tutorial & Modul Praktikum PBL

Dokumen ini adalah aturan baku (*Standard Operating Procedure*) untuk penulisan seluruh modul dan dokumentasi praktikum Project-Based Learning (PBL).

---

## 1. Prinsip Utama

1. **Format Praktikum Step-by-Step (Bukan Artikel Teori Panjang)**
   Setiap modul harus dirasakan seperti jobsheet praktikum laboratorium:
   $$\text{Langkah} \rightarrow \text{Instruksi} \rightarrow \text{Kode/Struktur} \rightarrow \text{Visual Ref} \rightarrow \text{Verifikasi} \rightarrow \text{Lanjut}$$
   Hindari paragraf teori panjang bertele-tele. Teori cukup diringkas dalam box *Catatan* jika benar-benar krusial.

2. **Alur Vertikal (Vertical Slice / Feature-Driven)**
   **Jangan memisahkan materi menjadi kubu Backend sendiri dan Frontend sendiri secara terisolasi.**
   Alur harus linear dan berurutan sesuai lifecycle pengembangan riil:
   * **Penyamaan Arsitektur:** App Router, boundaries (loading & error), component scoping.
   * **Gerbang Aplikasi:** Auth (DB, API Login/Register, Token Cookie, Middleware & Layout Dashboard).
   * **Siklus Fitur Vertikal (CRUD Master):** DB Schema & Migrasi $\rightarrow$ Backend Query & Service $\rightarrow$ Frontend Read Table $\rightarrow$ Form & Validasi (Zod) $\rightarrow$ Mutasi, Toast Feedback & Revalidasi.
   * **Pengayaan Fitur:** Search, Filter, Pagination terpadu, Upload File.
   * **Quality & Release:** Security hardening, pengujian, Git PR workflow, deployment.

3. **Pola Universal: Menuntun dengan "Dashboard Users"**
   * Tutorial menggunakan contoh universal: **Website Dashboard Pengguna (Users)**.
   * Selalu sertakan **Tabel Adaptasi Domain** di awal modul agar mahasiswa kelompok (Rental, Klinik, Inventori, Toko Online) langsung paham padanan entitasnya di proyek mereka masing-masing.

4. **Zero Guessing untuk Mahasiswa**
   Mahasiswa tidak boleh menebak-nebak:
   * Di file mana kode ditulis? *(Tulis path file eksplisit)*.
   * Bagaimana struktur foldernya? *(Tampilkan ascii file tree)*.
   * Apa yang harus saya lihat di layar? *(Tuliskan deskripsi Visual Reference)*.
   * Kapan harus commit? *(Berikan branch & Conventional Commit spesifik)*.

---

## 2. Struktur Standar Dokumen Modul

Setiap modul praktikum wajib mengikuti struktur hierarki berikut:

```markdown
# [Nomor]. [Judul Tutorial]

[Deskripsi singkat 1-2 paragraf mengenai apa yang dibangun dan fungsinya]

## Tujuan
[Tujuan teknis dan kompetensi yang dicapai mahasiswa]

## Prasyarat
- [Item prasyarat 1]
- [Item prasyarat 2]

## Panduan Adaptasi Domain Proyek
| Bagian Tutorial | Contoh Universal (Users) | Proyek A | Proyek B |
| :--- | :--- | :--- | :--- |
| ... | ... | ... | ... |

---

## TASK 1: [Nama Task Utama]
[Deskripsi singkat task]

### Langkah 1 — [Nama Tindakan Spesifik]
**Deskripsi:** [Mengapa langkah ini diperlukan]

**Instruksi:**
1. [Buka folder / file...]
2. [Buat file...]
3. [Ketik kode...]

**Struktur File:**
[ASCII tree struktur folder]

**Kode yang Dibuat / Diubah:**
[Code block lengkap dengan path file di baris komentar pertama]

**Visual Reference:**
> **Gambar X — [Caption Gambar]**
> [Tipe: Editor / Terminal / Browser / Postman / Diagram]
> [Deskripsi detail apa yang harus terlihat di screenshot]

**Verifikasi:**
- **Tindakan:** [Command yang dijalankan / URL yang dibuka]
- **Hasil yang Diharapkan:** [Output terminal / elemen UI yang muncul]
- *Jika hasil sudah sesuai, lanjutkan ke langkah berikutnya.*

---

## Acceptance Criteria
- [ ] [Kriteria 1]
- [ ] [Kriteria 2]

## Standar Git Workflow
### Branch
git checkout -b [nama-branch]

### Commit
git add [path/file]
git commit -m "[type](scope): pesan jelas"

## Troubleshooting
### [Pesan Error / Gejala]
- **Gejala:** [Apa yang dialami mahasiswa]
- **Penyebab:** [Akar masalah]
- **Solusi:** [Langkah perbaikan langsung]

## Modul Selanjutnya
[Tautan ke modul berikutnya]
```

---

## 3. Aturan Baku untuk Deskripsi Visual Reference

Jangan memasukkan gambar sekadar hiasan. Setiap blok gambar harus berupa **spesifikasi visual** yang menjawab salah satu dari pertanyaan:
1. *Di mana saya harus melakukan ini?* (Editor)
2. *Command apa yang saya jalankan dan apa responnya?* (Terminal)
3. *Seperti apa tampilan UI yang benar di layar?* (Browser)
4. *Bagaimana format request dan response API-nya?* (Postman)

Format caption baku:
> **Gambar X — [Deskripsi ringkas caption]**
> *Screenshot [Target Window] menampilkan [Elemen spesifik yang harus ada].*
