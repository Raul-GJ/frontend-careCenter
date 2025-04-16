<script setup>
  import { ref } from 'vue'
  import axios from 'axios'
  import { useUsuarioStore } from '@/stores/usuarioStore'
  import { useSeguimientoStore } from '@/stores/seguimientoStore'
  import { storeToRefs } from 'pinia'

  const usuarioStore = useUsuarioStore()
  
  const headers = {
    headers: {
      "Content-Type": "application/json"
    }
  }

  const seguimientoStore = useSeguimientoStore()
  const { seguimientos } = storeToRefs(seguimientoStore)

  const urlApi = usuarioStore.getUrlApi()
  const urlSeguimientos = urlApi + "seguimientos/"
  const urlPacientes = urlApi + "usuarios/pacientes/"
  const idPaciente = usuarioStore.getId()

  const paciente = ref(null)

  async function loadSeguimientos() {
    let lista = paciente.value.seguimientos
    
    for (let id of lista) {
      if (!seguimientoStore.getSeguimiento(id)) {
        let response = await axios.get(urlSeguimientos + id)
        let newSeguimiento = response.data
        newSeguimiento.id = id
        seguimientoStore.addSeguimiento(newSeguimiento)
      }
    }
  }
  
  async function loadPaciente() {
    let response = await axios.get(urlPacientes + idPaciente)
    paciente.value = response.data
    loadSeguimientos()
  }

  loadPaciente()
</script>

<template>
  <v-container>
    <h1>Mis seguimientos</h1>
    <v-table
      height="200" 
      fixed-header
    >
      <thead>
        <tr>
          <th>Id</th>
          <th>Nombre</th>
          <th>Fecha</th>
          <th>Opciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="seguimiento in seguimientos" :key="seguimiento.id">
          <td>{{ seguimiento.id }}</td>
          <td>{{ seguimiento.formulario.plantilla }}</td>
          <td>{{ seguimiento.fecha }}</td>
          <td>
            <v-btn icon="mdi-folder-open" title="Ver seguimiento" @click="verSeguimiento(seguimiento)"/>
            <v-btn icon="mdi-text-box-edit" title="Rellenar seguimiento" />
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>