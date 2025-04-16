<script setup>
  import { ref } from 'vue'
  import axios from 'axios'
  import { useUsuarioStore } from '@/stores/usuarioStore'
  import { storeToRefs } from 'pinia'
  import { useEstudioStore } from '../../stores/estudioStore'

  const usuarioStore = useUsuarioStore()
  
  const urlApi = usuarioStore.getUrlApi()
  const urlEstudios = urlApi + "estudios/"
  const urlEspecialistas = urlApi + "usuarios/especialistas/"
  const idEspecialista = usuarioStore.getId()

  const especialista = ref(null)
  
  const estudioStore = useEstudioStore()
  const { estudios } = storeToRefs(estudioStore)

  async function loadEstudios() {
    let response2 = await axios.get(urlEstudios)
    for (let estudio of response2.data) {
      let newEstudio = { nombre: estudio.nombre, descripcion: estudio.descripcion }
      estudioStore.addEstudio(newEstudio)
    }
    
  }

  function verEstudio(estudio) {
    alert(estudio.descripcion)
  }

  async function loadEspecialista() {
    let response = await axios.get(urlEspecialistas + idEspecialista)
    especialista.value = response.data
    loadEstudios()
  }

  loadEspecialista()

</script>

<template>
  <v-container>
    <p>Mis estudios</p>
    <v-table height="200" fixed-header>
      <thead>
        <tr>
          <th>
            Nombre
          </th>
          <th>
            Descripción
          </th>
          <th>
            Opciones
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="estudio in estudios" :key="estudio.nombre">
          <td>{{ estudio.nombre }}</td>
          <td>{{ estudio.descripcion }}</td>
          <td>
            <v-btn icon="mdi-folder-open" title="Ver estudio" @click="verEstudio(estudio)"/>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>