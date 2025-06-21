<script setup>
  import { useRoute } from 'vue-router'
  import { ref } from 'vue'
  import { usePlantillaStore } from '@/stores/plantillaStore'
  import { useLoadingStore } from '@/stores/loadingStore'
  import { modificarPlantilla } from '@/services/apiPlantillas'
  import { agregarPregunta } from '@/services/apiPlantillas'
  import { eliminarPregunta } from '@/services/apiPlantillas'

  const reglas = ref({
          necesario: value => !!value || 'Campo necesario.',
          numero: value => {
            const pattern = /^[0-9]+\.?[0-9]*$/
            return pattern.test(value) || 'Este campo debe ser un número'
          },
        })
  
  const loadingStore = useLoadingStore()
  const plantillaStore = usePlantillaStore()
  const route = useRoute()
  const idPlantilla = route.params.id
  const plantilla = ref(null)
  const preguntas = ref([])
  const preguntasEliminadas = ref([])
  const nuevasPreguntas = ref([])

  const guardarPlantillaBoolean = ref(false)
  const agregarPreguntaBoolean = ref(false)

  const rangoMinValue = ref(1)
  const rangoMaxValue = ref(100)

  const enumValues = ref([])
  const newEnumValue = ref("")

  const cont = ref(0)

  const strPregunta = ref("")
  const tiposPregunta = ref(["Texto", "Número", "si/no", "rango numérico", "selección"])
  const tiposPreguntaFormal = ref(["TEXTO", "NUMERICO", "BOOLEANO", "RANGO", "ENUMERADO"])
  const tipoPregunta = ref("Texto")

  function addEnumValue() {
    if (newEnumValue.value != "" && !enumValues.value.includes(newEnumValue.value)) {
      enumValues.value.push(newEnumValue.value)
      newEnumValue.value = ""
    }
  }

  function removeEnumValue(value) {
    enumValues.value = enumValues.value.filter((v) => v != value)
  }

  function addPregunta() {
    if (strPregunta.value != "" && tiposPregunta.value.includes(tipoPregunta.value)) {
      let nuevoTipo = getTipoFormal(tipoPregunta.value)
      let regla = { tipoDato: nuevoTipo }
      if (tipoPregunta.value == "RANGO") {
        regla.minValue = rangoMinValue.value 
        regla.maxValue = rangoMaxValue.value
        rangoMinValue.value = 1
        rangoMaxValue.value = 100
      } else if (tipoPregunta.value == "ENUMERADO") {
        regla.values = enumValues.value
        enumValues.value = []
      }
      let pregunta = { id: cont.value, pregunta: strPregunta.value, regla: regla }
      cont.value++;
      preguntas.value.push(pregunta)
      nuevasPreguntas.value.push(pregunta)
      strPregunta.value = ""
      tipoPregunta.value = "Texto"
      agregarPreguntaBoolean.value = false
    }
  }

  function removePregunta(id) {
    if (!nuevasPreguntas.value.some((p) => p.id == id)) {
      preguntas.value = preguntas.value.filter((p) => p.id != id)
      preguntasEliminadas.value.push(id)
    } else {
      nuevasPreguntas.value = nuevasPreguntas.value.filter((p) => p.id != id)
    }
    
  }

  function getTipoFormal(value) {
    return tiposPreguntaFormal.value[tiposPregunta.value.indexOf(value)]
  }

  function getTipoNormal(value) {
    return tiposPregunta.value[tiposPreguntaFormal.value.indexOf(value)]
  }

  async function guardarCambios() {
    loadingStore.start()
    try {
      let body = {
        nombre: plantilla.value.nombre,
        descripcion: plantilla.value.descripcion,
      }
      await modificarPlantilla(idPlantilla, body)
      for (const pregunta of preguntasEliminadas.value) {
        console.log("Eliminando pregunta:", pregunta)
        await eliminarPregunta(idPlantilla, pregunta)
      }
      for (const pregunta of nuevasPreguntas.value) {
        console.log("Agregando pregunta:", pregunta)
        await agregarPregunta(idPlantilla, pregunta.regla.tipoDato, pregunta)
      }
      guardarPlantillaBoolean.value = false
      alert("Cambios guardados correctamente")
    } catch (error) {
      console.error("Error al guardar los cambios:", error)
      alert("Error al guardar los cambios. Por favor, inténtalo de nuevo.")
    } finally {
      loadingStore.stop()
    }
  }

  async function loadPlantilla() {
    loadingStore.start()
    plantilla.value = await plantillaStore.getPlantilla(idPlantilla)
    preguntas.value = plantilla.value.preguntas || []
    for (const pregunta of preguntas.value) {
      pregunta.id = cont.value++
    }
    loadingStore.stop()
  }

  loadPlantilla()
</script>
<template>
  <v-container>
    <v-container v-if="!loadingStore.loading">
      <v-text-field
        v-model="plantilla.nombre"
        label="Nombre de la plantilla"
        :rules="[value => !!value || 'Campo necesario.']"
      />
      <v-textarea
        v-model="plantilla.descripcion"
        label="Descripción de la plantilla"
        :rules="[value => !!value || 'Campo necesario.']"
      />
      <v-list>
        <v-list-item
          v-for="pregunta of preguntas"
          :key="pregunta.id"
        >
          <p>Pregunta: {{ pregunta.pregunta }}</p>
          <p>Tipo: {{ getTipoNormal(pregunta.regla.tipoDato) }}</p>

          <v-container v-if="pregunta.regla.tipoDato == 'RANGO'">
            <p>Valor mínimo: {{ pregunta.regla.minValue }}</p>
            <p>Valor máximo: {{ pregunta.regla.maxValue }}</p>
          </v-container>

          <v-container v-if="pregunta.regla.tipoDato == 'ENUMERADO'">
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
          <template #append>
            <v-btn 
              prepend-icon="mdi-delete"
              @click="removePregunta(pregunta.id)"
            />
          </template>
        </v-list-item>
      </v-list>
      <v-btn 
        prepend-icon="mdi-plus-circle" 
        @click="agregarPreguntaBoolean = !agregarPreguntaBoolean"
      >
        Agregar pregunta
      </v-btn>
      <v-container v-if="agregarPreguntaBoolean">
        <v-text-field 
          v-model="strPregunta"
          display 
          label="Pregunta"
          :rules="[reglas.necesario]"
        />
        <v-select 
          v-model="tipoPregunta" 
          label="Tipo de pregunta"
          :items="tiposPregunta"
          :rules="[reglas.necesario]"
        />

        <v-container v-if="tipoPregunta == 'rango numérico'">
          <v-text-field 
            v-model="rangoMinValue"
            display 
            label="Valor mínimo"
            :rules="[reglas.necesario, reglas.numero]"
          />
          <v-text-field 
            v-model="rangoMaxValue"
            display 
            label="Valor máximo"
            :rules="[reglas.necesario, reglas.numero]"
          />
        </v-container>

        <v-container v-if="tipoPregunta == 'selección'">
          <p>Opciones: </p>
          <v-list>
            <v-list-item
              v-for="value of enumValues"
              :key="value"
            >
              <p>{{ value }}</p>
              <template #append>
                <v-btn 
                  icon="mdi-delete" 
                  @click="removeEnumValue(value)"
                />
              </template>
            </v-list-item>
          </v-list>
          <v-text-field 
            v-model="newEnumValue"
            display 
            label="Nueva opción"
          />
          <v-btn 
            prepend-icon="mdi-plus-circle" 
            @click="addEnumValue()"
          >
            Añadir opción
          </v-btn>
        </v-container>

        <v-btn 
          prepend-icon="mdi-check" 
          @click="addPregunta()"
        >
          Aceptar
        </v-btn>
      </v-container>
      <v-btn 
        prepend-icon="mdi-content-save" 
        @click="guardarPlantillaBoolean = true"
      >
        Guardar cambios
      </v-btn>
      <v-dialog
        v-model="guardarPlantillaBoolean"
        max-width="400"
        persistent
      >
        <v-card
          prepend-icon="mdi-map-alert"
          text="¿Estás seguro de que deseas guardar los cambios de esta plantilla?"
          title="Advertencia"
        >
          <v-btn @click="guardarPlantillaBoolean = false">
            Cancelar
          </v-btn>

          <v-btn @click="guardarCambios()">
            Aceptar
          </v-btn>
        </v-card>
      </v-dialog>
    </v-container>
  </v-container>
</template>