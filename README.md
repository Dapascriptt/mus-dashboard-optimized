# Mus-Dashboard Optimized

Dashboard aplikasi manajemen toko dengan arsitektur modular dan optimasi performa tinggi.

---

## 📋 Daftar Isi

- [Prasyarat](#-prasyarat)
- [Instalasi](#-instalasi)
- [Menjalankan Aplikasi](#-menjalankan-aplikasi)
- [Struktur Project](#-struktur-project)
- [Teknologi](#-teknologi)
- [Fitur Optimasi](#-fitur-optimasi)

---

## 🔧 Prasyarat

Pastikan sudah terinstall di komputer Anda:

- **Node.js** versi 18 atau lebih baru ([Download](https://nodejs.org/))
- **npm** (otomatis terinstall bersama Node.js)
- **MongoDB** (lokal atau MongoDB Atlas)
- **Git** ([Download](https://git-scm.com/))

---

## 📦 Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/username/mus-dashboard-optimized.git
cd mus-dashboard-optimized
```

### 2. Setup Backend

```bash
cd mus-dashboard-backend
npm install
```

**Konfigurasi Environment Variables:**

Buat file `.env` di folder `mus-dashboard-backend` dengan isi:

```env
# Database
MONGODB_URI=mongodb://localhost:27017
MONGODB_DBNAME=mus-dashboard

# JWT Secret (ganti dengan string random yang aman)
JWT_SECRET=your-super-secret-jwt-key-here

# Default Admin (opsional, akan dibuat otomatis jika belum ada)
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=admin123
DEFAULT_ADMIN_NAME=Admin
```

> **Catatan:** Jika menggunakan MongoDB Atlas, ganti `MONGODB_URI` dengan connection string dari Atlas.

### 3. Setup Frontend

```bash
cd ../mus-dashboard-frontend
npm install
```

---

## 🚀 Menjalankan Aplikasi

### Opsi 1: Menjalankan Backend dan Frontend Secara Terpisah (Recommended)

**Terminal 1 - Backend:**
```bash
cd mus-dashboard-backend
node server.js
```
Backend akan berjalan di: `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd mus-dashboard-frontend
npm run dev
```
Frontend akan berjalan di: `http://localhost:5173`

### Opsi 2: Menjalankan dengan Concurrently (Opsional)

Jika ingin menjalankan keduanya dalam satu terminal, install `concurrently` di root:

```bash
npm install -g concurrently
```

Lalu buat script di `package.json` root atau jalankan:

```bash
concurrently "cd mus-dashboard-backend && node server.js" "cd mus-dashboard-frontend && npm run dev"
```

---

## 🗂️ Struktur Project

```
mus-dashboard-optimized/
├── mus-dashboard-backend/       # Backend API (Express + MongoDB)
│   ├── models/                  # Mongoose models
│   ├── netlify/functions/       # Serverless functions (untuk deploy)
│   ├── app.js                   # Konfigurasi Express
│   ├── server.js                # Entry point server
│   └── .env                     # Environment variables (JANGAN di-commit!)
│
├── mus-dashboard-frontend/      # Frontend (Vue 3 + Vite)
│   ├── src/
│   │   ├── components/          # Komponen reusable
│   │   ├── pages/               # Halaman aplikasi
│   │   ├── stores/              # Pinia stores (state management)
│   │   ├── services/            # API services
│   │   └── router/              # Vue Router config
│   ├── vite.config.js           # Konfigurasi Vite (optimasi)
│   └── package.json
│
├── Perbandingan/                # Dokumentasi hasil pengujian
├── LAPORAN_OPTIMASI_FINAL.md    # Laporan teknis optimasi
├── netlify.toml                 # Konfigurasi deployment Netlify
└── README.md                    # Dokumentasi ini
```

---

## 🛠️ Teknologi

### Backend
- **Node.js** + **Express.js** - REST API
- **MongoDB** + **Mongoose** - Database
- **JWT** - Authentication
- **Bcryptjs** - Password hashing

### Frontend
- **Vue 3** - Framework JavaScript
- **Vite** - Build tool & dev server
- **Pinia** - State management
- **Vue Router 4** - Routing
- **Element Plus** - UI component library
- **Tailwind CSS** - Utility-first CSS
- **Chart.js** - Data visualization

---

## ⚡ Fitur Optimasi

Aplikasi ini menerapkan teknik optimasi modern:

1. **Lazy Loading** - Halaman dimuat on-demand
2. **Code Splitting** - Bundle dipecah menjadi chunk kecil
3. **Async Components** - Komponen berat (chart) dimuat terpisah
4. **Tree Shaking** - Menghilangkan kode yang tidak terpakai
5. **Gzip Compression** - Mengurangi ukuran transfer file
6. **Manual Chunking** - Vendor library dipisah dari kode aplikasi

**Hasil:**
- ✅ FCP (First Contentful Paint): **0.6 detik** (40% lebih cepat)
- ✅ TBT (Total Blocking Time): **0 ms** (zero blocking)
- ✅ Performa 4G: Lebih stabil dan konsisten

Detail lengkap ada di [LAPORAN_OPTIMASI_FINAL.md](./LAPORAN_OPTIMASI_FINAL.md)

---

## 🔐 Login Default

Setelah backend berjalan pertama kali, akun admin akan dibuat otomatis:

- **Username:** `admin`
- **Password:** `admin123`

> **Penting:** Segera ganti password setelah login pertama kali!

---

## 📝 Catatan Penting

1. **Database Kosong:** Saat pertama kali run, database akan kosong. Gunakan fitur "Tambah" untuk menambahkan data produk, customer, dan order.

2. **Port Conflict:** Jika port 5000 atau 5173 sudah digunakan, Vite/Express akan otomatis mencari port lain. Perhatikan output di terminal.

3. **CORS:** Backend sudah dikonfigurasi untuk menerima request dari `http://localhost:5173`. Jika frontend berjalan di port lain, update `app.js`.

---

## 🐛 Troubleshooting

### Backend tidak bisa connect ke MongoDB
- Pastikan MongoDB service sudah running
- Cek `MONGODB_URI` di file `.env`
- Untuk MongoDB Atlas, pastikan IP address sudah di-whitelist

### Frontend tidak bisa fetch data
- Pastikan backend sudah running di `http://localhost:5000`
- Cek Network tab di browser DevTools untuk melihat error detail
- Pastikan tidak ada CORS error

### Build error saat `npm run build`
- Hapus folder `node_modules` dan `package-lock.json`
- Jalankan `npm install` ulang
- Pastikan Node.js versi 18+

---

## 📄 License

MIT License - Silakan digunakan untuk keperluan pembelajaran dan pengembangan.

---

**Dibuat dengan ❤️ untuk optimasi performa maksimal**
