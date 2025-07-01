<script setup>
  import { useRoute } from 'vue-router'
  import { computed, ref } from 'vue'
  import { useEstudioStore } from '@/stores/estudioStore'
  import { useUsuarioStore } from '@/stores/usuarioStore'
  import { useSeguimientoStore } from '@/stores/seguimientoStore'
  import { useAlertaStore } from '@/stores/alertaStore'
  import { useLoadingStore } from '@/stores/loadingStore'
  const loadingStore = useLoadingStore()

  const estudioStore = useEstudioStore()
  const usuarioStore = useUsuarioStore()
  const alertaStore = useAlertaStore()
  const seguimientoStore = useSeguimientoStore()

  const route = useRoute()
  const idEstudio = route.params.id

  const estudio = ref(null)
  const pacientes = ref([])
  const alertas = ref([])
  const seguimientos = ref([])

  const nombreAnterior = ref('')
  const descripcionAnterior = ref('')
  const fechaInicioAnterior = ref(null)
  const fechaFinAnterior = ref(null)

  const editarEstudioValue = ref(false)
  const agregarPacientesValue = ref(false)
  const agregarAlertaValue = ref(false)
  const agregarSeguimientoValue = ref(false)
  const invitarEspecialistasValue = ref(false)

  const agregarPacientesArray = ref([])

  const asuntoAlerta = ref('')
  const mensajeAlerta = ref('')
  const fechaAlerta = ref(null)
  const fechaActual = ref(new Date())

  const motivoSeguimiento = ref('')
  const fechaSeguimiento = ref(null)
  const plazoSeguimiento = ref(null)
  const plantillaSeguimiento = ref(null)

  const especialistaCorreo = ref('')
  const especialistaRol = ref('OBSERVADOR')

  const pacientesRestantes = computed(() => {
    return pacientes.value.filter(paciente => 
      !agregarPacientesArray.value.includes(paciente.id)
    )
  })

  function editarEstudio() {
    editarEstudioValue.value = !editarEstudioValue.value
    if (editarEstudioValue.value) {
      // Guardar los valores anteriores para restaurar si se cancela la edición
      nombreAnterior.value = estudio.value.nombre
      descripcionAnterior.value = estudio.value.descripcion
      fechaInicioAnterior.value = estudio.value.fechaInicio
      fechaFinAnterior.value = estudio.value.fechaFin
    } else {
      // Restaurar los valores anteriores si se cancela la edición
      estudio.value.nombre = nombreAnterior.value
      estudio.value.descripcion = descripcionAnterior.value
      estudio.value.fechaInicio = fechaInicioAnterior.value
      estudio.value.fechaFin = fechaFinAnterior.value
    }
  }

  async function guardarCambios() {
    loadingStore.start()
    try {
      await estudioStore.setEstudio(estudio.value.id, estudio.value)
      editarEstudioValue.value = false
      console.log('Estudio modificado correctamente')
    } catch (error) {
      console.error('Error al modificar el estudio:', error)
    }
    loadingStore.stop()
  }

  async function agregarPacientes() {
    // Implementar lógica para agregar pacientes
    console.log('Agregar pacientes')
  }

  async function agregarAlerta() {
    // Implementar lógica para agregar alerta
    console.log('Agregar alerta')
  }

  async function agregarSeguimiento() {
    // Implementar lógica para agregar seguimiento
    console.log('Agregar seguimiento')
  }

  async function invitarEspecialista() {
    // Implementar lógica para invitar especialista
    console.log('Agregar especialistas')
  }

  async function loadPacientes() {
    for (let pacienteId of estudio.value.pacientes) {
      const paciente = await usuarioStore.getUsuario(pacienteId)
      pacientes.value.push(paciente)
    }
  }

  async function loadAlertas() {
    for (let alertaId of estudio.value.alertas) {
      const alerta = await alertaStore.getAlerta(alertaId)
      console.log(alerta)
      alertas.value.push(alerta)
    }
  }

  async function loadSeguimientos() {
    for (let seguimientoId of estudio.value.seguimientos) {
      const seguimiento = await seguimientoStore.getSeguimiento(seguimientoId)
      seguimientos.value.push(seguimiento)
    }
  }

  async function loadEstudio() {
    loadingStore.start()
    await estudioStore.loadEstudios()
    estudio.value = await estudioStore.getEstudio(idEstudio)
    await loadPacientes()
    await loadAlertas()
    await loadSeguimientos()
    console.log(estudio.value)
    loadingStore.stop()
  }

  loadEstudio()
</script>

<template>
  <v-container>
    <div v-if="!loadingStore.loading && estudio">
      <v-container>
        <div v-if="editarEstudioValue">
          <p>Nombre</p>
          <v-text-field
            v-model="estudio.nombre"
            variant="solo"
          />
          
          <p>Descripción</p>
          <v-text-field
            v-model="estudio.descripcion"
            variant="solo"
          />

          <p>Fecha de inicio</p>
          <v-text-field
            v-model="estudio.fechaInicio"
            variant="solo"
          />

          <p>Fecha de fin</p>
          <v-text-field
            v-model="estudio.fechaFin"
            variant="solo"
          />

          <v-btn
            prepend-icon="mdi-close"
            @click="editarEstudio()"
          >
            Cancelar cambios
          </v-btn>

          <v-btn
            prepend-icon="mdi-check"
            @click="guardarCambios()"
          >
            Confirmar cambios
          </v-btn>
        </div>
        <div v-else>
          <p>Nombre</p>
          <v-text-field
            v-model="estudio.nombre"
            variant="solo"
            disabled
          />
          
          <p>Descripción</p>
          <v-text-field
            v-model="estudio.descripcion"
            variant="solo"
            disabled
          />

          <p>Fecha de inicio</p>
          <v-text-field
            v-model="estudio.fechaInicio"
            variant="solo"
            disabled
          />

          <p>Fecha de fin</p>
          <v-text-field
            v-model="estudio.fechaFin"
            variant="solo"
            disabled
          />
          <v-btn
            prepend-icon="mdi-pencil"
            @click="editarEstudio()"
          >
            Editar estudio
          </v-btn>
        </div>

        <p>Pacientes</p>
        <v-table
          height="200"
          fixed-header
        >
          <thead>
            <tr>
              <th>
                Nombre
              </th>
              <th>
                Apellidos
              </th>
              <th>
                Opciones
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="paciente in pacientes"
              :key="paciente.id"
            >
              <td>{{ paciente.nombre }}</td>
              <td>{{ paciente.apellidos }}</td>
              <td>
                <router-link :to="`/sanitarios/verPaciente/${paciente.id}`">
                  <v-btn 
                    icon="mdi-folder-open" 
                    title="Ver paciente"
                  />
                </router-link>
              </td>
            </tr>
          </tbody>
        </v-table>
        <div v-if="agregarPacientesValue">
          <v-table
            height="200"
            fixed-header
          >
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellidos</th>
                <th>Opciones</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="paciente in pacientesRestantes"
                :key="paciente.id"
              >
                <td>{{ paciente.nombre }}</td>
                <td>{{ paciente.apellidos }}</td>
                <td>
                  <v-btn 
                    icon="mdi-plus-circle" 
                    title="Agregar paciente"
                    @click="agregarPacientesArray.push(paciente.id)"
                  />
                </td>
              </tr>
            </tbody>
            <v-btn 
              prepend-icon="mdi-close" 
              @click="agregarPacientesValue = false; agregarPacientesArray = []"
            >
              Cancelar
            </v-btn>
            <v-btn 
              prepend-icon="mdi-check" 
              :disabled="agregarPacientesArray.length === 0"
              @click="agregarPacientes()"
            >
              Confirmar selección
            </v-btn>
          </v-table>
        </div>
        <div v-else>
          <v-btn @click="agregarPacientesValue = true">
            Agregar pacientes
          </v-btn>
        </div>

        <p>Alertas</p>
        <v-table
          height="200"
          fixed-header
        >
          <thead>
            <tr>
              <th>
                Asunto
              </th>
              <th>
                Fecha
              </th>
              <th>
                Opciones
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="alerta in alertas"
              :key="alerta.id"
            >
              <td>{{ alerta.asunto }}</td>
              <td>{{ alerta.fecha }}</td>
              <td>
                <router-link :to="`/leerAlerta/${alerta.id}`">
                  <v-btn 
                    icon="mdi-folder-open" 
                    title="Ver alerta"
                  />
                </router-link>
              </td>
            </tr>
          </tbody>
        </v-table>
        <div v-if="agregarAlertaValue">
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
              label="Fecha"
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
        </div>
        <div v-else>
          <v-btn @click="agregarAlertaValue = true">
            Agregar alertas
          </v-btn>
        </div>

        <p>seguimientos</p>
        <v-table
          height="200"
          fixed-header
        >
          <thead>
            <tr>
              <th>
                motivo
              </th>
              <th>
                Fecha
              </th>
              <th>
                Plazo
              </th>
              <th>
                Opciones
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="seguimiento in seguimientos"
              :key="seguimiento.id"
            >
              <td>{{ seguimiento.motivo }}</td>
              <td>{{ seguimiento.fecha }}</td>
              <td>{{ seguimiento.plazo }}</td>
              <td>
                <router-link :to="`/verSeguimiento/${seguimiento.id}`">
                  <v-btn 
                    icon="mdi-folder-open" 
                    title="Abrir seguimiento"
                  />
                </router-link>
              </td>
            </tr>
          </tbody>
        </v-table>
        <div v-if="agregarSeguimientoValue">
          <v-container v-if="agregarSeguimientoValue">
            <v-text-field 
              v-model="motivoSeguimiento" 
              label="Motivo"
            />
            
            <v-text-field 
              v-model="fechaSeguimiento" 
              label="Fecha"
              type="datetime-local"
              :min="fechaActual.toISOString().slice(0, 16)"
            />

            <v-text-field 
              v-model="plazoSeguimiento" 
              label="Plazo"
              type="datetime-local"
              :min="fechaSeguimiento"
            />

            <v-select 
              v-model="plantillaSeguimiento" 
              :items="seguimientoStore.plantillas" 
              item-text="nombre" 
              item-value="id" 
              label="Seleccionar plantilla"
            />

            <v-btn 
              prepend-icon="mdi-plus-outline" 
              @click="agregarSeguimiento()"
            >
              Agregar seguimiento
            </v-btn>
          </v-container>
        </div>
        <div v-else>
          <v-btn @click="agregarSeguimientoValue = true">
            Agregar seguimientos
          </v-btn>
        </div>

        <p>Especialistas</p>
        <v-table
          height="200"
          fixed-header
        >
          <thead>
            <tr>
              <th>
                Nombre
              </th>
              <th>
                Apellidos
              </th>
              <th>
                Especialidad
              </th>
              <th>
                Rol
              </th>
              <th>
                Opciones
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="especialista in estudio.especialistas"
              :key="especialista.id"
            >
              <td>{{ especialista.nombre }}</td>
              <td>{{ especialista.apellidos }}</td>
              <td>{{ especialista.especialidad }}</td>
              <td>{{ especialista.rol }}</td>
              <td>
                <router-link :to="`/verSanitario/${especialista.id}`">
                  <v-btn 
                    icon="mdi-folder-open"
                    title="Ver especialista"
                  />
                </router-link>
              </td>
            </tr>
          </tbody>
        </v-table>
        <div v-if="invitarEspecialistasValue">
          <v-container>
            <v-text-field 
              v-model="especialistaCorreo" 
              label="Correo del especialista"
            />
            <v-select 
              v-model="especialistaRol" 
              :items="['EDITOR', 'OBSERVADOR']" 
              label="Rol del especialista"
            />
            <v-btn 
              prepend-icon="mdi-plus-outline" 
              @click="invitarEspecialista()"
            >
              Invitar especialista
            </v-btn>
          </v-container>
        </div>
        <div v-else>
          <v-btn @click="invitarEspecialistasValue = true">
            Invitar especialistas
          </v-btn>
        </div>
      </v-container>
    </div>
  </v-container>
</template>


