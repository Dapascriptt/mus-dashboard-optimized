<!-- src/pages/ProductList.vue -->
<template>
  <div class="space-y-4 text-white">
    <!-- Header atas -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold mb-1">Daftar Produk</h1>
      </div>

      <router-link to="/products/add">
        <el-button type="primary">+ Tambah Produk</el-button>
      </router-link>
    </div>

    <!-- Info / Error -->
    <div v-if="error" class="mb-2 text-sm text-red-400">
      {{ error }}
    </div>

    <!-- DataTable async + Suspense + skeleton -->
    <Suspense>
      <template #default>
        <AsyncDataTable
          title="Produk"
          subtitle="Menampilkan data produk dengan pencarian, sort, dan pagination"
          :columns="columns"
          :data="products"
          :loading="loading"
          row-key="_id"
          :page-size="10"
          searchable
          search-placeholder="Cari nama / SKU / kategori / status..."
        >
          <!-- price -->
          <template #price="{ value }">
            {{ formatPrice(value) }}
          </template>

          <!-- status -->
          <template #status="{ value }">
            <span
              class="px-2 py-0.5 rounded-full text-xs font-medium"
              :class="
                value === 'active'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-600/20 text-slate-300 border border-slate-600/40'
              "
            >
              {{ value }}
            </span>
          </template>

          <!-- actions -->
          <template #actions="{ row }">
            <div class="flex justify-end gap-2">
              <router-link :to="`/products/edit/${row._id}`">
                <el-button type="primary" size="small">
                  Edit
                </el-button>
              </router-link>

              <el-button
                type="danger"
                size="small"
                @click="onDelete(row._id)"
              >
                Delete
              </el-button>
            </div>
          </template>
        </AsyncDataTable>
      </template>

      <!-- skeleton saat DataTable masih diload -->
      <template #fallback>
        <el-skeleton animated :rows="5" />
      </template>
    </Suspense>

    <!--  Modal async + Suspense + Skeleton -->
<Suspense>
  <template #default>
    <AsyncModal
      v-model="showDeleteModal"
      title="Hapus Produk"
      width="400px"
      @close="showDeleteModal = false"
    >
      <span>Yakin ingin menghapus produk ini?</span>

      <template #footer>
        <el-button @click="showDeleteModal = false">Batal</el-button>
        <el-button type="danger" :loading="deleting" @click="handleDelete">
          Hapus
        </el-button>
      </template>
    </AsyncModal>
  </template>

  <!-- Skeleton selama BaseModal.vue diload -->
  <template #fallback>
    <el-skeleton animated :rows="3" />
  </template>
</Suspense>

  </div>
</template>

<script setup>
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { getProducts, deleteProduct } from '../services/ProductService'



const AsyncDataTable = defineAsyncComponent(() =>
  import('../components/BaseDataTable.vue')
)

const AsyncModal = defineAsyncComponent(() =>
  import('../components/BaseModal.vue')
)
const products = ref([])
const loading = ref(false)
const deleting = ref(false)
const error = ref('')
const showDeleteModal = ref(false)
const deleteId = ref(null)

// definisi kolom (sort otomatis by key)
const columns = [
  { label: 'Nama Produk', key: 'name', sortable: true },
  { label: 'SKU', key: 'sku', sortable: true },
  { label: 'Harga', key: 'price', sortable: true, cellClass: 'text-right' },
  { label: 'Stok', key: 'stock', sortable: true },
  { label: 'Kategori', key: 'category', sortable: true },
  { label: 'Status', key: 'status', sortable: true },
  { label: 'Aksi', key: 'actions', sortable: false, cellClass: 'text-right w-40' },
]

// ambil data produk
const fetchProducts = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await getProducts()
    products.value = res.data
  } catch (err) {
    console.error(err)
    error.value = 'Gagal memuat data produk.'
  } finally {
    loading.value = false
  }
}

// onMounted: fetch data + prefetch ProductAdd 
onMounted(() => {
  fetchProducts()
  import('../pages/ProductAdd.vue')
})

const formatPrice = (value) => {
  const num = Number(value)
  if (Number.isNaN(num)) return '-'
  return 'Rp ' + num.toLocaleString('id-ID')
}

const onDelete = (id) => {
  deleteId.value = id
  showDeleteModal.value = true
}

const handleDelete = async () => {
  if (!deleteId.value) return
  deleting.value = true
  try {
    await deleteProduct(deleteId.value)
    showDeleteModal.value = false
    deleteId.value = null
    await fetchProducts()
  } catch (err) {
    console.error(err)
    error.value = 'Gagal menghapus produk.'
  } finally {
    deleting.value = false
  }
}
</script>
