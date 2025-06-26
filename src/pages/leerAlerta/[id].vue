<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useLoadingStore } from '@/stores/loadingStore'
import { useAlertaStore } from '@/stores/alertaStore'

const route = useRoute()
const id = route.params.id
const loadingStore = useLoadingStore()
const alertaStore = useAlertaStore()

const alerta = ref(null)
const error = ref(null)

async function load() {
  loadingStore.start()
  alerta.value = await alertaStore.getAlerta(id)
  alertaStore.leerAlerta(id)
  loadingStore.stop()
}

load()
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
