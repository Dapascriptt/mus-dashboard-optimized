md
# Perbandingan Bundle 2A (Baseline) dan 2B (Optimized)

Dokumen ini membandingkan hasil build dan konfigurasi antara versi **2A (Baseline)** dan **2B (Optimized)** dari aplikasi Mus Store Dashboard.  
Fokus utama perbandingan mencakup *bundle size*, *struktur chunk*, serta teknik optimasi build yang diterapkan.

---

## 1. Vite Configuration

### 2A – Baseline
```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    vue(),
    visualizer({
      filename: 'stats.html',
      template: 'treemap',
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
```

### 2B – Optimized
```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    vue(),
    visualizer({
      filename: 'dist/stats.html',
      template: 'treemap',
      gzipSize: true,
      brotliSize: true,
      open: false,
    }),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      deleteOriginFile: false,
    }),
  ],

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router'],
          'pinia-vendor': ['pinia'],
          'element-plus-vendor': ['element-plus'],
          'chart-vendor': ['chart.js', 'vue-chartjs'],

          product: [
            './src/pages/ProductList.vue',
            './src/pages/ProductAdd.vue',
            './src/pages/ProductEdit.vue',
          ],
          order: [
            './src/pages/OrderList.vue',
            './src/pages/OrderDetail.vue',
            './src/pages/OrderAdd.vue',
          ],
          analytics: ['./src/pages/Analytics.vue'],
          customer: ['./src/pages/CustomerList.vue'],
          settings: ['./src/pages/Settings.vue'],
        },
      },
    },
  },

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
```

---

## 2. Perbedaan Teknik Optimasi

### 2A – Baseline
- Tidak menggunakan lazy loading.
- Tidak ada manualChunks.
- Tidak menggunakan gzip compression.
- Chart component di-import langsung.
- Struktur bundle masih satuan (monolitik).

### 2B – Optimized
- Lazy loading pada semua route.
- Chart component diubah menjadi async component dan dibungkus `<Suspense>`.
- Menggunakan manualChunks sehingga vendor dipisah.
- Menggunakan gzip compression untuk memperkecil ukuran final build.
- Dashboard melakukan prefetch halaman lain.
- Struktur build lebih modular dan efisien.

---

## 3. Hasil Visualisasi Bundle (stats.html)

### 2A – Baseline
File: `stats2a.html`  
Ciri-ciri:
- Bundle masih satu file besar.
- Library seperti Element Plus dan Chart.js mendominasi.
- Tidak ada pemisahan vendor.

### 2B – Optimized
File: `stats2b.html`  
Ciri-ciri:
- Struktur bundle lebih modular.
- Vendor library dipisah menjadi beberapa chunk.
- Bundle utama jauh lebih kecil.

---

## 4. Ringkasan Perbandingan Bundle

| Aspek                             | 2A (Baseline) | 2B (Optimized) |
|----------------------------------|---------------|----------------|
| Lazy Loading                     | Tidak         | Ya             |
| Async Chart Component            | Tidak         | Ya             |
| Manual Chunking                  | Tidak         | Ya             |
| Gzip Compression                 | Tidak         | Ya             |
| Prefetch                         | Tidak         | Ya             |
| Struktur Bundle                  | Monolitik     | Modular        |
| Ukuran Bundle                    | Lebih besar   | Lebih kecil    |
| Waktu Load                       | Lebih lambat  | Lebih cepat    |

---

## 5. Kesimpulan

Versi **2B (Optimized)** memberikan peningkatan signifikan dibandingkan **2A (Baseline)**.  
Ukuran bundle lebih kecil, waktu loading lebih cepat, dan struktur modul lebih baik untuk caching.  
Konfigurasi tambahan seperti lazy loading, async component, manual chunking, dan gzip compression membuat versi 2B lebih efisien dan direkomendasikan untuk deployment produksi.

---

