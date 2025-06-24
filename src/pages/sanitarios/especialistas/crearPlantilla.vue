<script setup>
  import { ref } from 'vue'
  import { useUsuarioStore } from '@/stores/usuarioStore'
  import { crearPlantilla, agregarPregunta } from '@/services/apiPlantillas'
  import { agregarPlantillasEspecialista } from '@/services/apiUsuarios'
  import { useLoadingStore } from '@/stores/loadingStore'
  const loadingStore = useLoadingStore()

  const usuarioStore = useUsuarioStore()

  const reglas = ref({
          necesario: value => !!value || 'Campo necesario.',
          numero: value => {
            const pattern = /^[0-9]+\.?[0-9]*$/
            return pattern.test(value) || 'Este campo debe ser un número'
          },
        })

  const idEspecialista = usuarioStore.getId()

  const nombre = ref("")
  const descripcion = ref("")
  const preguntas = ref([])
  const strPregunta = ref("")

  const tiposPregunta = ref(["Texto", "Número", "si/no", "rango numérico", "selección"])
  const tiposPreguntaFormal = ref(["TEXTO", "NUMERICO", "BOOLEANO", "RANGO", "ENUMERADO"])
  const tipoPregunta = ref("Texto")

  const rangoMinValue = ref(1)
  const rangoMaxValue = ref(100)

  const enumValues = ref([])
  const newEnumValue = ref("")

  const cont = ref(0)
  const agregarPreguntaBoolean = ref(false)

  const limpiarPlantillaValue = ref(false)

  function limpiarPlantilla() {
    nombre.value = ""
    descripcion.value = ""
    preguntas.value = []
    strPregunta.value = ""
    rangoMinValue.value = 1
    rangoMaxValue.value = 100
    enumValues.value = []
    newEnumValue.value = ""
    cont.value = 0
  }

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
      let regla = { tipoDato: tipoPregunta.value }
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
      strPregunta.value = ""
      tipoPregunta.value = "Texto"
      agregarPreguntaBoolean.value = false
    }
  }

  function removePregunta(id) {
    preguntas.value = preguntas.value.filter((p) => p.id != id)
  }

  async function publicarPlantilla() {
    loadingStore.start()
    // Publicar plantilla
    
    console.log("Creando plantilla")
    
    let response = await crearPlantilla( { nombre: nombre.value, descripcion: descripcion.value })
    if (response.status != 201) {
      console.log("Ha habido un error al crear esta plantilla")
      loadingStore.stop()
      return
    }

    // Agregar preguntas a la plantilla

    console.log("Agregando preguntas")

    let location = response.headers.get("location")
    let idPlantilla = location.split("/").at(-1)

    for (let pregunta of preguntas.value) {
      if (!publicarPregunta(idPlantilla, pregunta)) {
        console.log("Error en la regunta \"" + pregunta.pregunta + "\"")
        loadingStore.stop()
        return
      }
      console.log("Pregunta \"" + pregunta.pregunta + "\" agregada correctamente")
    }
    preguntas.value = []

    // Agregar plantilla a especialista

    console.log("Agregando plantilla a especialista")

    let ids = [idPlantilla]
    let response2 = await agregarPlantillasEspecialista(idEspecialista, ids)
    if (response2.status != 204) {
      console.log("Ha habido un error al crear esta plantilla")
      loadingStore.stop()
      return
    }

    nombre.value = ""
    descripcion.value = ""
    console.log("Plantilla creada correctamente")
    loadingStore.stop()
  }

  function replacerPreguntas(key, value) {
    if (key == "id") {
      return undefined
    }
    if (key == "tipoDato") {
      return (tiposPreguntaFormal.value[tiposPregunta.value.indexOf(value)])
    }
    return value
  }

  async function publicarPregunta(idPlantilla, pregunta) {
    loadingStore.start()
    let body = JSON.stringify(pregunta, replacerPreguntas)
    let response = await agregarPregunta(idPlantilla, pregunta.regla.tipoDato, body)
    loadingStore.stop()
    if (response.status != 201)
      return false
    return true

  }

  
</script>

<template>
  <v-container>
    <h1>Crear plantilla de formulario</h1>
    <v-form :submit="publicarPlantilla">
      <v-text-field 
        v-model="nombre" 
        label="Nombre"
      />
      <v-text-field 
        v-model="descripcion" 
        label="Descripción"
      />
      <v-list>
        <v-list-item
          v-for="pregunta of preguntas"
          :key="pregunta.id"
        >
          <p>Id: {{ pregunta.id }}</p>
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
      <v-container>
        <v-btn 
          prepend-icon="mdi-content-save" 
          @click="publicarPlantilla()"
        >
          Guardar
        </v-btn>
        <v-btn 
          prepend-icon="mdi-delete"
          @click="limpiarPlantillaValue = true"
        >
          Limpiar plantilla
        </v-btn>
        <v-dialog
          v-model="limpiarPlantillaValue"
          max-width="400"
          persistent
        >
          <v-card
            prepend-icon="mdi-map-alert"
            text="¿Estás seguro de que deseas limpiar la plantilla? Se eliminarán todo el progreso de esta plantilla"
            title="Advertencia"
          >
            <v-btn @click="limpiarPlantillaValue = false">
              Cancelar
            </v-btn>

            <v-btn @click="limpiarPlantilla()">
              Aceptar
            </v-btn>
          </v-card>
        </v-dialog>
      </v-container>
    </v-form>
  </v-container>
</template>