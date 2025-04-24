<script setup>
  import { ref, computed } from 'vue'
  import axios from 'axios'
  import { useDate } from 'vuetify'
  import { useUsuarioStore } from '@/stores/usuarioStore'
  import { usePacienteStore } from '@/stores/pacienteStore'
  import { usePlantillaStore } from '@/stores/plantillaStore'
  import { storeToRefs } from 'pinia'

  const usuarioStore = useUsuarioStore();
  
  const adapter = useDate()

  const headers = {
    headers: {
      "Content-Type": "application/json"
    }
  }
  
  const urlApi = usuarioStore.getUrlApi()
  const urlEstudios = urlApi + "estudios/"
  const urlSeguimientos = urlApi + "seguimientos/"
  const urlAlertas = urlApi + "alertas/"
  const urlAsignaciones = urlApi + "asignaciones/"
  const especialista = ref(usuarioStore.getUsuario())

  const nombre = ref("")
  const descripcion = ref("")
  const fechaActual = ref(new Date())
  const fechaAltaLocal = ref(new Date())
  const fechaFinLocal = ref(fechaAltaLocal.value)

  const plantilla = ref(null)
  const contSeguimientos = ref(0)
  const contAlertas = ref(0)

  const agregarPacienteValue = ref(false)
  const agregarSeguimientoValue = ref(false)
  const agregarAlertaValue = ref(false)
  
  const fechaSeguimiento = ref(null)
  const plazoSeguimiento = ref(null)
  const fechaAlerta = ref(null)
  const asuntoAlerta = ref("")
  const mensajeAlerta = ref("")
  
  const pacienteStore = usePacienteStore()
  const { pacientes } = storeToRefs(pacienteStore)
  const plantillaStore = usePlantillaStore()
  const { plantillas } = storeToRefs(plantillaStore)

  const pacientesEstudio = ref([])
  const seguimientosEstudio = ref([])
  const alertasEstudio = ref([])

  const pacientesRestantes = computed(() => {
    return pacientes.value.filter((p) => !pacientesEstudio.value.includes(p))
  })

  function agregarPaciente(paciente) {
    pacientesEstudio.value.push(paciente)
    agregarPacienteValue.value = false
  }

  function agregarSeguimiento() {
    seguimientosEstudio.value.push({ id: contSeguimientos.value, 
      fecha: adapter.toISO(fechaSeguimiento.value) + "T09:00:00", 
      plazo: adapter.toISO(plazoSeguimiento.value) + "T09:00:00", 
      formulario: plantilla.value
    })
    plantilla.value = null
    fechaSeguimiento.value = new Date()
    plazoSeguimiento.value = new Date()
    contSeguimientos.value++
    agregarSeguimientoValue.value = false
  }

  function agregarAlerta() {
    alertasEstudio.value.push({ id: contAlertas.value, 
      asunto: asuntoAlerta.value, 
      mensaje: mensajeAlerta.value, 
      fecha: adapter.toISO(fechaAlerta.value) + "T09:00:00"
    })
    fechaAlerta.value = new Date()
    asuntoAlerta.value = ""
    mensajeAlerta.value = ""
    contAlertas.value++
    agregarAlertaValue.value = false
  }

  async function crearEstudio() {
    let estudio = { nombre: nombre.value, 
      descripcion: descripcion.value, 
      fechaAlta: adapter.toISO(fechaAltaLocal.value) + "T09:00:00",
      fechaFin: adapter.toISO(fechaFinLocal.value) + "T09:00:00" }
    let response = await axios.post(urlEstudios, estudio, headers)

    if (response.status != 201) {
      alert("Error al crear el estudio")
      return
    }

    let location = response.headers.get("location")
    let idEstudio = location.split("/")[6]
    return idEstudio
  }

  async function agregarPacientesEstudio(idEstudio) {
    let pacientesIds = pacientesEstudio.value.map((p) => p.id)
    let pacientesResponse = await axios.patch(urlEstudios + idEstudio + "/pacientes/agregar", pacientesIds, headers)
    if (pacientesResponse.status != 204) {
      alert("Error al agregar pacientes")
      return
    }
  }

  async function agregarSeguimientosEstudio(idEstudio) {
    let seguimientosIds = []
    for (let seguimiento of seguimientosEstudio.value) {
      let body = { fecha: seguimiento.fecha, plazo: seguimiento.plazo, plantilla: seguimiento.formulario.id }
      let seguimientoResponse = await axios.post(urlSeguimientos, body, headers)
      if (seguimientoResponse.status != 201) {
        alert("Error al crear el seguimiento " + seguimiento.id)
        return
      }
      let locationSeguimiento = seguimientoResponse.headers.get("location")
      let idSeguimiento = locationSeguimiento.split("/")[6]
      seguimientosIds.push(idSeguimiento)
    }

    let seguimientosResponse = await axios.patch(urlEstudios + idEstudio + "/seguimientos/agregar", seguimientosIds, headers)

    if (seguimientosResponse.status != 204) {
      alert("Error al agregar seguimientos al estudio")
      return
    }
  }

  async function agregarAlertasEstudio(idEstudio) {
    let alertasIds = []
    for (let alerta of alertasEstudio.value) {
      let body = { fecha: alerta.fecha, asunto: alerta.asunto, mensaje: alerta.mensaje }
      let alertaResponse = await axios.post(urlAlertas, body, headers)
      if (alertaResponse.status != 201) {
        alert("Error al crear la alerta " + alerta.id)
        return
      }
      let locationAlerta = alertaResponse.headers.get("location")
      let idAlerta = locationAlerta.split("/")[6]
      alertasIds.push(idAlerta)
    }

    let alertasResponse = await axios.patch(urlEstudios + idEstudio + "/alertas/agregar", alertasIds, headers)

    if (alertasResponse.status != 204) {
      alert("Error al agregar alertas al estudio")
      return
    }
  }

  async function asignarEstudio(idEstudio) {
    let body = { especialista: especialista.value.id, estudio: idEstudio, rol: 'CREADOR'}
    let response = await axios.post(urlAsignaciones, body, headers)
    if (response.status != 201) {
      alert("Error al asignar el estudio al especialista")
      return
    }
  }

  async function publicarEstudio() {

    let idEstudio = await crearEstudio()
    await agregarPacientesEstudio(idEstudio)
    await agregarSeguimientosEstudio(idEstudio)
    await agregarAlertasEstudio(idEstudio)
    await asignarEstudio(idEstudio)

    alert("Estudio creado con éxito")
  }

  pacienteStore.loadPacientes()
  plantillaStore.loadPlantillas()
</script>

<template>
  <v-container>
    <h1>Crear estudio</h1>
    <v-form :submit="publicarEstudio">
      <v-text-field 
        v-model="nombre" 
        label="Nombre"
      />
      <v-text-field 
        v-model="descripcion" 
        label="Descripción"
      />
      <v-row>
        <v-col>
          <v-date-picker 
            v-model="fechaAltaLocal"
            :min="fechaActual"
            color="primary"
            show-adjacent-months
            title="Seleccionar fecha"
          />
        </v-col>
        <v-col>
          <v-date-picker 
            v-model="fechaFinLocal"
            :min="fechaAltaLocal"
            color="primary"
            show-adjacent-months
            title="Seleccionar fecha"
          />
        </v-col>
      </v-row>
      <v-list>
        <p>Pacientes:</p>
        <v-list-item 
          v-for="paciente in pacientesEstudio"
          :key="paciente.id"
        >
          <p>Id: {{ paciente.id }}</p>
          <p>Nombre: {{ paciente.nombre }}</p>
        </v-list-item>
      </v-list>

      <v-btn 
        prepend-icon="mdi-plus-outline" 
        @click="agregarPacienteValue = !agregarPacienteValue"
      >
        Agregar pacientes
      </v-btn>

      <v-container v-if="agregarPacienteValue">
        <v-table>
          <thead>
            <tr>
              <th>
                Id
              </th>
              <th>
                Nombre
              </th>
              <th>
                Opciones
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="paciente in pacientesRestantes"
              :key="paciente.id"
            >
              <td>Id: {{ paciente.id }}</td>
              <td>Id: {{ paciente.nombre }}</td>
              <td>
                <v-btn 
                  icon="mdi-plus" 
                  title="Agregar paciente"
                  @click="agregarPaciente(paciente)"
                />
              </td>
            </tr>
          </tbody>
        </v-table>

        <v-btn 
          prepend-icon="mdi-plus-outline" 
          @click="agregarPaciente()"
        >
          Agregar paciente
        </v-btn>
      </v-container>

      <v-list>
        <p>Seguimientos:</p>
        <v-list-item 
          v-for="seguimiento in seguimientosEstudio"
          :key="seguimiento.id"
        >
          <p>Id: {{ seguimiento.id }}</p>
          <p>Fecha: {{ seguimiento.fecha }}</p>
          <p>Plazo: {{ seguimiento.plazo }}</p>
          <p>Formulario: {{ seguimiento.formulario.nombre }}</p>
        </v-list-item>
      </v-list>

      <v-btn 
        prepend-icon="mdi-plus-outline" 
        @click="agregarSeguimientoValue = !agregarSeguimientoValue"
      >
        Agregar seguimiento
      </v-btn>

      <v-container v-if="agregarSeguimientoValue">
        <v-select 
          v-model="plantilla" 
          label="Plantilla"
          :items="plantillas"
          item-title="nombre"
          return-object
        />
        <v-row>
          <v-col>
            <v-date-picker 
              v-model="fechaSeguimiento"
              :min="fechaActual"
              color="primary"
              show-adjacent-months
              title="Seleccionar fecha"
            />
          </v-col>
          <v-col>
            <v-date-picker 
              v-model="plazoSeguimiento"
              :min="fechaSeguimiento"
              color="primary"
              show-adjacent-months
              title="Seleccionar fecha"
            />
          </v-col>
        </v-row>
        <v-btn 
          prepend-icon="mdi-plus-outline" 
          @click="agregarSeguimiento()"
        >
          Agregar seguimiento
        </v-btn>
      </v-container>
      
      <v-list>
        <p>Alertas</p>
        <v-list-item 
          v-for="alerta in alertasEstudio"
          :key="alerta.id"
        >
          <p>Id: {{ alerta.id }}</p>
          <p>Asunto: {{ alerta.asunto }}</p>
          <p>Mensaje: {{ alerta.mensaje }}</p>
          <p>Fecha: {{ alerta.fecha }}</p>
        </v-list-item>
      </v-list>

      <v-btn 
        prepend-icon="mdi-plus-outline" 
        @click="agregarAlertaValue = !agregarAlertaValue"
      >
        Agregar alerta
      </v-btn>

      <v-container v-if="agregarAlertaValue">
        <v-text-field 
          v-model="asuntoAlerta" 
          label="Asunto"
        />
        <v-text-field 
          v-model="mensajeAlerta" 
          label="Mensaje"
        />
        
        <v-date-picker 
          v-model="fechaAlerta"
          :min="fechaActual"
          color="primary"
          show-adjacent-months
          title="Seleccionar fecha"
        />
        
        <v-btn 
          prepend-icon="mdi-plus-outline" 
          @click="agregarAlerta()"
        >
          Agregar alerta
        </v-btn>
      </v-container>

      <v-btn 
        prepend-icon="mdi-content-save" 
        @click="publicarEstudio()"
      >
        Guardar
      </v-btn>
    </v-form>
  </v-container>
</template>