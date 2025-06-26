<script setup>
  import { ref, computed } from 'vue';
  import { useSesionStore } from '@/stores/sesionStore';
  import { useAlertaStore } from '@/stores/alertaStore';
  import { useUsuarioStore } from '@/stores/usuarioStore';
  import { useLoadingStore } from '@/stores/loadingStore';

  const sesionStore = useSesionStore()
  const loadingStore = useLoadingStore()
  const usuarioStore = useUsuarioStore()
  const alertaStore = useAlertaStore()

  const usuario = ref(null)
  const alertas = ref([])
  const pacientes = ref([])
  const pacientesAgregados = ref([])

  const pacientesRestantes = computed(() => {
    pacientes.value
    return pacientes.value.filter((p) => !pacientesAgregados.value.includes(p))
  })

  const agregarAlertaValue = ref(false)
  const agregarPacienteValue = ref(false)

  const cont = ref(0)
  const fechaActual = ref(new Date())

  const asunto = ref('')
  const mensaje = ref('')
  const fecha = ref(null)

  function agregarAlerta() {
    let alerta = { id: cont.value, asunto: asunto.value, mensaje: mensaje.value, fecha: fecha.value }
    alertas.value.push(alerta)
    cont.value++
    asunto.value = ''
    mensaje.value = ''
    fecha.value = null
    agregarAlertaValue.value = false
  }

  function agregarPaciente(paciente) {
    pacientesAgregados.value.push(paciente)
    agregarPacienteValue.value = false
  }

  async function publicarAlertas() {
    loadingStore.start()
    // Crear las alertas
    for (let paciente of pacientesAgregados.value) {
      for (let alerta of alertas.value) {
        let body = { 
          emisor: usuario.value.id,
          receptor: paciente.id,
          asunto: alerta.asunto,
          mensaje: alerta.mensaje,
          fecha: alerta.fecha}
        let response = await alertaStore.crearAlerta(body)
        if (!response.status == 201) {
          console.log("No se ha podido crear la alerta " + JSON.stringify(alerta))
          loadingStore.stop()
          return
        }
      }
    }
    loadingStore.stop()
  }

  async function loadPacientes() {
    loadingStore.start()
    usuario.value = await sesionStore.getUsuario()
    for (let idPaciente of usuario.value.pacientes) {
      let paciente = await usuarioStore.getUsuario(idPaciente)
      pacientes.value.push(paciente)
    }
    loadingStore.stop()
  }

  loadPacientes()
</script>

<template>
  <v-container>
    <v-form>
      <v-list>
        <p>Pacientes:</p>
        <v-list-item 
          v-for="paciente in pacientesAgregados"
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
      </v-container>
      <v-list>
        <p>Alertas</p>
        <v-list-item 
          v-for="alerta in alertas"
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
          v-model="asunto" 
          label="Asunto"
        />
        <v-text-field 
          v-model="mensaje" 
          label="Mensaje"
        />
        
        <v-date-picker 
          v-model="fecha"
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
        @click="publicarAlertas()"
      >
        Guardar
      </v-btn>
    </v-form>
  </v-container>
</template>