<!-- src/pages/ProductEdit.vue -->
<template>
  <div class="space-y-4 text-white">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold mb-1">Ubah Produk</h1>
        <p class="text-xs text-slate-300">
          Ubah informasi produk.
        </p>
      </div>

      <el-button @click="goBack">Kembali</el-button>
    </div>

    <div v-if="error" class="text-sm text-red-400">
      {{ error }}
    </div>

    <BaseForm
      v-if="loaded"
      title="Informasi Produk"
      subtitle="Perbarui data produk."
      :schema="formSchema"
      :model="form"
      submit-label="Perbarui Produk"
      :loading="submitting"
      @submit="handleSubmit"
      @cancel="goBack"
    />

    <div v-else class="text-xs text-slate-400">
      Memuat data produk...
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import BaseForm from '../components/BaseForm.vue'
import { getProductById, updateProduct } from '../services/ProductService'

const router = useRouter()
const route = useRoute()

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

const loaded = ref(false)
const submitting = ref(false)
const error = ref('')

const id = route.params.id

const fetchProduct = async () => {
  loaded.value = false
  error.value = ''
  try {
    const res = await getProductById(id)
    form.value = {
      name: res.data.name ?? '',
      sku: res.data.sku ?? '',
      price: res.data.price ?? null,
      stock: res.data.stock ?? null,
      category: res.data.category ?? '',
      status: res.data.status ?? 'active'
    }
    loaded.value = true
  } catch (err) {
    console.error(err)
    error.value = 'Gagal memuat data produk.'
  }
}

onMounted(fetchProduct)

const goBack = () => {
  router.push('/products')
}

const handleSubmit = async () => {
  submitting.value = true
  error.value = ''
  try {
    await updateProduct(id, form.value)
    router.push('/products')
  } catch (err) {
    console.error(err)
    error.value = 'Gagal mengupdate produk.'
  } finally {
    submitting.value = false
  }
}
</script>
