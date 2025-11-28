import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'

// =========================
//   VITE CONFIG – OPTIMIZED
// =========================
export default defineConfig({
  plugins: [
    vue(),

    // 🔍 Bundle Visualizer
    visualizer({
      filename: 'dist/stats.html',
      template: 'treemap',
      gzipSize: true,
      brotliSize: true,
      open: false, // buka manual
    }),

    // 🔥 Gzip Compression Output
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      deleteOriginFile: false,
    }),
  ],

  // ⚡ Optimize chunks secara custom
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // ================================
          //           VENDOR CHUNKS
          // ================================
          'vue-vendor': ['vue', 'vue-router'],
          'pinia-vendor': ['pinia'],
          'element-plus-vendor': ['element-plus'],
          'chart-vendor': ['chart.js', 'vue-chartjs'],

          // ================================
          //         FEATURE CHUNKING
          // ================================
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

  // ================================
  //      DEV PROXY (Local Only)
  // ================================
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
