<template>
  <div class="space-y-4 text-white">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div>
        <h1 class="text-2xl font-semibold mb-1">Customer List</h1>
      </div>

      <div class="flex items-center gap-3">
        <router-link to="/customers/add">
          <el-button type="primary">+ Add Customer</el-button>
        </router-link>
      </div>
    </div>

    <!-- Error -->
    <div v-if="error" class="text-sm text-red-400">
      {{ error }}
    </div>

    <!-- TABEL: Async + Suspense + Skeleton -->
    <Suspense>
      <template #default>
        <AsyncDataTable
          title="Customers"
          subtitle="Menampilkan daftar customer dengan pencarian, sort, dan pagination"
          :data="customers"
          :columns="columns"
          :loading="loading"
          row-key="_id"
          :page-size="10"
          searchable
          search-placeholder="Cari nama / email / phone..."
        >
          <!-- Custom cell: Address -->
          <template #address="{ value }">
            <span class="text-slate-300">{{ value }}</span>
          </template>

          <!-- Custom cell: Created -->
          <template #createdAt="{ value }">
            {{ formatDate(value) }}
          </template>

          <!-- Custom cell: Actions -->
          <template #actions="{ row }">
            <div class="text-right space-x-2">
              <router-link :to="`/customers/edit/${getId(row)}`">
                <el-button type="primary" size="small">Edit</el-button>
              </router-link>

              <el-button size="small" type="danger" @click="handleDelete(row)">
                Delete
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
          title="Delete Customer"
          width="400px"
          @close="showDeleteModal = false"
        >
          <span>
            Hapus customer
            <strong>{{ deleteTargetName || 'ini' }}</strong>?
          </span>

          <template #footer>
            <el-button @click="showDeleteModal = false">Cancel</el-button>
            <el-button type="danger" :loading="deleting" @click="confirmDelete">
              Delete
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
import { useCustomerStore } from '../stores/customerStore'
import { deleteCustomer } from '../services/CustomerService'
import { ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'

// 🔥 Heavy DataTable jadi async component
const AsyncDataTable = defineAsyncComponent(() =>
  import('../components/BaseDataTable.vue')
)
const AsyncModal = defineAsyncComponent(() =>
  import('../components/BaseModal.vue')
)

const customerStore = useCustomerStore()
const { customers, loading, error } = storeToRefs(customerStore)

onMounted(() => {
  customerStore.fetchCustomers()
})

const showDeleteModal = ref(false)
const deleting = ref(false)
const deleteId = ref(null)
const deleteTargetName = ref('')

// Helpers
const getId = (c) => c._id || c.id
const formatDate = (v) => (v ? new Date(v).toLocaleString('id-ID') : '-')

// BaseDataTable column schema
const columns = [
  { label: 'Name', key: 'name', sortable: true, searchable: true },
  { label: 'Email', key: 'email', sortable: true, searchable: true },
  { label: 'Phone', key: 'phone', sortable: true, searchable: true },
  {
    label: 'Address',
    key: 'address',
    sortable: false,
    searchable: true,
    cellClass: 'text-slate-300',
  },
  { label: 'Created', key: 'createdAt', sortable: true },
  {
    label: 'Actions',
    key: 'actions',
    sortable: false,
    searchable: false,
    cellClass: 'text-right w-44',
  },
]

// DELETE
const handleDelete = (customer) => {
  deleteId.value = getId(customer)
  deleteTargetName.value = customer.name || ''
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!deleteId.value) return
  deleting.value = true
  try {
    await deleteCustomer(deleteId.value)
    await customerStore.fetchCustomers()
    ElMessage.success('Customer berhasil dihapus!')
    showDeleteModal.value = false
    deleteId.value = null
    deleteTargetName.value = ''
  } catch (err) {
    // bisa tampilkan pesan jika perlu
  } finally {
    deleting.value = false
  }
}
</script>
