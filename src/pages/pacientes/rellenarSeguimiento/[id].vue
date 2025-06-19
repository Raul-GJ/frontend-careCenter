<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { obtenerPlantilla } from '@/services/apiPlantillas'
import { useLoadingStore } from '@/stores/loadingStore'

const route = useRoute()
const router = useRouter()

const idPlantilla = route.params.id
const plantilla = ref(null)
const respuestas = ref({})
const cargando = ref(true)
const error = ref(null)

async function fetchPlantilla() {
  const loadingStore = useLoadingStore()
  cargando.value = true
  loadingStore.start()
  error.value = null
  try {
    let response = await obtenerPlantilla(idPlantilla)
    if (!response || response.status !== 200 || !response.data) {
      error.value = 'No se encontró la plantilla'
      plantilla.value = null
      return
    }
    // Asegura que cada pregunta tiene un id único (usa el índice si no existe)
    if (response.data.preguntas) {
      response.data.preguntas = response.data.preguntas.map((p, idx) => ({
        ...p,
        id: p.id ?? `pregunta_${idx}`
      }))
    }
    plantilla.value = response.data
  } catch (error) {
    error.value = 'Error al cargar la plantilla'
    plantilla.value = null
  } finally {
    cargando.value = false
    loadingStore.stop()
  }
}

// Inicializar respuestas cuando la plantilla esté disponible
watch(plantilla, (nuevaPlantilla) => {
  if (nuevaPlantilla && nuevaPlantilla.preguntas) {
    const obj = {}
    for (const pregunta of nuevaPlantilla.preguntas) {
      obj[pregunta.id] = pregunta.regla.tipoDato === 'BOOLEANO' ? false : ''
    }
    respuestas.value = obj
  }
})

onMounted(fetchPlantilla)

function enviarFormulario() {
  alert('Respuestas enviadas:\n' + JSON.stringify(respuestas.value, null, 2))
}
</script>

<template>
  <v-container v-if="cargando">
    <v-progress-circular indeterminate color="primary" />
    <span>Cargando plantilla...</span>
  </v-container>
  <v-container v-else-if="error">
    <h2>{{ error }}</h2>
    <v-btn @click="router.back()">Volver</v-btn>
  </v-container>
  <v-container v-else-if="plantilla">
    <h1>{{ plantilla.nombre }}</h1>
    <p>{{ plantilla.descripcion }}</p>
    <v-form @submit.prevent="enviarFormulario">
      <div v-for="(pregunta) in plantilla.preguntas" :key="pregunta.id">
        <label :for="'pregunta-' + pregunta.id">{{ pregunta.pregunta }}</label>
        <template v-if="pregunta.regla.tipoDato === 'TEXTO'">
          <v-text-field
            :id="'pregunta-' + pregunta.id"
            v-model="respuestas[pregunta.id]"
            :label="pregunta.pregunta"
          />
        </template>
        <template v-else-if="pregunta.regla.tipoDato === 'NUMERICO'">
          <v-text-field
            :id="'pregunta-' + pregunta.id"
            v-model.number="respuestas[pregunta.id]"
            :label="pregunta.pregunta"
            type="number"
          />
        </template>
        <template v-else-if="pregunta.regla.tipoDato === 'BOOLEANO'">
          <v-checkbox
            :id="'pregunta-' + pregunta.id"
            v-model="respuestas[pregunta.id]"
            :label="pregunta.pregunta"
          />
        </template>
        <template v-else-if="pregunta.regla.tipoDato === 'RANGO'">
          <v-text-field
            :id="'pregunta-' + pregunta.id"
            v-model.number="respuestas[pregunta.id]"
            :label="pregunta.pregunta"
            type="number"
            :min="pregunta.regla.minValue"
            :max="pregunta.regla.maxValue"
          />
        </template>
        <template v-else-if="pregunta.regla.tipoDato === 'ENUMERADO'">
          <v-select
            :id="'pregunta-' + pregunta.id"
            v-model="respuestas[pregunta.id]"
            :label="pregunta.pregunta"
            :items="pregunta.regla.values"
          />
        </template>
      </div>
      <v-btn type="submit" prepend-icon="mdi-content-save">Enviar</v-btn>
    </v-form>
  </v-container>
  <v-container v-else>
    <h2>No se encontró la plantilla</h2>
    <v-btn @click="router.back()">Volver</v-btn>
  </v-container>
</template>