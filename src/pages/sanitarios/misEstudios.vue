<script setup>
  import { ref } from 'vue'
  import axios from 'axios'
  import { useUsuarioStore } from '@/stores/usuarioStore'
  import { storeToRefs } from 'pinia'
  import { useEstudioStore } from '@/stores/estudioStore'

  const usuarioStore = useUsuarioStore()
  
  const urlApi = usuarioStore.getUrlApi()
  const urlEspecialistas = urlApi + "usuarios/especialistas/"
  const idEspecialista = usuarioStore.getId()

  const especialista = ref(null)
  
  const estudioStore = useEstudioStore()
  const { estudios } = storeToRefs(estudioStore)

  function verEstudio(estudio) {
    alert(estudio.descripcion)
  }

  async function loadEspecialista() {
    let response = await axios.get(urlEspecialistas + idEspecialista)
    especialista.value = response.data
    estudioStore.loadEstudios()
  }

  loadEspecialista()

</script>

<template>
  <v-container>
    <router-link to="./crearEstudio">
      <v-btn prepend-icon="mdi-plus-circle">
        Crear estudio
      </v-btn>
    </router-link>
    <p>Estudios</p>
    <v-table 
      height="200" 
      fixed-header
    >
      <thead>
        <tr>
          <th>
            Id
          </th>
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
        <tr v-for="estudio in estudios" :key="estudio.id">
          <td>{{ estudio.id }}</td>
          <td>{{ estudio.nombre }}</td>
          <td>{{ estudio.descripcion }}</td>
          <td>
            <v-btn icon="mdi-folder-open" title="Ver estudio" @click="verEstudio(estudio)"/>
            <v-btn icon="mdi-text-box-edit" title="Editar estudio" />
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>