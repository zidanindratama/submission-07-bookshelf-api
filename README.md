# 📚 Bookshelf API (Hapi)

Proyek ini adalah **RESTful API** sederhana untuk mengelola koleksi buku, dibangun dengan **Node.js (CommonJS)** dan **Hapi**.
API memenuhi **kriteria wajib** Bookshelf API (Dicoding): port **9000**, runner `npm run start`, penyimpanan **in-memory** (tanpa DB/JSON), serta seluruh endpoint **CRUD** berikut validasi dan format respons sesuai spesifikasi.

## ✨ Fitur Utama

- **Kriteria 1 – Port 9000**
  Server lokal berjalan pada `http://localhost:9000`.
- **Kriteria 2 – Runner**
  Jalankan dengan `npm run start` (bukan nodemon).
- **Kriteria 3 – Tambah Buku** (`POST /books`)
  Validasi `name` wajib, dan `readPage <= pageCount`.
  Server mengisi `id`, `finished`, `insertedAt`, `updatedAt`.
- **Kriteria 4 – Daftar Buku** (`GET /books`)
  Kembalikan hanya `id`, `name`, `publisher`.
  **Opsional+**: dukung query `?name`, `?reading=0|1`, `?finished=0|1`.
- **Kriteria 5 – Detail Buku** (`GET /books/{bookId}`)
- **Kriteria 6 – Perbarui Buku** (`PUT /books/{bookId}`)
  Validasi `name` wajib, `readPage <= pageCount`.
- **Kriteria 7 – Hapus Buku** (`DELETE /books/{bookId}`)

Semua pesan dan status code disesuaikan dengan yang diminta oleh pengujian otomatis.

## 📂 Struktur Proyek

```
bookshelf-api/
├─ package.json
└─ src/
   ├─ server.js      // bootstrap Hapi (port 9000, npm run start)
   ├─ routes.js      // definisi route
   ├─ handlers.js    // handler tiap endpoint + validasi
   └─ books.js       // penyimpanan in-memory (array)
```

## 🧰 Teknologi

- **Node.js** (LTS ≥ 18.13.0)
- **@hapi/hapi** – HTTP server & routing
- **nanoid\@3** – generator `id` unik
- (Opsional) **ESLint** – konsistensi gaya kode

## ▶️ Cara Menjalankan (Lokal/Submission)

1. **Clone & install**

```bash
git clone https://github.com/zidanindratama/submission-07-bookshelf-api
cd submission-07-bookshelf-api
npm install
```

2. **Start server (wajib untuk submission)**

```bash
npm run start
# Server: http://localhost:9000
```

> Pastikan tidak menjalankan dengan `nodemon` saat submit. Jika perlu untuk dev, gunakan script terpisah `start-dev`.

## 📡 Spesifikasi Endpoint

### 1) Tambah Buku — `POST /books`

**Body (JSON):**

```json
{
  "name": "Buku A",
  "year": 2010,
  "author": "John Doe",
  "summary": "Lorem ipsum",
  "publisher": "Dicoding Indonesia",
  "pageCount": 100,
  "readPage": 25,
  "reading": false
}
```

**201 (success):**

```json
{
  "status": "success",
  "message": "Buku berhasil ditambahkan",
  "data": { "bookId": "Qbax5Oy7L8WKf74l" }
}
```

**400 (tanpa `name`):**

```json
{ "status": "fail", "message": "Gagal menambahkan buku. Mohon isi nama buku" }
```

**400 (`readPage` > `pageCount`):**

```json
{
  "status": "fail",
  "message": "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
}
```

---

### 2) Daftar Buku — `GET /books`

**200:**

```json
{
  "status": "success",
  "data": {
    "books": [
      { "id": "Qbax5...", "name": "Buku A", "publisher": "Dicoding Indonesia" }
    ]
  }
}
```

**Opsional – Query:**

- `?name=teks` → filter nama (case-insensitive)
- `?reading=0|1` → `false|true`
- `?finished=0|1` → `false|true`

---

### 3) Detail Buku — `GET /books/{bookId}`

**200:**

```json
{
  "status": "success",
  "data": {
    "book": {
      "id": "aWZB...",
      "name": "Buku A",
      "year": 2010,
      "author": "John Doe",
      "summary": "Lorem ipsum",
      "publisher": "Dicoding Indonesia",
      "pageCount": 100,
      "readPage": 25,
      "finished": false,
      "reading": false,
      "insertedAt": "2021-03-04T09:11:44.598Z",
      "updatedAt": "2021-03-04T09:11:44.598Z"
    }
  }
}
```

**404 (tidak ditemukan):**

```json
{ "status": "fail", "message": "Buku tidak ditemukan" }
```

---

### 4) Perbarui Buku — `PUT /books/{bookId}`

**Body (JSON):** sama seperti `POST /books`.
**200:**

```json
{ "status": "success", "message": "Buku berhasil diperbarui" }
```

**400 (tanpa `name`):**

```json
{ "status": "fail", "message": "Gagal memperbarui buku. Mohon isi nama buku" }
```

**400 (`readPage` > `pageCount`):**

```json
{
  "status": "fail",
  "message": "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
}
```

**404 (id tidak ditemukan):**

```json
{ "status": "fail", "message": "Gagal memperbarui buku. Id tidak ditemukan" }
```

---

### 5) Hapus Buku — `DELETE /books/{bookId}`

**200:**

```json
{ "status": "success", "message": "Buku berhasil dihapus" }
```

**404 (id tidak ditemukan):**

```json
{ "status": "fail", "message": "Buku gagal dihapus. Id tidak ditemukan" }
```

## 🧪 Pengujian (Postman & Newman)

### A. Postman (manual)

1. Import **Postman Collection** & **Environment** milik tugas Bookshelf API.
2. Set environment: `port = 9000`, `baseUrl = http://localhost:9000` (atau sesuai koleksinya).
3. Jalankan request berurutan sesuai koleksi `[Mandatory]` hingga lulus semua.

### B. Newman (otomatis, opsional)

Simpan file koleksi & environment, lalu:

```bash
# contoh nama file, sesuaikan dengan punyamu
newman run "Bookshelf API Test.postman_collection.json" \
  -e "Bookshelf API Test.postman_environment.json" \
  --reporters cli
```

> **Tips:** mulai dari server kosong (restart) sebelum menjalankan seluruh tes agar jumlah item pada `GET /books` sesuai ekspektasi test runner.

## ✅ Submission Checklist

- [x] Port **9000** (lokal).
- [x] Jalankan dengan `npm run start` (tanpa nodemon).
- [x] **Tanpa database** dan **tanpa file JSON** (in-memory array).
- [x] Framework **Hapi** (boleh Express, tapi proyek ini pakai Hapi).
- [x] Respons & **pesan error persis** seperti spesifikasi.
- [x] Lulus seluruh pengujian **\[Mandatory]** di Postman.

## 🧩 Contoh cURL Singkat

```bash
# Tambah buku
curl -X POST http://localhost:9000/books \
  -H "Content-Type: application/json" \
  -d '{"name":"Buku A","year":2010,"author":"John Doe","summary":"Lorem ipsum","publisher":"Dicoding Indonesia","pageCount":100,"readPage":25,"reading":false}'

# Daftar buku
curl http://localhost:9000/books

# Detail buku
curl http://localhost:9000/books/<bookId>

# Perbarui buku
curl -X PUT http://localhost:9000/books/<bookId> \
  -H "Content-Type: application/json" \
  -d '{"name":"Buku A Revisi","year":2011,"author":"Jane Doe","summary":"Dolor","publisher":"Dicoding","pageCount":200,"readPage":26,"reading":false}'

# Hapus buku
curl -X DELETE http://localhost:9000/books/<bookId>
```

---

## ☁️ (Opsional) Deployment ke Vercel

> **Tidak digunakan untuk submission.**
> Jika ingin demo online: buat `vercel.json` dan `api/index.js` (serverless) yang meneruskan `req/res` ke `server.listener` Hapi, tanpa `server.start()`. Jalankan `vercel --prod`. Endpoint tetap sama (`/books`, dll).

---

## 📝 Lisensi

Proyek edukasi untuk memenuhi tugas **Bookshelf API**. Silakan gunakan sebagai referensi belajar.
