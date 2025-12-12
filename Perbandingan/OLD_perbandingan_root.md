# PERBEDAAN APLIKASI 2A (Baseline) DAN 2B (Optimized)

## 1. Perubahan Pada `src/router/index.js`

### 2A – Baseline (Tanpa Lazy Loading)

```js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

import Dashboard from '../pages/Dashboard.vue'

import ProductList from '../pages/ProductList.vue'
import ProductAdd from '../pages/ProductAdd.vue'
import ProductEdit from '../pages/ProductEdit.vue'

import OrderList from '../pages/OrderList.vue'
import OrderAdd from '../pages/OrderAdd.vue'
import OrderDetail from '../pages/OrderDetail.vue'

import CustomerList from '../pages/CustomerList.vue'
import CustomerAdd from '../pages/CustomerAdd.vue'
import CustomerEdit from '../pages/CustomerEdit.vue'

import Analytics from '../pages/Analytics.vue'
import Settings from '../pages/Settings.vue'
import Login from '../pages/auth/Login.vue'

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },

  { path: '/products', name: 'ProductList', component: ProductList },
  { path: '/products/add', name: 'ProductAdd', component: ProductAdd },
  { path: '/products/edit/:id', name: 'ProductEdit', component: ProductEdit, props: true },

  { path: '/orders', name: 'OrderList', component: OrderList },
  { path: '/orders/add', name: 'OrderAdd', component: OrderAdd },
  { path: '/orders/:id', name: 'OrderDetail', component: OrderDetail, props: true },

  { path: '/customers', name: 'CustomerList', component: CustomerList },
  { path: '/customers/add', name: 'CustomerAdd', component: CustomerAdd },
  { path: '/customers/edit/:id', name: 'CustomerEdit', component: CustomerEdit, props: true },

  { path: '/analytics', name: 'Analytics', component: Analytics },
  { path: '/settings', name: 'Settings', component: Settings },
  { path: '/login', name: 'Login', component: Login },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
```

### Penjelasan
- Semua halaman di-import langsung, tidak ada pemecahan chunk.
- Bundle awal besar karena seluruh halaman dimuat di awal.
- Tidak ada optimasi performa.

---

### 2B – Optimized (Full Lazy Loading)

```js
import { createRouter, createWebHistory } from 'vue-router'

const Dashboard = () => import('../pages/Dashboard.vue')

const ProductList  = () => import('../pages/ProductList.vue')
const ProductAdd   = () => import('../pages/ProductAdd.vue')
const ProductEdit  = () => import('../pages/ProductEdit.vue')

const OrderAdd     = () => import('../pages/OrderAdd.vue')
const OrderList    = () => import('../pages/OrderList.vue')
const OrderDetail  = () => import('../pages/OrderDetail.vue')

const CustomerList = () => import('../pages/CustomerList.vue')
const CustomerAdd  = () => import('../pages/CustomerAdd.vue')
const CustomerEdit = () => import('../pages/CustomerEdit.vue')

const Analytics    = () => import('../pages/Analytics.vue')
const Settings     = () => import('../pages/Settings.vue')
const Login        = () => import('../pages/auth/Login.vue')

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },

  { path: '/products', name: 'ProductList', component: ProductList },
  { path: '/products/add', name: 'ProductAdd', component: ProductAdd },
  { path: '/products/edit/:id', name: 'ProductEdit', props: true, component: ProductEdit },

  { path: '/orders', name: 'OrderList', component: OrderList },
  { path: '/orders/add', name: 'OrderAdd', component: OrderAdd },
  { path: '/orders/:id', name: 'OrderDetail', props: true, component: OrderDetail },

  { path: '/customers', name: 'CustomerList', component: CustomerList },
  { path: '/customers/add', name: 'CustomerAdd', component: CustomerAdd },
  { path: '/customers/edit/:id', name: 'CustomerEdit', props: true, component: CustomerEdit },

  { path: '/analytics', name: 'Analytics', component: Analytics },
  { path: '/settings', name: 'Settings', component: Settings },
  { path: '/login', name: 'Login', component: Login },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
```

### Penjelasan Perubahan
- Semua halaman dimuat menggunakan dynamic import.
- Masing-masing halaman menjadi chunk terpisah.
- Initial bundle jauh lebih kecil.
- Waktu loading halaman menjadi lebih cepat.

---

## 2. Perubahan Pada `src/App.vue`

### 2A – Baseline

```vue
<template>
  <!-- layout + sidebar + header -->
  <RouterView />
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from './stores/authStore'

const isSidebarCollapsed = ref(false)
const toggleSidebar = () => isSidebarCollapsed.value = !isSidebarCollapsed.value
</script>
```

### Penjelasan
- Komponen sidebar dan layout dimuat langsung.
- Tidak ada async component.
- Semua elemen UI masuk dalam initial bundle.

---

### 2B – Optimized (Async Component + Suspense)

```vue
<script setup>
import { defineAsyncComponent } from 'vue'

const LineChart = defineAsyncComponent(() =>
  import("../components/charts/Linechart.vue")
)
</script>
```

### Penjelasan Perubahan
- Komponen berat seperti Chart dipisahkan menggunakan async component.
- Mendukung `<Suspense>` dan skeleton loader.
- Mengurangi ukuran initial bundle.

---

## 3. Perubahan Pada `src/pages/Dashboard.vue`

### 2A – Baseline (Import biasa)

```js
import LineChart from "../components/charts/LineChart.vue"
import BarChart from "../components/charts/BarChart.vue"
import PieChart from "../components/charts/PieChart.vue"
```

### Penjelasan
- Chart.js adalah library besar.
- Meng-import secara langsung membuat bundle utama membesar.

---

### 2B – Optimized (Async Component + Prefetch)

```js
import { defineAsyncComponent } from 'vue'

const LineChart = defineAsyncComponent(() =>
  import("../components/charts/Linechart.vue")
)

const BarChart = defineAsyncComponent(() =>
  import("../components/charts/Barchart.vue")
)

const PieChart = defineAsyncComponent(() =>
  import("../components/charts/PieChart.vue")
)
```

### Penjelasan Perubahan
- Chart.js dipisah menjadi chunk sendiri.
- Dashboard melakukan prefetch halaman ProductList dan OrderList.

---

## 4. Perubahan Pada `vite.config.js`

### 2A – Baseline

```js
plugins: [
  vue(),
  visualizer({
    filename: 'stats.html',
    template: 'treemap',
    gzipSize: true,
    brotliSize: true,
  }),
]
```

---

### 2B – Optimized

```js
plugins: [
  vue(),
  visualizer({
    filename: 'dist/stats.html',
    template: 'treemap',
    gzipSize: true,
    brotliSize: true,
  }),
  viteCompression({
    algorithm: 'gzip',
    ext: '.gz',
  }),
],
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'vue-vendor': ['vue', 'vue-router'],
        'element-plus-vendor': ['element-plus'],
        'chart-vendor': ['chart.js', 'vue-chartjs'],
        product: [...],
        order: [...],
      }
    }
  }
}
```

### Penjelasan
- Menggunakan gzip compression.
- Manual chunking memecah vendor besar.
- Bundle lebih kecil dan modular.

---

## 5. Tabel Ringkasan Perubahan

| Bagian | 2A (Baseline) | 2B (Optimized) |
|--------|---------------|----------------|
| Routing | Import langsung | Lazy loading |
| Chart | Import langsung | Async component |
| Prefetch | Tidak ada | Ada |
| manualChunks | Tidak ada | Ada |
| Gzip | Tidak ada | Ada |
| Struktur bundle | Monolitik | Modular |
| Initial load | Lambat | Lebih cepat |

---

## 6. Kesimpulan

Versi **2B (Optimized)** memberikan peningkatan signifikan melalui lazy loading, async component, manual chunking, prefetching, serta gzip compression. Bundle size menjadi jauh lebih kecil, waktu muat lebih cepat, dan struktur kode lebih scalable.

