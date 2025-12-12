<!-- src/pages/ProductAdd.vue -->
<template>
  <div class="space-y-4 text-white">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold mb-1">Tambah Produk</h1>
        <p class="text-xs text-slate-400">
          Tambahkan produk baru ke sistem.
        </p>
      </div>

      <el-button @click="goBack">Kembali</el-button>
    </div>

    <div v-if="error" class="text-sm text-red-400">
      {{ error }}
    </div>

    <BaseForm
      title="Informasi Produk"
      subtitle="Lengkapi data produk di bawah ini."
      :schema="formSchema"
      :model="form"
      submit-label="Simpan Produk"
      :loading="submitting"
      @submit="handleSubmit"
      @cancel="goBack"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseForm from '../components/BaseForm.vue'
import { createProduct } from '../services/ProductService'

const router = useRouter()

const form = ref({
  name: '',
  sku: '',
  price: null,
  stock: null,
  category: '',
  status: 'active'
})

const formSchema = [
  { label: 'Nama Produk', prop: 'name', type: 'text', placeholder: 'Masukkan nama produk' },
  { label: 'SKU', prop: 'sku', type: 'text', placeholder: 'Masukkan SKU produk' },
  { label: 'Harga', prop: 'price', type: 'number', min: 0 },
  { label: 'Stok', prop: 'stock', type: 'number', min: 0 },
  { label: 'Kategori', prop: 'category', type: 'text', placeholder: 'Masukkan kategori' },
  {
    label: 'Status',
    prop: 'status',
    type: 'select',
    placeholder: 'Pilih status',
    options: [
      { label: 'Aktif', value: 'active' },
      { label: 'Tidak Aktif', value: 'inactive' }
    ]
  }
]

const submitting = ref(false)
const error = ref('')

const goBack = () => {
  router.push('/products')
}

const handleSubmit = async () => {
  submitting.value = true
  error.value = ''
  try {
    await createProduct(form.value)
    router.push('/products')
  } catch (err) {
    console.error(err)
    error.value = 'Gagal menyimpan produk.'
  } finally {
    submitting.value = false
  }
}
</script>
