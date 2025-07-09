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
  const motivoSeguimiento = ref("")
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
      motivo: motivoSeguimiento.value,
      formulario: plantilla.value
    })
    plantilla.value = null
    fechaSeguimiento.value = new Date().toISOString().slice(0, 16)
    plazoSeguimiento.value = new Date().toISOString().slice(0, 16)
    motivoSeguimiento.value = ""
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
    try {
      let estudio = { nombre: nombre.value, 
        descripcion: descripcion.value, 
        fechaInicio: fechaAltaLocal.value + ":00",
        fechaFin: fechaFinLocal.value + ":00" }
      
      console.log("Creando estudio con datos:", estudio)
      
      // Validar que los campos requeridos no estén vacíos
      if (!estudio.nombre || !estudio.descripcion) {
        console.error("Faltan campos requeridos")
        alert("Por favor, complete todos los campos requeridos")
        loadingStore.stop()
        return null
      }
      
      let response = await estudioStore.crearEstudio(estudio)
      console.log("Respuesta de creación:", response)

      if (!response) {
        console.error("No se recibió respuesta del servidor")
        loadingStore.stop()
        return null
      }

      if (response.status != 201) {
        console.error("Error al crear el estudio - Status:", response.status)
        loadingStore.stop()
        return null
      }

      let location = response.headers.get("location")
      console.log("Location header:", location)
      
      if (!location) {
        console.error("No se recibió el header Location")
        loadingStore.stop()
        return null
      }
      
      let idEstudio = location.split("/").at(-1)
      console.log("ID extraído:", idEstudio)
      
      if (!idEstudio) {
        console.error("No se pudo obtener el ID del estudio creado")
        loadingStore.stop()
        return null
      }
      
      return idEstudio
    } catch (error) {
      console.error("Error en doCrearEstudio:", error)
      console.error("Stack trace:", error.stack)
      alert("Error al crear el estudio: " + error.message)
      loadingStore.stop()
      return null
    }
  }

  async function doAgregarPacientesEstudio(idEstudio) {
    if (!idEstudio) {
      console.error("ID de estudio no válido para agregar pacientes")
      return false
    }
    
    let pacientesIds = pacientesEstudio.value.map((p) => p.id)
    let pacientesResponse = await estudioStore.agregarPacientes(idEstudio, pacientesIds)
    if (pacientesResponse.status != 204) {
      console.log("Error al agregar pacientes")
      loadingStore.stop()
      return false
    }
    return true
  }

  async function doAgregarSeguimientosEstudio(idEstudio) {
    if (!idEstudio) {
      console.error("ID de estudio no válido para agregar seguimientos")
      return false
    }
    
    try {
      let seguimientosIds = []
      for (let seguimiento of seguimientosEstudio.value) {
        let body = { 
          fecha: seguimiento.fecha, 
          plazo: seguimiento.plazo, 
          motivo: seguimiento.motivo,
          plantilla: seguimiento.formulario.id 
        }
        console.log("Creando seguimiento con body:", body)
        
        try {
          let seguimientoResponse = await seguimientoStore.crearSeguimiento(body)
          console.log("Respuesta crear seguimiento:", seguimientoResponse)
          
          if (!seguimientoResponse) {
            console.error("No se recibió respuesta al crear seguimiento")
            loadingStore.stop()
            return false
          }
          
          if (seguimientoResponse.status && seguimientoResponse.status != 201) {
            console.error("Error al crear el seguimiento", seguimiento.id, "Status:", seguimientoResponse.status)
            loadingStore.stop()
            return false
          }
          
          let locationSeguimiento = seguimientoResponse.headers?.get("location")
          console.log("Location header seguimiento:", locationSeguimiento)
          
          if (!locationSeguimiento) {
            console.error("No se recibió location header para seguimiento")
            loadingStore.stop()
            return false
          }
          
          let idSeguimiento = locationSeguimiento.split("/").at(-1)
          console.log("ID seguimiento extraído:", idSeguimiento)
          seguimientosIds.push(idSeguimiento)
        } catch (seguimientoError) {
          console.error("Error específico al crear seguimiento:", seguimientoError)
          console.error("Stack trace seguimiento:", seguimientoError.stack)
          loadingStore.stop()
          return false
        }
      }

      console.log("IDs de seguimientos a agregar:", seguimientosIds)
      
      if (seguimientosIds.length === 0) {
        console.log("No hay seguimientos para agregar al estudio")
        return true
      }
      
      let seguimientosResponse = await estudioStore.agregarSeguimientos(idEstudio, seguimientosIds)
      console.log("Respuesta agregar seguimientos al estudio:", seguimientosResponse)

      if (!seguimientosResponse || seguimientosResponse.status != 204) {
        console.error("Error al agregar seguimientos al estudio. Status:", seguimientosResponse?.status)
        loadingStore.stop()
        return false
      }
      return true
    } catch (error) {
      console.error("Error en doAgregarSeguimientosEstudio:", error)
      console.error("Stack trace:", error.stack)
      loadingStore.stop()
      return false
    }
  }

  async function doAgregarAlertasEstudio(idEstudio) {
    if (!idEstudio) {
      console.error("ID de estudio no válido para agregar alertas")
      return false
    }
    
    let alertasIds = []
    for (let alerta of alertasEstudio.value) {
      let body = { 
        fecha: alerta.fecha, 
        asunto: alerta.asunto, 
        mensaje: alerta.mensaje,
        emisor: especialista.value.id,
        receptor: "6855a468e35152597a19ac5b"
      }
      console.log("Creando alerta con body:", body)
      
      let alertaResponse = await alertaStore.crearAlerta(body)
      console.log("Respuesta crear alerta:", alertaResponse)
      
      if (!alertaResponse || alertaResponse.status != 201) {
        console.log("Error al crear la alerta " + alerta.id)
        loadingStore.stop()
        return false
      }
      let locationAlerta = alertaResponse.headers.get("location")
      let idAlerta = locationAlerta.split("/").at(-1)
      alertasIds.push(idAlerta)
    }

    let alertasResponse = await estudioStore.agregarAlertas(idEstudio, alertasIds)

    if (alertasResponse.status != 204) {
      console.log("Error al agregar alertas al estudio")
      loadingStore.stop()
      return false
    }
    return true
  }

  async function asignarEstudio(idEstudio) {
    if (!idEstudio) {
      console.error("ID de estudio no válido para asignar")
      return false
    }
    
    let body = { especialista: especialista.value.id, estudio: idEstudio, rol: 'CREADOR'}
    let response = await asignacionEstudioStore.crearAsignacion(body)
    if (response.status != 201) {
      console.log("Error al asignar el estudio al especialista")
      loadingStore.stop()
      return false
    }
    return true
  }

  async function publicarEstudio() {
    loadingStore.start()
    
    let idEstudio = await doCrearEstudio()
    if (!idEstudio) {
      console.error("No se pudo crear el estudio")
      loadingStore.stop()
      return
    }
    
    const pacientesResult = await doAgregarPacientesEstudio(idEstudio)
    if (!pacientesResult) {
      console.error("Error agregando pacientes")
      loadingStore.stop()
      return
    }
    
    const seguimientosResult = await doAgregarSeguimientosEstudio(idEstudio)
    if (!seguimientosResult) {
      console.error("Error agregando seguimientos")
      loadingStore.stop()
      return
    }
    
    const alertasResult = await doAgregarAlertasEstudio(idEstudio)
    if (!alertasResult) {
      console.error("Error agregando alertas")
      loadingStore.stop()
      return
    }
    
    const asignacionResult = await asignarEstudio(idEstudio)
    if (!asignacionResult) {
      console.error("Error asignando estudio")
      loadingStore.stop()
      return
    }
    
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
            label="Fecha de inicio"
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
          <p>Motivo: {{ seguimiento.motivo }}</p>
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
        <v-text-field 
          v-model="motivoSeguimiento" 
          label="Motivo del seguimiento"
        />
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