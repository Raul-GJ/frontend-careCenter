<script setup>
  import { ref, computed } from 'vue';
  import { usePacienteStore } from '@/stores/pacienteStore';
  import { storeToRefs } from 'pinia';
  import { crearAlerta } from '@/services/apiAlertas';
  import { agregarAlertas } from '@/services/apiUsuarios';

  const pacienteStore = usePacienteStore()

  const alertas = ref([])
  const pacientes = storeToRefs(pacienteStore)
  const pacientesAgregados = ref([])
  const idAlertas = ref([])

  const pacientesRestantes = computed(() => {
    pacientes.pacientes.value
    return pacientes.pacientes.value.filter((p) => !pacientesAgregados.value.includes(p))
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
    
    // Crear las alertas
    for (let alerta of alertas.value) {
      let body = { asunto: alerta.asunto, mensaje: alerta.mensaje, fecha: alerta.fecha}
      let response = await crearAlerta(body)
      if (!response.status == 201) {
        console.log("No se ha podido crear la alerta " + JSON.stringify(alerta))
        return
      }

      let location = response.headers.get("location")
      let idAlerta = location.split("/")[6]
      idAlertas.value.push(idAlerta)
    }

    // Agregar las alertas a los pacientes
    for (let paciente of pacientesAgregados.value) {
      console.log(JSON.stringify(idAlertas.value))
      let response = await agregarAlertas(paciente.id, idAlertas.value)
      if (!response.status == 204) {
        console.log("No se ha podido agregar la alerta al usuario con id" + paciente.id)
        return
      }
    }
  }

  pacienteStore.loadPacientes()
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
      </v-container>
      <v-list>
        <p>Alertas</p>
        <v-list-item 
          v-for="alerta in alertas"
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