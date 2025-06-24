<script setup>
  import { useRoute } from 'vue-router'
  import { ref } from 'vue'
  import { useSeguimientoStore } from '@/stores/seguimientoStore'
  import { usePlantillaStore } from '@/stores/plantillaStore'
  import { useLoadingStore } from '@/stores/loadingStore'

  const loadingStore = useLoadingStore()
  const seguimientoStore = useSeguimientoStore()
  const plantillaStore = usePlantillaStore()
  const route = useRoute()

  const idSeguimiento = route.params.id
  const seguimiento = ref(null)

  const preguntas = ref([])

  function loadPreguntas() {
    for (let i = 0; i < seguimiento.value.formulario.plantilla.preguntas.length; i++) {
      let pregunta = seguimiento.value.formulario.plantilla.preguntas[i]
      preguntas.value.push({
        id: pregunta.id,
        pregunta: pregunta.pregunta,
        regla: pregunta.regla,
        respuesta: seguimiento.value.formulario.respuestas[i]
      })
    }
  }

  async function loadSeguimiento() {
    loadingStore.start()
    let seguimientoResponse = await seguimientoStore.getSeguimiento(idSeguimiento)
    console.log(seguimientoResponse)
    let plantilla = await plantillaStore.getPlantilla(seguimientoResponse.formulario.plantilla)
    seguimientoResponse.formulario.plantilla = plantilla
    seguimiento.value = seguimientoResponse
    console.log(seguimiento.value)
    loadPreguntas()
    console.log(preguntas.value)
    loadingStore.stop()
  }

  loadSeguimiento()
</script>
<template>
  <v-container>
    <div v-if="!loadingStore.loading">
      <p>Motivo: {{ seguimiento.motivo }}</p>
      <p>Fecha: {{ seguimiento.fecha }}</p>
      <p>Plazo: {{ seguimiento.plazo }}</p>
      <div v-if="seguimiento.formulario.respuestas.length > 0">
        <p>Formulario</p>
        <v-list>
          <v-list-item
            v-for="pregunta of preguntas"
            :key="pregunta.id"
          >
            <p>Pregunta: {{ pregunta.pregunta }}</p>
            <p>Tipo: {{ pregunta.regla.tipoDato }}</p>

            <v-container v-if="pregunta.regla.tipoDato == 'rango numérico'">
              <p>Valor mínimo: {{ pregunta.regla.minValue }}</p>
              <p>Valor máximo: {{ pregunta.regla.maxValue }}</p>
            </v-container>

            <v-container v-if="pregunta.regla.tipoDato == 'selección'">
              <p>Posibles valores:</p>
              <v-list>
                <v-list-item
                  v-for="value of pregunta.regla.values"
                  :key="value"
                >
                  <p>{{ value }}</p>
                </v-list-item>
              </v-list>
            </v-container>

            <p>Respuesta: {{ pregunta.respuesta }}</p>
          </v-list-item>
        </v-list>
      </div>
      <div v-else>
        <v-chip
          color="red"
          text-color="white"
        >
          El formulario no ha sido rellenado.
        </v-chip>
        <v-list>
          <v-list-item
            v-for="pregunta of preguntas"
            :key="pregunta.id"
          >
            <p>Pregunta: {{ pregunta.pregunta }}</p>
            <p>Tipo: {{ pregunta.regla.tipoDato }}</p>

            <v-container v-if="pregunta.regla.tipoDato == 'rango numérico'">
              <p>Valor mínimo: {{ pregunta.regla.minValue }}</p>
              <p>Valor máximo: {{ pregunta.regla.maxValue }}</p>
            </v-container>

            <v-container v-if="pregunta.regla.tipoDato == 'selección'">
              <p>Posibles valores:</p>
              <v-list>
                <v-list-item
                  v-for="value of pregunta.regla.values"
                  :key="value"
                >
                  <p>{{ value }}</p>
                </v-list-item>
              </v-list>
            </v-container>
          </v-list-item>
        </v-list>
      </div>
    </div>
  </v-container>
</template>