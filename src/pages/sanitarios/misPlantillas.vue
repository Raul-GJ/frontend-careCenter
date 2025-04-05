<script setup>
  import { ref } from 'vue'
  import axios from 'axios'
  import { storeToRefs } from 'pinia'
  import { plantillaStore } from '../../stores/plantillaStore'

  const urlApi = "http://localhost:8080/salud/api/"
  const urlPlantillas = urlApi + "plantillas/"
  const urlEspecialistas = urlApi + "usuarios/especialistas/"
  const idEspecialista = "67f0e0995b95213262208374"

  const especialista = ref(null)
  
  const pStore = plantillaStore()
  const { plantillas } = storeToRefs(pStore)

  async function loadPlantillas() {
    let lista = especialista.value.plantillas
    for (let id of lista) {
      if (!pStore.getPlantilla(id)) {
        let response2 = await axios.get(urlPlantillas + id)
        let newPlantilla = response2.data
        newPlantilla.id = id
        pStore.addPlantilla(newPlantilla)
      }
    }
  }

  async function loadEspecialista() {
    let response = await axios.get(urlEspecialistas + idEspecialista)
    especialista.value = response.data
    loadPlantillas()
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