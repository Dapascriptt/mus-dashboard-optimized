import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    vue(),
    visualizer({
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
      open: false, // nanti kamu bisa buka manual
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
          // 🔹 vendor chunks
          'vue-vendor': ['vue', 'vue-router'],
          'pinia-vendor': ['pinia'],
          'element-plus-vendor': ['element-plus'],
          'chart-vendor': ['chart.js', 'vue-chartjs'],

          // 🔹 feature / module chunks
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
          analytics: [
            './src/pages/Analytics.vue',
          ],
          // kalau ada halaman lain (Customer, Settings, dll) bisa ditambah di sini
        },
      },
    },
  },
})
