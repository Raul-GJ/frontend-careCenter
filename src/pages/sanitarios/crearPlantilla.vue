<script setup>
  import { ref } from 'vue'
  import axios from 'axios'

  const reglas = ref({
          necesario: value => !!value || 'Campo necesario.',
          numero: value => {
            const pattern = /^[0-9]+\.?[0-9]*$/
            return pattern.test(value) || 'Este campo debe ser un número'
          },
        })

  const urlApi = "http://localhost:8080/salud/api/"
  const urlPlantillas = urlApi + "plantillas/"
  const urlEspecialistas = urlApi + "usuarios/especialistas/"
  const idEspecialista = "67f0e0995b95213262208374"

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
      let tipoFormal = tiposPreguntaFormal.value[tiposPregunta.value.indexOf(tipoPregunta.value)]
      let regla = { tipoDato: tipoFormal }
      if (tipoFormal == "RANGO") {
        regla.minValue = rangoMinValue.value 
        regla.maxValue = rangoMaxValue.value
        rangoMinValue.value = 1
        rangoMaxValue.value = 100
      } else if (tipoFormal == "ENUMERADO") {
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
    }, {
      headers: {
        "Content-Type": "application/json"
      }
    })
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
    let response2 = await axios.patch(urlEspecialistas + idEspecialista + "/plantillas/agregar", ids, {
      headers: {
        "Content-Type": "application/json"
      }
    })
    if (response2.status != 204) {
      alert("Ha habido un error al crear esta plantilla")
      return
    }

    nombre.value = ""
    descripcion.value = ""
    alert("Plantilla creada correctamente")
  }

  async function publicarPregunta(idPlantilla, pregunta) {
    let body = JSON.stringify(pregunta)
    let response
    switch(pregunta.regla.tipoDato) {
      case "CADENA": 
        response = await axios.post(urlPlantillas + idPlantilla + "/datos/cadena", body, {
          headers: {
            "Content-Type": "application/json"
          }
        })
        break
      case "NUMERAL": 
        response = await axios.post(urlPlantillas + idPlantilla + "/datos/numeral", body, {
          headers: {
            "Content-Type": "application/json"
          }
        })
        break
      case "BOOLEANO": 
        response = await axios.post(urlPlantillas + idPlantilla + "/datos/booleano", body, {
          headers: {
            "Content-Type": "application/json"
          }
        })
        break
      case "RANGO": 
        response = await axios.post(urlPlantillas + idPlantilla + "/datos/rango", body, {
          headers: {
            "Content-Type": "application/json"
          }
        })
        break
      case "ENUMERADO": 
        response = await axios.post(urlPlantillas + idPlantilla + "/datos/enumerado", body, {
          headers: {
            "Content-Type": "application/json"
          }
        })
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

          <v-container v-if="pregunta.regla.tipoDato == 'RANGO'">
            <p>Valor mínimo: {{ pregunta.regla.minValue }}</p>
            <p>Valor máximo: {{ pregunta.regla.maxValue }}</p>
          </v-container>

          <v-container v-if="pregunta.regla.tipoDato == 'ENUMERADO'">
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
      </v-container>
    </v-form>
  </v-container>
</template>