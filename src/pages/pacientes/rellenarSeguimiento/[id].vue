<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSeguimientoStore } from '@/stores/seguimientoStore'
import { obtenerPlantilla } from '@/services/apiPlantillas'
import { useLoadingStore } from '@/stores/loadingStore'
import { rellenarFormulario } from '@/services/apiSeguimientos'

const seguimientoStore = useSeguimientoStore()
const loadingStore = useLoadingStore()

const route = useRoute()
const router = useRouter()

const idSeguimiento = route.params.id
const seguimiento = ref(null)

const plantilla = ref(null)
const respuestas = ref({})
const cargando = ref(true)
const error = ref(null)

async function fetchPlantilla() {
  try {
    let response = await obtenerPlantilla(seguimiento.value.formulario.plantilla)
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
  }
}

// Inicializar respuestas cuando la plantilla esté disponible
watch(plantilla, (nuevaPlantilla) => {
  if (nuevaPlantilla && nuevaPlantilla.preguntas) {
    const obj = {}
    for (const pregunta of nuevaPlantilla.preguntas) {
      if (pregunta.regla.tipoDato === 'BOOLEANO') {
        obj[pregunta.id] = false // Siempre inicializa como false
      } else {
        obj[pregunta.id] = ''
      }
    }
    respuestas.value = obj
  }
})

onMounted(fetchPlantilla)

async function enviarFormulario() {
  try {
    let body = { respuestas: [] }
    if (plantilla.value && plantilla.value.preguntas) {
      for (const pregunta of plantilla.value.preguntas) {
        let valor = respuestas.value[pregunta.id]
        if (pregunta.regla.tipoDato === 'NUMERICO' || pregunta.regla.tipoDato === 'RANGO') {
          valor = valor === '' ? null : Number(valor)
        } else if (pregunta.regla.tipoDato === 'BOOLEANO') {
          valor = typeof valor === 'boolean' ? valor : false // fuerza booleano
        }
        body.respuestas.push(valor)
      }
    }
    console.log('Enviando respuestas:', body)
    await rellenarFormulario(idSeguimiento, body)
    alert('Formulario enviado correctamente')
    router.back()
  } catch (err) {
    console.error('Error al enviar el formulario:', err)
    error.value = 'Error al enviar el formulario'
    return
  }
}

async function loadSeguimiento() {
  loadingStore.start()
  seguimiento.value = await seguimientoStore.getSeguimiento(idSeguimiento)
  await fetchPlantilla()
  loadingStore.stop()
}

loadSeguimiento()
</script>

<template>
  <v-container v-if="!loadingStore.loading && plantilla">
    <h1>{{ plantilla.nombre }}</h1>
    <p>{{ plantilla.descripcion }}</p>
    <v-form @submit.prevent="enviarFormulario">
      <div
        v-for="(pregunta) in plantilla.preguntas"
        :key="pregunta.id"
      >
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
          <v-btn
            :id="'pregunta-' + pregunta.id"
            :color="respuestas[pregunta.id] ? 'green' : 'red'"
            class="mb-2"
            @click="respuestas[pregunta.id] = !respuestas[pregunta.id]"
          >
            {{ respuestas[pregunta.id] ? 'Sí' : 'No' }}
          </v-btn>
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
      <v-btn
        type="submit"
        prepend-icon="mdi-content-save"
      >
        Enviar
      </v-btn>
    </v-form>
  </v-container>
  <v-container v-else>
    <h2>No se encontró el seguimiento</h2>
    <v-btn @click="router.back()">
      Volver
    </v-btn>
  </v-container>
</template>