<script setup>
  import { ref } from 'vue'
  import axios from 'axios'
  import { useUsuarioStore } from '@/stores/usuarioStore'

  const usuarioStore = useUsuarioStore()

  const reglas = ref({
          necesario: value => !!value || 'Campo necesario.',
          numero: value => {
            const pattern = /^[0-9]+\.?[0-9]*$/
            return pattern.test(value) || 'Este campo debe ser un número'
          },
        })

  const headers = {
    headers: {
      "Content-Type": "application/json"
    }
  }

  const urlApi = usuarioStore.getUrlApi()
  const urlPlantillas = urlApi + "plantillas/"
  const urlEspecialistas = urlApi + "usuarios/especialistas/"
  const idEspecialista = usuarioStore.getId()

  const especialista = ref(null)
  const nombre = ref("")
  const descripcion = ref("")
  const preguntas = ref([])
  const strPregunta = ref("")

  const tiposPregunta = ref(["Texto", "Número", "verdadero/falso", "rango numérico", "selección"])
  const tiposPreguntaFormal = ref(["CADENA", "NUMERAL", "BOOLEANO", "RANGO", "ENUMERADO"])
  const tipoPregunta = ref("Texto")

  const rangoMinValue = ref(1)
  const rangoMaxValue = ref(100)

  const enumValues = ref([])
  const newEnumValue = ref("")

  const cont = ref(0)
  const agregarPregunta = ref(false)

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

  function changeAgregarState() {
    agregarPregunta.value = !agregarPregunta.value
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
      changeAgregarState()
    }
  }

  function removePregunta(id) {
    preguntas.value = preguntas.value.filter((p) => p.id != id)
  }

  async function loadEspecialista() {
    let response = await axios.get(urlEspecialistas + idEspecialista)
    especialista.value = response.data
  }

  async function publicarPlantilla() {
    
    // Publicar plantilla
    
    alert("Creando plantilla")
    
    let response = await axios.post(urlPlantillas, {
      "nombre": nombre.value,
      "descripcion": descripcion.value
    }, headers)
    if (response.status != 201) {
      alert("Ha habido un error al crear esta plantilla")
      return
    }

    // Agregar preguntas a la plantilla

    alert("Agregando preguntas")

    let location = response.headers.get("location")
    let idPlantilla = location.split("/")[6]

    for (let pregunta of preguntas.value) {
      if (!publicarPregunta(idPlantilla, pregunta)) {
        alert("Error en la regunta \"" + pregunta.pregunta + "\"")
        return
      }
      alert("Pregunta \"" + pregunta.pregunta + "\" agregada correctamente")
    }
    preguntas.value = []

    // Agregar plantilla a especialista

    alert("Agregando plantilla a especialista")

    let ids = [idPlantilla]
    let response2 = await axios.patch(urlEspecialistas + idEspecialista + "/plantillas/agregar", ids, headers)
    if (response2.status != 204) {
      alert("Ha habido un error al crear esta plantilla")
      return
    }

    nombre.value = ""
    descripcion.value = ""
    alert("Plantilla creada correctamente")
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
    let body = JSON.stringify(pregunta, replacerPreguntas)
    let response
    switch(pregunta.regla.tipoDato) {
      case "CADENA": 
        response = await axios.post(urlPlantillas + idPlantilla + "/datos/cadena", body, headers)
        break
      case "NUMERAL": 
        response = await axios.post(urlPlantillas + idPlantilla + "/datos/numeral", body, headers)
        break
      case "BOOLEANO": 
        response = await axios.post(urlPlantillas + idPlantilla + "/datos/booleano", body, headers)
        break
      case "RANGO": 
        response = await axios.post(urlPlantillas + idPlantilla + "/datos/rango", body, headers)
        break
      case "ENUMERADO": 
        response = await axios.post(urlPlantillas + idPlantilla + "/datos/enumerado", body, headers)
        break
      default:
        return false
    }
    if (response.status != 201)
      return false
    return true
  }

  loadEspecialista()
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
        <v-list-item v-for="pregunta of preguntas" :key="pregunta.id">
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
              <v-list-item v-for="value of pregunta.regla.values" :key="value">
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
        @click="changeAgregarState()"
      >
        Agregar pregunta
      </v-btn>
      <v-container v-if="agregarPregunta">
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
            <v-list-item v-for="value of enumValues" :key="value">
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