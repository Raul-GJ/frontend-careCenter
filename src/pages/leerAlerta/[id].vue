<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useLoadingStore } from '@/stores/loadingStore'
import { obtenerAlerta } from '@/services/apiAlertas'

const route = useRoute()
const loadingStore = useLoadingStore()

const alerta = ref(null)
const error = ref(null)

async function fetchAlerta() {
  loadingStore.start()
  error.value = null
  try {
    const id = route.params.id
    const response = await obtenerAlerta(id)
    if (!response || response.status !== 200 || !response.data) {
      error.value = 'No se encontró la alerta'
      alerta.value = null
      return
    }
    alerta.value = response.data
  } catch (error) {
    error.value = 'Error al cargar la alerta'
    alerta.value = null
  } finally {
    loadingStore.stop()
  }
}

onMounted(fetchAlerta)
</script>

<template>
  <v-container>
    <div v-if="error">
      <h2>{{ error }}</h2>
    </div>
    <div v-else-if="alerta">
      <h1>{{ alerta.asunto }}</h1>
      <p><strong>Fecha:</strong> {{ new Date(alerta.fecha).toLocaleString() }}</p>
      <v-card class="mt-4">
        <v-card-text>
          {{ alerta.mensaje }}
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>
