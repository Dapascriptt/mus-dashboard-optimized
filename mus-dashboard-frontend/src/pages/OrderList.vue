<template>
  <div class="space-y-4 text-white">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div>
        <h1 class="text-2xl font-semibold mb-1">Daftar Pesanan</h1>
      </div>

      <router-link to="/orders/add">
        <el-button type="primary">+ Tambah Pesanan</el-button>
      </router-link>
    </div>

    <!-- Error -->
    <div v-if="error" class="text-sm text-red-400">
      {{ error }}
    </div>

    <!-- TABEL: Async + Suspense + Skeleton -->
    <Suspense>
      <template #default>
        <AsyncDataTable
          title="Pesanan"
          subtitle="Menampilkan daftar pesanan dengan search, sort, dan pagination (10/halaman)"
          :columns="columns"
          :data="orders"
          :loading="loading"
          row-key="_id"
          :page-size="10"
          searchable
          search-placeholder="Cari no pesanan / pelanggan / status..."
        >
          <!-- Kolom: Total -->
          <template #totalAmount="{ value }">
            {{ formatPrice(value) }}
          </template>

          <!-- Kolom: Status -->
          <template #status="{ value }">
            <span
              class="px-2 py-0.5 rounded-full text-xs"
              :class="statusClass(value)"
            >
              {{ value }}
            </span>
          </template>

          <!-- Kolom: Created At -->
          <template #createdAt="{ value }">
            {{ formatDate(value) }}
          </template>

          <!-- Kolom: Actions -->
          <template #actions="{ row }">
            <div class="text-right space-x-2">
              <router-link :to="`/orders/${getId(row)}`">
                <el-button size="small" type="primary">Rincian</el-button>
              </router-link>

              <el-button
                size="small"
                type="danger"
                @click="handleDelete(row)"
              >
                Hapus
              </el-button>
            </div>
          </template>
        </AsyncDataTable>
      </template>

      <!-- Skeleton saat DataTable masih loading -->
      <template #fallback>
        <el-skeleton animated :rows="5" />
      </template>
    </Suspense>

    <!-- Modal Delete -->
    <Suspense>
      <template #default>
        <AsyncModal
          v-model="showDeleteModal"
          title="Hapus Pesanan"
          width="400px"
          @close="showDeleteModal = false"
        >
          <span>
            Hapus pesanan
            <strong>{{ deleteTargetName || 'ini' }}</strong>?
          </span>

          <template #footer>
            <el-button @click="showDeleteModal = false">Batal</el-button>
            <el-button type="danger" :loading="deleting" @click="confirmDelete">
              Hapus
            </el-button>
          </template>
        </AsyncModal>
      </template>
      <template #fallback>
        <el-skeleton animated :rows="3" />
      </template>
    </Suspense>
  </div>
</template>

<script setup>
import { onMounted, defineAsyncComponent, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { useOrderStore } from '../stores/orderStore'
import { deleteOrder } from '../services/OrderService'

// =======================
//  ASYNC DATATABLE (2B)
// =======================
const AsyncDataTable = defineAsyncComponent(() =>
  import('../components/BaseDataTable.vue')
)
const AsyncModal = defineAsyncComponent(() =>
  import('../components/BaseModal.vue')
)


const orderStore = useOrderStore()
const { orders, loading, error } = storeToRefs(orderStore)

onMounted(() => {
  orderStore.fetchOrders()

  // === PREFETCH 2B REQUIREMENT ===
  import('../pages/OrderDetail.vue')
})

const showDeleteModal = ref(false)
const deleting = ref(false)
const deleteId = ref(null)
const deleteTargetName = ref('')

// =======================
//  DEFINISI KOLOM TABEL
// =======================
const columns = [
  { label: 'No. Pesanan', key: 'orderNumber', sortable: true },
  { label: 'Pelanggan', key: 'customerName', sortable: true },
  { label: 'Total', key: 'totalAmount', sortable: true, cellClass: 'text-right' },
  { label: 'Status', key: 'status', sortable: true },
  { label: 'Dibuat Pada', key: 'createdAt', sortable: true },
  {
    label: 'Aksi',
    key: 'actions',
    sortable: false,
    searchable: false,
    cellClass: 'text-right w-44'
  }
]

// =======================
//  HELPERS
// =======================
const getId = (o) => o._id || o.id

const formatPrice = (v) => {
  const num = Number(v)
  if (Number.isNaN(num)) return '-'
  return 'Rp ' + num.toLocaleString('id-ID')
}

const formatDate = (v) => {
  if (!v) return '-'
  return new Date(v).toLocaleString('id-ID')
}

const statusClass = (s) =>
  ({
    pending: 'bg-yellow-500/15 text-yellow-300',
    paid: 'bg-emerald-500/15 text-emerald-300',
    shipped: 'bg-sky-500/15 text-sky-300',
    cancelled: 'bg-red-500/15 text-red-300'
  }[s] || 'bg-slate-600/20 text-slate-300')

// =======================
//  DELETE ORDER
// =======================
const handleDelete = (order) => {
  deleteId.value = getId(order)
  deleteTargetName.value = order.orderNumber || ''
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!deleteId.value) return
  deleting.value = true
  try {
    await deleteOrder(deleteId.value)
    await orderStore.fetchOrders()
    ElMessage.success('Order berhasil dihapus!')
    showDeleteModal.value = false
    deleteId.value = null
    deleteTargetName.value = ''
  } catch (err) {
    // bisa tambah pesan error bila diperlukan
  } finally {
    deleting.value = false
  }
}
</script>
