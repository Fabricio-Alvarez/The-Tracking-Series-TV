<template>
  <div class="user-login-form">
    <h2>Crear usuario</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="name">Nombre</label>
        <input v-model="name" id="name" type="text" required />
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input v-model="email" id="email" type="email" required />
      </div>
      <button type="submit" :disabled="loading">Crear usuario</button>
      <div v-if="error" class="error">{{ error }}</div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useShowsStore } from '@/stores/shows'

const name = ref('')
const email = ref('')
const loading = ref(false)
const error = ref('')
const showsStore = useShowsStore()

const submitForm = async () => {
  loading.value = true
  error.value = ''
  try {
    await showsStore.loginUser(email.value, name.value)
  } catch (e) {
    error.value = 'Error al crear usuario'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.user-login-form {
  background: #181818;
  padding: 24px;
  border-radius: 8px;
  max-width: 350px;
  margin: 40px auto;
  box-shadow: 0 2px 16px rgba(0,0,0,0.2);
  color: #fff;
}
.form-group {
  margin-bottom: 16px;
}
label {
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
}
input {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #333;
  background: #222;
  color: #fff;
}
button {
  background: #6c7ae0;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
}
button:disabled {
  background: #444;
  cursor: not-allowed;
}
.error {
  color: #ff4444;
  margin-top: 10px;
}
</style> 