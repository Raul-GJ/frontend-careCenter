<script setup>
  import { ref, computed } from 'vue'
  import { useSesionStore } from '@/stores/sesionStore'
  import { useUsuarioStore } from '@/stores/usuarioStore'
  import { useEstudioStore } from '@/stores/estudioStore'
  import { useSeguimientoStore } from '@/stores/seguimientoStore'
  import { useAlertaStore } from '@/stores/alertaStore'
  import { useAsignacionEstudioStore } from '@/stores/asignacionEstudioStore'
  import { usePlantillaStore } from '@/stores/plantillaStore'
  import { storeToRefs } from 'pinia'
  import { useLoadingStore } from '@/stores/loadingStore'

  const loadingStore = useLoadingStore()
  const estudioStore = useEstudioStore()
  const sesionStore = useSesionStore()
  const seguimientoStore = useSeguimientoStore()
  const alertaStore = useAlertaStore()
  const asignacionEstudioStore = useAsignacionEstudioStore()

  const especialista = ref(null)

  const nombre = ref("")
  const descripcion = ref("")
  const fechaActual = ref(new Date())
  const fechaAltaLocal = ref(new Date().toISOString().slice(0, 16))
  const fechaFinLocal = ref(new Date().toISOString().slice(0, 16))

  const plantilla = ref(null)
  const contSeguimientos = ref(0)
  const contAlertas = ref(0)

  const agregarPacienteValue = ref(false)
  const agregarSeguimientoValue = ref(false)
  const agregarAlertaValue = ref(false)
  
  const fechaSeguimiento = ref(new Date().toISOString().slice(0, 16))
  const plazoSeguimiento = ref(new Date().toISOString().slice(0, 16))
  const fechaAlerta = ref(new Date().toISOString().slice(0, 16))
  const asuntoAlerta = ref("")
  const mensajeAlerta = ref("")
  
  const usuarioStore = useUsuarioStore()
  const pacientes = ref([])
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
      fecha: fechaSeguimiento.value + ":00", 
      plazo: plazoSeguimiento.value + ":00", 
      formulario: plantilla.value
    })
    plantilla.value = null
    fechaSeguimiento.value = new Date().toISOString().slice(0, 16)
    plazoSeguimiento.value = new Date().toISOString().slice(0, 16)
    contSeguimientos.value++
    agregarSeguimientoValue.value = false
  }

  function agregarAlerta() {
    alertasEstudio.value.push({ id: contAlertas.value, 
      asunto: asuntoAlerta.value, 
      mensaje: mensajeAlerta.value, 
      fecha: fechaAlerta.value + ":00"
    })
    fechaAlerta.value = new Date().toISOString().slice(0, 16)
    asuntoAlerta.value = ""
    mensajeAlerta.value = ""
    contAlertas.value++
    agregarAlertaValue.value = false
  }

  async function doCrearEstudio() {
    let estudio = { nombre: nombre.value, 
      descripcion: descripcion.value, 
      fechaAlta: fechaAltaLocal.value + ":00",
      fechaFin: fechaFinLocal.value + ":00" }
    let response = await estudioStore.crearEstudio(estudio)

    if (response.status != 201) {
      console.log("Error al crear el estudio")
      loadingStore.stop()
      return
    }

    let location = response.headers.get("location")
    let idEstudio = location.split("/").at(-1)
    return idEstudio
  }

  async function doAgregarPacientesEstudio(idEstudio) {
    let pacientesIds = pacientesEstudio.value.map((p) => p.id)
    let pacientesResponse = await estudioStore.agregarPacientes(idEstudio, pacientesIds)
    if (pacientesResponse.status != 204) {
      console.log("Error al agregar pacientes")
      loadingStore.stop()
      return
    }
  }

  async function doAgregarSeguimientosEstudio(idEstudio) {
    let seguimientosIds = []
    for (let seguimiento of seguimientosEstudio.value) {
      let body = { fecha: seguimiento.fecha, plazo: seguimiento.plazo, plantilla: seguimiento.formulario.id }
      let seguimientoResponse = await seguimientoStore.crearSeguimiento(body)
      if (seguimientoResponse.status != 201) {
        console.log("Error al crear el seguimiento " + seguimiento.id)
        loadingStore.stop()
        return
      }
      let locationSeguimiento = seguimientoResponse.headers.get("location")
      let idSeguimiento = locationSeguimiento.split("/").at(-1)
      seguimientosIds.push(idSeguimiento)
    }

    let seguimientosResponse = await estudioStore.agregarSeguimientos(idEstudio, seguimientosIds)

    if (seguimientosResponse.status != 204) {
      console.log("Error al agregar seguimientos al estudio")
      loadingStore.stop()
      return
    }
  }

  async function doAgregarAlertasEstudio(idEstudio) {
    let alertasIds = []
    for (let alerta of alertasEstudio.value) {
      let body = { fecha: alerta.fecha, asunto: alerta.asunto, mensaje: alerta.mensaje }
      let alertaResponse = await alertaStore.crearAlerta(body)
      if (alertaResponse.status != 201) {
        console.log("Error al crear la alerta " + alerta.id)
        loadingStore.stop()
        return
      }
      let locationAlerta = alertaResponse.headers.get("location")
      let idAlerta = locationAlerta.split("/").at(-1)
      alertasIds.push(idAlerta)
    }

    let alertasResponse = await estudioStore.agregarAlertas(idEstudio, alertasIds)

    if (alertasResponse.status != 204) {
      console.log("Error al agregar alertas al estudio")
      loadingStore.stop()
      return
    }
  }

  async function asignarEstudio(idEstudio) {
    let body = { especialista: especialista.value.id, estudio: idEstudio, rol: 'CREADOR'}
    let response = await asignacionEstudioStore.crearAsignacion(body)
    if (response.status != 201) {
      console.log("Error al asignar el estudio al especialista")
      loadingStore.stop()
      return
    }
  }

  async function publicarEstudio() {
    loadingStore.start()
    let idEstudio = await doCrearEstudio()
    await doAgregarPacientesEstudio(idEstudio)
    await doAgregarSeguimientosEstudio(idEstudio)
    await doAgregarAlertasEstudio(idEstudio)
    await asignarEstudio(idEstudio)
    loadingStore.stop()
    console.log("Estudio creado con éxito")
  }

  async function load() {
    loadingStore.start()
    especialista.value = await sesionStore.getUsuario()
    for (let idPaciente of especialista.value.pacientes) {
      let paciente = await usuarioStore.getUsuario(idPaciente)
      pacientes.value.push(paciente)
    }
    await plantillaStore.loadPlantillas()
    loadingStore.stop()
  }

  load()
</script>

<template>
  <v-container v-if="!loadingStore.loading && especialista">
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
          <v-text-field 
            v-model="fechaAltaLocal" 
            label="Fecha de alta"
            type="datetime-local"
            :min="fechaActual.toISOString().slice(0, 16)"
          />
        </v-col>
        <v-col>
          <v-text-field 
            v-model="fechaFinLocal" 
            label="Fecha de fin"
            type="datetime-local"
            :min="fechaAltaLocal"
          />
        </v-col>
      </v-row>
      <v-list>
        <p>Pacientes:</p>
        <v-list-item 
          v-for="paciente in pacientesEstudio"
          :key="paciente.id"
        >
          <p>Nombre: {{ paciente.nombre }} {{ paciente.apellidos }}</p>
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
              <td>Nombre: {{ paciente.nombre }} {{ paciente.apellidos }}</td>
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
          label="Formulario"
          :items="plantillas"
          item-title="nombre"
          return-object
        />
        <v-row>
          <v-col>
            <v-text-field 
              v-model="fechaSeguimiento" 
              label="Fecha de seguimiento"
              type="datetime-local"
              :min="fechaActual.toISOString().slice(0, 16)"
            />
          </v-col>
          <v-col>
            <v-text-field 
              v-model="plazoSeguimiento" 
              label="Plazo límite"
              type="datetime-local"
              :min="fechaSeguimiento"
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
        
        <v-text-field 
          v-model="fechaAlerta" 
          label="Fecha de alerta"
          type="datetime-local"
          :min="fechaActual.toISOString().slice(0, 16)"
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