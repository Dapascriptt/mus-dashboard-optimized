<template>
  <div
    class="w-full max-w-md bg-slate-900/95 border border-slate-800 rounded-xl p-8 shadow-xl"
  >
    <h1 class="text-2xl font-bold mb-4">Daftar Akun</h1>

    <p class="text-slate-300 text-sm mb-6 leading-relaxed">
      Daftarkan akun baru untuk mengakses <span class="text-slate-100 font-semibold">Mus-Dashboard</span>.
    </p>

    <div class="space-y-4">
      <div>
        <label class="block text-sm mb-1 text-slate-200">Nama Lengkap</label>
        <input
          v-model="form.name"
          class="w-full px-3 py-2 rounded-md bg-slate-800 border border-slate-700
                 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                 focus:border-blue-500"
          placeholder="Nama Lengkap"
        />
      </div>

      <div>
        <label class="block text-sm mb-1 text-slate-200">Username</label>
        <input
          v-model="form.username"
          class="w-full px-3 py-2 rounded-md bg-slate-800 border border-slate-700
                 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                 focus:border-blue-500"
          placeholder="Username"
        />
      </div>

      <div>
        <label class="block text-sm mb-1 text-slate-200">Password</label>
        <input
          type="password"
          v-model="form.password"
          class="w-full px-3 py-2 rounded-md bg-slate-800 border border-slate-700
                 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                 focus:border-blue-500"
          placeholder="Password"
        />
      </div>

      <div v-if="authStore.lastError" class="text-red-400 text-sm">
        {{ authStore.lastError }}
      </div>

      <button
        @click="handleRegister"
        :disabled="authStore.loading"
        class="w-full py-2.5 rounded-md bg-green-600 hover:bg-green-700
               disabled:opacity-60 disabled:cursor-not-allowed
               text-sm font-semibold tracking-wide transition-colors"
      >
        <span v-if="authStore.loading">Sedang mendaftar...</span>
        <span v-else>Daftar</span>
      </button>

      <div class="text-center text-sm text-slate-400 mt-4">
        Sudah punya akun?
        <router-link to="/login" class="text-blue-400 hover:text-blue-300 transition-colors">
          Masuk disini
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/authStore";
import { ElMessage } from "element-plus";

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  name: "",
  username: "",
  password: "",
});

const handleRegister = async () => {
  if (!form.name || !form.username || !form.password) {
    ElMessage.warning("Semua kolom harus diisi");
    return;
  }

  const success = await authStore.register(form.name, form.username, form.password);

  if (success) {
    ElMessage.success("Registrasi berhasil! Silakan login.");
    router.push("/login");
  }
};
</script>
