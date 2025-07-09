<script setup>
  import { ref } from 'vue'
  import { useSesionStore } from '@/stores/sesionStore'
  import { useUsuarioStore } from '@/stores/usuarioStore'
  import { useLoadingStore } from '@/stores/loadingStore'
  const loadingStore = useLoadingStore()
  
  const sesionStore = useSesionStore()
  
  const especialista = ref(null)

  const usuarioStore = useUsuarioStore()
  const pacientes = ref([])

  // Variables para agregar pacientes
  const dialogAgregarPaciente = ref(false)
  const emailPaciente = ref('')
  const pacienteEncontrado = ref(null)
  const errorBusqueda = ref(false)
  const mensajeError = ref('')
  const dialogConfirmacion = ref(false)

  async function load() {
    loadingStore.start()
    especialista.value = await sesionStore.getUsuario()
    for (let idUsuario of especialista.value.pacientes) {
      const paciente = await usuarioStore.getUsuario(idUsuario)
      pacientes.value.push(paciente)
    }
    loadingStore.stop()
  }

  async function buscarPaciente() {
    if (!emailPaciente.value) {
      errorBusqueda.value = true
      mensajeError.value = 'Por favor, introduce un correo electrónico'
      return
    }

    loadingStore.start()
    try {
      const paciente = await usuarioStore.getUsuarioPorCorreo(emailPaciente.value, true)
      if (paciente && paciente.rol === 'paciente') {
        // Verificar si ya está en la lista
        if (pacientes.value.some(p => p.id === paciente.id)) {
          errorBusqueda.value = true
          mensajeError.value = 'Este paciente ya está en tu lista'
        } else {
          pacienteEncontrado.value = paciente
          errorBusqueda.value = false
          dialogConfirmacion.value = true
        }
      } else {
        errorBusqueda.value = true
        mensajeError.value = 'No se encontró un paciente con ese correo electrónico'
      }
    } catch {
      errorBusqueda.value = true
      mensajeError.value = 'Error al buscar el paciente'
    }
    loadingStore.stop()
  }

  async function confirmarAgregarPaciente() {
    loadingStore.start()
    try {
      // Aquí agregarías la lógica para agregar el paciente al sanitario
      // Por ejemplo, una llamada al backend
      pacientes.value.push(pacienteEncontrado.value)
      
      // Resetear variables
      emailPaciente.value = ''
      pacienteEncontrado.value = null
      dialogConfirmacion.value = false
      dialogAgregarPaciente.value = false
    } catch (error) {
      console.error('Error al agregar paciente:', error)
    }
    loadingStore.stop()
  }

  function calcularEdad(fechaNacimiento) {
    const hoy = new Date()
    const nacimiento = new Date(fechaNacimiento)
    let edad = hoy.getFullYear() - nacimiento.getFullYear()
    const mes = hoy.getMonth() - nacimiento.getMonth()
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--
    }
    return edad
  }

  function cerrarDialogos() {
    dialogAgregarPaciente.value = false
    dialogConfirmacion.value = false
    emailPaciente.value = ''
    pacienteEncontrado.value = null
    errorBusqueda.value = false
    mensajeError.value = ''
  }

  load()
</script>

<template>
  <v-container v-if="!loadingStore.loading && pacientes.length > 0">
    <v-btn 
      color="primary" 
      @click="dialogAgregarPaciente = true"
      class="mb-4"
    >
      <v-icon left>mdi-account-plus</v-icon>
      Agregar Paciente
    </v-btn>

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
            Opciones
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="paciente in pacientes"
          :key="paciente.id"
        >
          <td>{{ paciente.nombre }} {{ paciente.apellidos }}</td>
          <td>
            <router-link :to="`./verPaciente/${paciente.id}`">
              <v-btn 
                icon="mdi-list-box-outline" 
                title="Ver datos"
              />
            </router-link>
          </td>
        </tr>
      </tbody>
    </v-table>

    <!-- Dialog para agregar paciente -->
    <v-dialog v-model="dialogAgregarPaciente" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Agregar Paciente</span>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="emailPaciente"
            label="Correo electrónico del paciente"
            :rules="[v => !!v || 'Campo requerido']"
            type="email"
          />
          <v-alert
            v-if="errorBusqueda"
            type="error"
            closable
            @click:close="errorBusqueda = false"
          >
            {{ mensajeError }}
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cerrarDialogos">
            Cancelar
          </v-btn>
          <v-btn color="blue darken-1" text @click="buscarPaciente">
            Buscar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog de confirmación -->
    <v-dialog v-model="dialogConfirmacion" max-width="600px">
      <v-card v-if="pacienteEncontrado">
        <v-card-title>
          <span class="text-h5">Confirmar Agregar Paciente</span>
        </v-card-title>
        <v-card-text>
          <p>¿Deseas agregar a este paciente a tu lista?</p>
          <v-divider class="my-3"></v-divider>
          <v-row>
            <v-col cols="12" md="6">
              <strong>Nombre:</strong> {{ pacienteEncontrado.nombre }} {{ pacienteEncontrado.apellidos }}
            </v-col>
            <v-col cols="12" md="6">
              <strong>Edad:</strong> {{ calcularEdad(pacienteEncontrado.fechaNacimiento) }} años
            </v-col>
            <v-col cols="12" md="6">
              <strong>Sexo:</strong> {{ pacienteEncontrado.sexo }}
            </v-col>
            <v-col cols="12" md="6">
              <strong>Email:</strong> {{ pacienteEncontrado.email }}
            </v-col>
            <v-col cols="12">
              <strong>Dirección:</strong> {{ pacienteEncontrado.direccion }}
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" text @click="cerrarDialogos">
            Cancelar
          </v-btn>
          <v-btn color="green darken-1" text @click="confirmarAgregarPaciente">
            Confirmar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>