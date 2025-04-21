<script setup>
  import { ref } from 'vue'
  import axios from 'axios'
  import { useUsuarioStore } from '@/stores/usuarioStore'
  import { storeToRefs } from 'pinia'
  import { usePlantillaStore } from '@/stores/plantillaStore'

  const usuarioStore = useUsuarioStore()
  
  const urlApi = usuarioStore.getUrlApi()
  const urlEspecialistas = urlApi + "usuarios/especialistas/"
  const idEspecialista = usuarioStore.getId()

  const especialista = ref(null)
  
  const plantillaStore = usePlantillaStore()
  const { plantillas } = storeToRefs(plantillaStore)

  async function loadEspecialista() {
    let response = await axios.get(urlEspecialistas + idEspecialista)
    especialista.value = response.data
    plantillaStore.loadPlantillas()
  }

  loadEspecialista()
</script>

<template>
  <v-container>
    <router-link to="./crearPlantilla">
      <v-btn prepend-icon="mdi-plus-circle">Crear plantilla</v-btn>
    </router-link>
    <h1>Mis plantillas de formularios</h1>
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
            Descripción
          </th>
          <th>
            Opciones
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="plantilla in plantillas" :key="plantilla.id" >
          <td>{{ plantilla.id }}</td>
          <td>{{ plantilla.nombre }}</td>
          <td>{{ plantilla.descripcion }}</td>
          <td>
            <v-btn icon="mdi-folder-open" title="Ver consulta" @click="leerConsulta(consulta)"/>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>