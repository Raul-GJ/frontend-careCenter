<script setup>
  import { storeToRefs } from 'pinia'
  import { usePlantillaStore } from '@/stores/plantillaStore'
  import { useLoadingStore } from '@/stores/loadingStore'
  const loadingStore = useLoadingStore()
  
  const plantillaStore = usePlantillaStore()
  const { plantillas } = storeToRefs(plantillaStore)

  async function loadPlantillas() {
    loadingStore.start()
    await plantillaStore.loadPlantillas()
    loadingStore.stop()
  }

  loadPlantillas()
</script>

<template>
  <v-container>
    <router-link to="./crearPlantilla">
      <v-btn prepend-icon="mdi-plus-circle">
        Crear plantilla
      </v-btn>
    </router-link>
    <h1>Mis plantillas de formularios</h1>
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
        <tr
          v-for="plantilla in plantillas"
          :key="plantilla.id"
        >
          <td>{{ plantilla.id }}</td>
          <td>{{ plantilla.nombre }}</td>
          <td>{{ plantilla.descripcion }}</td>
          <td>
            <router-link :to="`./verPlantilla/${plantilla.id}`">
              <v-btn 
                icon="mdi-list-box-outline" 
                title="Ver plantilla"
              />
            </router-link>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>