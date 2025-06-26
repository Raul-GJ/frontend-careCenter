<script setup>
  import { ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useSeguimientoStore } from '@/stores/seguimientoStore'
  import { usePlantillaStore } from '@/stores/plantillaStore'
  import { useLoadingStore } from '@/stores/loadingStore'

  const reglas = ref({
          necesario: value => !!value || 'Campo necesario.',
        })

  const seguimientoStore = useSeguimientoStore()
  const loadingStore = useLoadingStore()
  const plantillaStore = usePlantillaStore()

  const route = useRoute()
  const router = useRouter()

  const idSeguimiento = route.params.id
  const seguimiento = ref(null)

  const plantilla = ref(null)
  const error = ref(null)

  const preguntas = ref([])
  const respuestas = ref([])

  const tiposPregunta = ref(["Texto", "Número", "si/no", "rango numérico", "selección"])
  const tiposPreguntaFormal = ref(["TEXTO", "NUMERICO", "BOOLEANO", "RANGO", "ENUMERADO"])

  function getTipoNormal(value) {
    return tiposPregunta.value[tiposPreguntaFormal.value.indexOf(value)]
  }

  function loadPreguntas() {
    preguntas.value = []
    if (!plantilla.value || !plantilla.value.preguntas) return
    for (let i = 0; i < plantilla.value.preguntas.length; i++) {
      let pregunta = plantilla.value.preguntas[i]
      preguntas.value.push({
        id: pregunta.id,
        pregunta: pregunta.pregunta,
        regla: pregunta.regla,
      })
      // Inicializa respuestas con valor por defecto si no existe
      if (typeof respuestas.value[i] === 'undefined') {
        if (pregunta.regla.tipoDato === 'BOOLEANO') {
          respuestas.value[i] = false
        } else if (pregunta.regla.tipoDato === 'RANGO') {
          // respuestas.value[i] = pregunta.regla.minValue
        } else {
          respuestas.value[i] = ''
        }
      }
    }
  }

  function tieneErrores() {
    if (!plantilla.value || !plantilla.value.preguntas) return true
    for (let i = 0; i < plantilla.value.preguntas.length; i++) {
      const pregunta = plantilla.value.preguntas[i]
      const valor = respuestas.value[i]
      if (pregunta.regla.tipoDato !== 'BOOLEANO' && (!valor || valor === '')) {
        return true // Campo necesario, se comprueba que la pregunta no sea de tipo booleano
        // Porque si no !valor devolvería true cuando se quiere enviar el valor false
      }
      if (pregunta.regla.tipoDato === 'NUMERICO' && isNaN(valor)) {
        return true // Debe ser numérico
      }
      if (pregunta.regla.tipoDato === 'BOOLEANO' && typeof valor !== 'boolean') {
        return true // Debe ser booleano
      }
      if (pregunta.regla.tipoDato === 'ENUMERADO' && !pregunta.regla.values.includes(valor)) {
        return true // Debe ser uno de los valores enumerados
      }
      if (pregunta.regla.tipoDato === 'RANGO') {
        if (valor < pregunta.regla.minValue || valor > pregunta.regla.maxValue) {
          return true // Debe estar dentro del rango
        }
      }
    }
    return false
  }

  async function enviarFormulario() {
    if (tieneErrores()) {
      error.value = 'Por favor, corrige los errores antes de enviar el formulario.'
      return
    }
    try {
      let body = { respuestas: [] }
      if (plantilla.value && plantilla.value.preguntas) {
        for (let i = 0; i < plantilla.value.preguntas.length; i++) {
          const pregunta = plantilla.value.preguntas[i]
          let valor = respuestas.value[i]
          if (pregunta.regla.tipoDato === 'NUMERICO' || pregunta.regla.tipoDato === 'RANGO') {
            valor = valor === '' ? null : Number(valor)
          } else if (pregunta.regla.tipoDato === 'BOOLEANO') {
            valor = typeof valor === 'boolean' ? valor : false // fuerza booleano
          }
          body.respuestas.push(valor)
        }
      }
      console.log('Enviando respuestas:', body)
      await seguimientoStore.rellenarFormulario(idSeguimiento, body)
      alert('Formulario enviado correctamente')
      router.back()
    } catch (err) {
      console.error('Error al enviar el formulario:', err)
      error.value = 'Error al enviar el formulario'
      return
    }
  }

  async function load() {
    loadingStore.start()
    seguimiento.value = await seguimientoStore.getSeguimiento(idSeguimiento)
    plantilla.value = await plantillaStore.getPlantilla(seguimiento.value.formulario.plantilla)
    loadPreguntas()
    loadingStore.stop()
  }

  load()
</script>

<template>
  <v-container v-if="!loadingStore.loading && plantilla">
    <h1>{{ plantilla.nombre }}</h1>
    <p>{{ plantilla.descripcion }}</p>
    <v-form @submit.prevent="enviarFormulario">
      <div
        v-for="(pregunta, i) in plantilla.preguntas"
        :key="pregunta.id"
      >
        <label :for="'pregunta-' + pregunta.id">
          {{ pregunta.pregunta }}
          <span class="text-caption text-grey ms-2">
            ({{ getTipoNormal(pregunta.regla.tipoDato) }})
            <template v-if="pregunta.regla.tipoDato === 'RANGO'">
              — Mín: {{ pregunta.regla.minValue }}, Máx: {{ pregunta.regla.maxValue }}
            </template>
          </span>
        </label>
        <template v-if="pregunta.regla.tipoDato === 'TEXTO'">
          <v-text-field
            :id="'pregunta-' + pregunta.id"
            v-model="respuestas[i]"
            :label="pregunta.pregunta"
            :rules="[reglas.necesario]"
          />
        </template>
        <template v-else-if="pregunta.regla.tipoDato === 'NUMERICO'">
          <v-text-field
            :id="'pregunta-' + pregunta.id"
            v-model.number="respuestas[i]"
            :label="pregunta.pregunta"
            :rules="[reglas.necesario]"
            type="number"
          />
        </template>
        <template v-else-if="pregunta.regla.tipoDato === 'BOOLEANO'">
          <div class="mt-2 d-flex align-center">
            <span class="me-2 switch-label">No</span>
            <v-switch
              :id="'pregunta-' + pregunta.id"
              v-model="respuestas[i]"
              :inset="false"
              hide-details
              class="mx-2"
              :color="respuestas[i] ? 'green' : 'red'"
              :track-color="respuestas[i] ? 'green' : 'red'"
              :thumb-color="respuestas[i] ? 'green' : 'red'"
              :rules="[reglas.necesario]"
            />
            <span class="ms-2 switch-label">Sí</span>
          </div>
        </template>
        <template v-else-if="pregunta.regla.tipoDato === 'RANGO'">
          <v-text-field
            :id="'pregunta-' + pregunta.id"
            v-model.number="respuestas[i]"
            :label="pregunta.pregunta"
            type="number"
            :error="respuestas[i] < pregunta.regla.minValue || respuestas[i] > pregunta.regla.maxValue"
            :error-messages="respuestas[i] < pregunta.regla.minValue || respuestas[i] > pregunta.regla.maxValue ? 
              `El valor debe estar entre ${pregunta.regla.minValue} y ${pregunta.regla.maxValue}` : ''"
            :rules="[reglas.necesario]"
          />
        </template>
        <template v-else-if="pregunta.regla.tipoDato === 'ENUMERADO'">
          <v-select
            :id="'pregunta-' + pregunta.id"
            v-model="respuestas[i]"
            :label="pregunta.pregunta"
            :items="pregunta.regla.values"
            :rules="[reglas.necesario]"
          />
        </template>
      </div>
      <v-alert v-if="error" type="error" class="mb-4">
        {{ error }}
      </v-alert>
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

<style>
.switch-label {
  min-width: 2em;
}
</style>