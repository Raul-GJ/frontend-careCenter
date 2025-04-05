<script setup>
  import { ref } from 'vue'
  import axios from 'axios'
  import { storeToRefs } from 'pinia'
  import { pacienteStore } from '../../stores/pacienteStore'
  
  const especialista = ref(null)

  const urlApi = "http://localhost:8080/salud/api/"
  const urlEspecialistas = urlApi + "usuarios/especialistas/"
  const urlPacientes = urlApi + "usuarios/pacientes/"
  const idEspecialista = "67f0e0995b95213262208374"

  const pStore = pacienteStore()
  const { pacientes } = storeToRefs(pStore)

  async function loadPacientes() {
    let lista = especialista.value.pacientes
    for (let id of lista) {
      if (!pStore.getPaciente(id)) {
        let response2 = await axios.get(urlPacientes + id)
        let newPaciente = response2.data
        newPaciente.id = id
        pStore.addPaciente(newPaciente)
      }
    }
  }

  async function loadEspecialista() {
    let response = await axios.get(urlEspecialistas + idEspecialista)
    especialista.value = response.data
    loadPacientes()
  }

  loadEspecialista()

</script>

<template>
  <v-container>
    <v-table height="200" fixed-header>
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
        <tr v-for="paciente in pacientes" :key="paciente.id">
          <td>{{ paciente.id }}</td>
          <td>{{ paciente.nombre }}</td>
          <td>
            <v-btn icon="mdi-folder-plus" title="Añadir a estudio" />
            <v-btn icon="mdi-bell-plus" title="Añadir alerta" />
            <v-btn icon="mdi-list-box-outline" title="Ver seguimiento" />
            <v-btn icon="mdi-text-box-edit" title="Modificar datos clinicos" />
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>