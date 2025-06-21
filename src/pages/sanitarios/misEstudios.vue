<script setup>
  import { storeToRefs } from 'pinia'
  import { useEstudioStore } from '@/stores/estudioStore'
  import { useLoadingStore } from '@/stores/loadingStore'
  const loadingStore = useLoadingStore()
  
  const estudioStore = useEstudioStore()
  const { estudios } = storeToRefs(estudioStore)

  async function load() {
    loadingStore.start()
    await estudioStore.loadEstudios()
    loadingStore.stop()
  }

  load()

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
        <tr
          v-for="estudio in estudios"
          :key="estudio.id"
        >
          <td>{{ estudio.id }}</td>
          <td>{{ estudio.nombre }}</td>
          <td>{{ estudio.descripcion }}</td>
          <td>
            <router-link :to="`./verEstudio/${estudio.id}`">
              <v-btn 
                icon="mdi-list-box-outline" 
                title="Ver datos"
              />
            </router-link>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>